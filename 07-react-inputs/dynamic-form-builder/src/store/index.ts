import { configureStore, createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { BuilderField } from "../types";

// Persistence helpers //

const STORAGE_KEY = "formbuilder_schema";

function loadFromStorage(): { title: string; fields: BuilderField[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeToStorage(title: string, fields: BuilderField[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, fields }));
  } catch {
    // storage quota exceeded or private-browsing restrictions //
    console.log("Write To Storage Failed");
  }
}

// State //

interface SchemaState {
  title: string;
  fields: BuilderField[];
  saveStatus: "idle" | "saving" | "saved" | "error";
  _committed: { title: string; fields: BuilderField[] } | null;
}

// Rehydrate from localStorage on startup so state survives page reloads //
const persisted = loadFromStorage();

const initial: SchemaState = {
  title:      persisted?.title  ?? "My Form",
  fields:     persisted?.fields ?? [],
  saveStatus: "idle",
  _committed: null,
};

// Slice //

const schemaSlice = createSlice({
  name: "schema",
  initialState: initial,
  reducers: {
    setTitle(s, a: PayloadAction<string>) {
      s.title = a.payload;
    },
    setFields(s, a: PayloadAction<BuilderField[]>) {
      s.fields = a.payload;
    },
    addField(s, a: PayloadAction<BuilderField>) {
      s.fields.push(a.payload);
    },
    removeField(s, a: PayloadAction<string>) {
      s.fields = s.fields.filter(f => f.id !== a.payload);
    },
    updateField(s, a: PayloadAction<BuilderField>) {
      const i = s.fields.findIndex(f => f.id === a.payload.id);
      if (i !== -1) s.fields[i] = a.payload;
    },
    moveField(s, a: PayloadAction<{ idx: number; dir: -1 | 1 }>) {
      const { idx, dir } = a.payload;
      const to = idx + dir;
      if (to < 0 || to >= s.fields.length) return;
      [s.fields[idx], s.fields[to]] = [s.fields[to], s.fields[idx]];
    },

    // Optimistic persistence //
    savePending(s) {
      s._committed = { title: s.title, fields: s.fields };
      s.saveStatus = "saving";
    },
    saveFulfilled(s) {
      s._committed = null;
      s.saveStatus = "saved";
    },
    saveRejected(s) {
      if (s._committed) {
        s.title  = s._committed.title;
        s.fields = s._committed.fields;
      }
      s._committed = null;
      s.saveStatus = "error";
    },
    resetSaveStatus(s) {
      s.saveStatus = "idle";
    },
  },
});

export const {
  setTitle, setFields, addField, removeField,
  updateField, moveField,
  savePending, saveFulfilled, saveRejected, resetSaveStatus,
} = schemaSlice.actions;

// Store //

export const store = configureStore({
  reducer: { schema: schemaSlice.reducer },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Memoized selectors //

const selectSchema    = (s: RootState) => s.schema;
export const selectTitle      = (s: RootState) => s.schema.title;
export const selectFields     = (s: RootState) => s.schema.fields;
export const selectSaveStatus = (s: RootState) => s.schema.saveStatus;

export const selectCompiledSchema = createSelector(
  selectTitle,
  selectFields,
  (title, fields) => ({
    title,
    fields: fields.map(f => ({
      id:           f.fieldId || f.id,
      type:         f.type,
      label:        f.label,
      placeholder:  f.placeholder || undefined,
      options:      f.options.length ? f.options : undefined,
      defaultValue: f.defaultValue || undefined,
      validation:   Object.fromEntries(
        Object.entries(f.validation).filter(([, v]) => v !== "" && v !== false && v !== undefined)
      ),
    })),
  })
);

// Async thunk — optimistic save //

export function saveSchema() {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(savePending());
    const { title, fields } = getState().schema;
    try {
      await persistSchema(title, fields);
      dispatch(saveFulfilled());
    } catch {
      dispatch(saveRejected());   // UI reverts to committed snapshot
    }
    setTimeout(() => dispatch(resetSaveStatus()), 2000);
  };
}

// Writes to localStorage and simulates a network round-trip //
async function persistSchema(title: string, fields: BuilderField[]) {
  // write locally first so the data is never lost even if the API call fails //
  writeToStorage(title, fields);

  // simulate network //
  // Because there is no actual server right now //
  await new Promise<void>((res, rej) =>
    setTimeout(() => Math.random() < 0.1 ? rej(new Error("network")) : res(), 200)
  );
}