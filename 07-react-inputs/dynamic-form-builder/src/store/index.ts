import { configureStore, createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { BuilderField } from "../types";

// State //

interface SchemaState {
  title: string;
  fields: BuilderField[];
  saveStatus: "idle" | "saving" | "saved" | "error";
  // snapshot used for optimistic rollback
  _committed: { title: string; fields: BuilderField[] } | null;
}

const initial: SchemaState = {
  title: "My Form",
  fields: [],
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
    // 1. Snapshot current state before the async save
    savePending(s) {
      s._committed = { title: s.title, fields: s.fields };
      s.saveStatus = "saving";
    },
    saveFulfilled(s) {
      s._committed = null;
      s.saveStatus = "saved";
    },
    // 2. On failure, roll back to the snapshot
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

const selectSchema = (s: RootState) => s.schema;

export const selectTitle      = (s: RootState) => s.schema.title;
export const selectFields     = (s: RootState) => s.schema.fields;
export const selectSaveStatus = (s: RootState) => s.schema.saveStatus;

// Derives the final FormSchema consumed by DynamicForm — only recomputes when //
// title or fields reference changes (not on unrelated state updates). //
export const selectCompiledSchema = createSelector(
  selectTitle,
  selectFields,
  (title, fields) => ({
    title,
    fields: fields.map(f => ({
      id:          f.fieldId || f.id,
      type:        f.type,
      label:       f.label,
      placeholder: f.placeholder || undefined,
      options:     f.options.length ? f.options : undefined,
      defaultValue: f.defaultValue || undefined,
      validation:  Object.fromEntries(
        Object.entries(f.validation).filter(([, v]) => v !== "" && v !== false && v !== undefined)
      ),
    })),
  })
);

// Async thunk — optimistic save //
// Replace the fetch() body with your real API call.
// The pattern: snapshot → mutate → attempt save → rollback on error.

export function saveSchema() {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(savePending());
    const { title, fields } = getState().schema;
    try {
      await fakeApiSave({ title, fields });   // swap for real endpoint
      dispatch(saveFulfilled());
    } catch {
      dispatch(saveRejected());               // UI reverts automatically
    }
    // auto-clear badge after 2 s
    setTimeout(() => dispatch(resetSaveStatus()), 2000);
  };
}

// Simulated network call (200 ms, 10 % failure rate for demo purposes)
async function fakeApiSave(payload: unknown) {
  await new Promise<void>((res, rej) =>
    setTimeout(() => Math.random() < 0.1 ? rej(new Error("network")) : res(), 200)
  );
  console.log("[store] schema saved", payload);
}