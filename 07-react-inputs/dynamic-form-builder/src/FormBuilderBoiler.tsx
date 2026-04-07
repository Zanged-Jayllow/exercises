import { useState, useCallback, useMemo, memo } from "react";
import type { CSSProperties, FC } from "react";
import { Provider } from "react-redux";
import { store, saveSchema, selectCompiledSchema, selectSaveStatus,
         addField, removeField, updateField, moveField,
         setTitle, selectTitle, selectFields } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks";
import { OpenFieldsProvider, useOpenFields,
         SelectionProvider, useSelection } from "./contexts";
import type { BuilderField, BuilderValidation } from "./types";
import type { FieldType, SelectOption } from "./formBoiler.utils";
import { DynamicForm } from "./FormBoiler";
import ProfileList from "./ProfileList";
import PROFILE_SCHEMA from "./ProfileSchema";

import {
  createRouter, createRoute, createRootRoute,
  RouterProvider, useNavigate, useSearch,
} from "@tanstack/react-router";

// Constants //

const FIELD_TYPES: FieldType[] = [
  "text","email","number","select","checkbox","textarea","date","url","color-swatch",
];

let _uid = 0;
const makeId = () => `field_${++_uid}`;

const defaultField = (): BuilderField => ({
  id: makeId(), fieldId: "", type: "text", label: "", placeholder: "",
  options: [],
  validation: { required: false, minLength: "", maxLength: "", min: "", max: "", pattern: "", message: "" },
  defaultValue: "",
});

// OptionsEditor //

interface OptionsEditorProps {
  options: SelectOption[];
  onChange: (opts: SelectOption[]) => void;
}

const OptionsEditor: FC<OptionsEditorProps> = memo(({ options, onChange }) => {
  const update = (i: number, key: keyof SelectOption, val: string) => {
    const o = [...options]; o[i] = { ...o[i], [key]: val }; onChange(o);
  };
  const add    = () => onChange([...options, { _id: makeId(), label: "", value: "" }]);
  const remove = (i: number) => onChange(options.filter((_, idx) => idx !== i));

  return (
    <div style={{ marginTop: 6 }}>
      {options.map((o, i) => (
        <div key={(o as any)._id ?? i}
          style={{ display:"flex", gap:6, marginBottom:5, alignItems:"center" }}>
          <input placeholder="Label" value={o.label}
            onChange={e => update(i, "label", e.target.value)}
            style={rowInput} />
          <input placeholder="Value" value={o.value}
            onChange={e => update(i, "value", e.target.value)}
            style={rowInput} />
          <button onClick={() => remove(i)} style={removeBtnSm}>×</button>
        </div>
      ))}
      <button onClick={add} style={addOptBtn}>+ option</button>
    </div>
  );
});

// FieldEditor //
// Reads open-state from OpenFieldsContext; dispatches field updates to Redux.
// memo() ensures it only re-renders when its own field data changes.

interface FieldEditorProps {
  field: BuilderField;
  idx:   number;
  total: number;
}

const FieldEditor: FC<FieldEditorProps> = memo(({ field, idx, total }) => {
  const dispatch = useAppDispatch();
  const { openFields, toggleField } = useOpenFields();
  const { selectedFieldId, setSelectedFieldId } = useSelection();
  const open = openFields.has(field.id);

  const u = <K extends keyof BuilderField>(key: K, val: BuilderField[K]) =>
    dispatch(updateField({ ...field, [key]: val }));
  const uv = <K extends keyof BuilderValidation>(key: K, val: BuilderValidation[K]) =>
    dispatch(updateField({ ...field, validation: { ...field.validation, [key]: val } }));

  const needsOpts = field.type === "select" || field.type === "color-swatch";
  const isSelected = selectedFieldId === field.id;

  return (
    <div style={{
      border: `1px solid ${isSelected ? "#6366f1" : "#e5e7eb"}`,
      borderRadius: 10, background: "#fff", overflow: "hidden", marginBottom: 8,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px",
                    cursor:"pointer", userSelect:"none" }}
        onClick={() => { toggleField(field.id); setSelectedFieldId(isSelected ? null : field.id); }}>
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          <button onClick={e => { e.stopPropagation(); dispatch(moveField({ idx, dir: -1 })); }}
            disabled={idx === 0}
            style={{ ...arrowBtn, color: idx === 0 ? "#d1d5db" : "#9ca3af" }}>▲</button>
          <button onClick={e => { e.stopPropagation(); dispatch(moveField({ idx, dir: 1 })); }}
            disabled={idx === total - 1}
            style={{ ...arrowBtn, color: idx === total - 1 ? "#d1d5db" : "#9ca3af" }}>▼</button>
        </div>
        <span style={{ flex:1, fontSize:13, fontWeight:500, color:"#1f2937" }}>
          {field.label || <span style={{ color:"#9ca3af", fontStyle:"italic" }}>Untitled</span>}
        </span>
        <span style={{ fontSize:11, color:"#9ca3af", background:"#f3f4f6",
                       padding:"2px 7px", borderRadius:5 }}>{field.type}</span>
        <button onClick={e => { e.stopPropagation(); dispatch(removeField(field.id)); }}
          style={removeBtnSm}>Remove</button>
        <span style={{ color:"#9ca3af", fontSize:12, marginLeft:2 }}>{open ? "▾" : "▸"}</span>
      </div>

      {open && (
        <div style={{ padding:"0 12px 14px", borderTop:"1px solid #f3f4f6",
                      display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <div>
              <label style={lbl}>Label</label>
              <input style={inp} value={field.label}
                onChange={e => u("label", e.target.value)} placeholder="Field label" />
            </div>
            <div>
              <label style={lbl}>ID</label>
              <input style={inp} value={field.fieldId}
                onChange={e => u("fieldId", e.target.value)} placeholder="field_id" />
            </div>
            <div>
              <label style={lbl}>Type</label>
              <select style={inp} value={field.type}
                onChange={e => u("type", e.target.value as FieldType)}>
                {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {field.type !== "checkbox" && field.type !== "color-swatch" && (
              <div>
                <label style={lbl}>Placeholder</label>
                <input style={inp} value={field.placeholder}
                  onChange={e => u("placeholder", e.target.value)}
                  placeholder="e.g. Enter your name" />
              </div>
            )}
          </div>

          {needsOpts && (
            <div>
              <label style={lbl}>
                {field.type === "color-swatch" ? "Swatches (value = CSS color)" : "Options"}
              </label>
              <OptionsEditor options={field.options}
                onChange={opts => u("options", opts)} />
            </div>
          )}

          <div style={{ borderTop:"1px solid #f3f4f6", paddingTop:10 }}>
            <p style={{ fontSize:11, fontWeight:600, color:"#6b7280", margin:"0 0 8px" }}>
              Validation
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
              <label style={{ display:"flex", alignItems:"center", gap:5,
                              fontSize:12, color:"#374151", cursor:"pointer" }}>
                <input type="checkbox" checked={!!field.validation.required}
                  onChange={e => uv("required", e.target.checked)}
                  style={{ width:12, height:12 }} />
                Required
              </label>
              {(["minLength","maxLength","min","max"] as const).map(k => (
                <div key={k}>
                  <label style={lbl}>{k}</label>
                  <input style={inp} type="number"
                    value={String(field.validation[k] ?? "")}
                    onChange={e => uv(k, e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="—" />
                </div>
              ))}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={lbl}>Pattern (regex)</label>
                <input style={inp} value={field.validation.pattern ?? ""}
                  onChange={e => uv("pattern", e.target.value)}
                  placeholder="^[A-Za-z]+$" />
              </div>
              <div style={{ gridColumn:"1/-1" }}>
                <label style={lbl}>Error message</label>
                <input style={inp} value={field.validation.message ?? ""}
                  onChange={e => uv("message", e.target.value)}
                  placeholder="Custom error text" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// SaveBadge //

const SaveBadge: FC = () => {
  const status = useAppSelector(selectSaveStatus);
  if (status === "idle") return null;
  const map = {
    saving: { bg:"#fef9c3", color:"#92400e", text:"Saving…" },
    saved:  { bg:"#f0fdf4", color:"#15803d", text:"Saved ✓" },
    error:  { bg:"#fef2f2", color:"#dc2626", text:"Save failed — reverted" },
  } as const;
  const s = map[status as keyof typeof map];
  return (
    <span style={{ padding:"3px 10px", borderRadius:6, fontSize:11,
                   fontWeight:600, background:s.bg, color:s.color }}>
      {s.text}
    </span>
  );
};

// BuilderPage //
// URL shape: /?mode=edit&field=<id>
// mode=edit is the default; switching to preview navigates to /preview.

function BuilderPage() {
  const dispatch    = useAppDispatch();
  const title       = useAppSelector(selectTitle);
  const fields      = useAppSelector(selectFields);
  const schema      = useAppSelector(selectCompiledSchema);   // memoized selector
  const navigate    = useNavigate();
  const search      = useSearch({ strict: false }) as { field?: string };

  // Mirror URL ?field= param into SelectionContext on mount / param change
  const { setSelectedFieldId } = useSelection();
  useMemo(() => {
    setSelectedFieldId(search.field ?? null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.field]);

  const [showExport, setShowExport] = useState(false);

  const handleAddField = useCallback(() => {
    const f = defaultField();
    dispatch(addField(f));
  }, [dispatch]);

  const handleSave = useCallback(() => {
    dispatch(saveSchema() as any);
  }, [dispatch]);

  const goToPreview = () =>
    navigate({ to: "/preview", search: { schema: JSON.stringify(schema) } });

  return (
    <div style={{ padding:20, background:"#fafafa", minHeight:"100vh", fontFamily:sansSerif }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <h2 style={{ margin:0, fontSize:15, fontWeight:700, color:"#1f2937" }}>Builder</h2>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <SaveBadge />
          <button onClick={handleSave}
            style={{ padding:"5px 12px", borderRadius:7, border:"1px solid #d1d5db",
                     background:"#fff", fontSize:12, cursor:"pointer", color:"#374151" }}>
            Save
          </button>
          <button onClick={() => navigate({ to: "/demo" })}
            style={{ padding:"5px 12px", borderRadius:7, border:"1px solid #d1d5db",
                     background:"#fff", fontSize:12, cursor:"pointer", color:"#374151" }}>
            See Demo
          </button>
          <button onClick={() => setShowExport(s => !s)}
            style={{ padding:"5px 12px", borderRadius:7, border:"1px solid #d1d5db",
                     background:"#fff", fontSize:12, cursor:"pointer", color:"#374151" }}>
            {showExport ? "Hide" : "Export"} schema
          </button>
          <button onClick={goToPreview}
            style={{ padding:"5px 12px", borderRadius:7, border:"1px solid #6366f1",
                     background:"#6366f1", fontSize:12, cursor:"pointer",
                     color:"#fff", fontWeight:600 }}>
            Preview →
          </button>
        </div>
      </div>

      <div style={{ marginBottom:14 }}>
        <label style={{ fontSize:11, color:"#6b7280", display:"block", marginBottom:3 }}>
          Form title
        </label>
        <input value={title} onChange={e => dispatch(setTitle(e.target.value))}
          style={{ width:"100%", padding:"7px 10px", borderRadius:8,
                   border:"1px solid #e5e7eb", fontSize:13, boxSizing:"border-box", color:"#111" }} />
      </div>

      {showExport && (
        <pre style={{ fontSize:10, background:"#1e293b", color:"#e2e8f0",
                      borderRadius:8, padding:12, overflow:"auto",
                      maxHeight:220, marginBottom:14 }}>
          {JSON.stringify(schema, null, 2)}
        </pre>
      )}

      {fields.map((f, i) => (
        <FieldEditor key={f.id} field={f} idx={i} total={fields.length} />
      ))}

      <button onClick={handleAddField}
        style={{ width:"100%", padding:"9px 0", borderRadius:10,
                 border:"1.5px dashed #d1d5db", background:"transparent",
                 fontSize:13, color:"#6b7280", cursor:"pointer", marginTop:2 }}>
        + Add field
      </button>
    </div>
  );
}

// PreviewPage //
// Reads compiled schema from URL search param — completely stateless,
// shareable, and bookmarkable.

function PreviewPage() {
  const navigate   = useNavigate();
  const { schema: schemaStr } = useSearch({ strict: false }) as { schema?: string };
  const schema = useMemo(
    () => schemaStr ? JSON.parse(schemaStr) : { title: "", fields: [] },
    [schemaStr]
  );

  return (
    <div style={{ padding:20, background:"#fff", minHeight:"100vh", fontFamily:sansSerif }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        <button onClick={() => navigate({ to: "/" })}
          style={{ padding:"5px 12px", borderRadius:7, border:"1px solid #d1d5db",
                   background:"#fff", fontSize:12, cursor:"pointer", color:"#374151" }}>
          ← Back
        </button>
        <h2 style={{ margin:0, fontSize:15, fontWeight:700, color:"#1f2937" }}>Preview</h2>
      </div>
      <p style={{ margin:"0 0 14px", fontSize:16, fontWeight:700, color:"#1f2937" }}>
        {schema.title}
      </p>
      <DynamicForm schema={schema} onSubmit={() => {}} />
    </div>
  );
}

// DemoPage //

function SchemaViewer({ schema }: { schema: object }) {
  return (
    <details style={{ marginBottom:24, textAlign:"center" }}>
      <summary style={{ cursor:"pointer", fontSize:12, fontWeight:600,
                        color:"#6b7280", userSelect:"none", marginBottom:8,
                        letterSpacing:"0.05em", textTransform:"uppercase" }}>
        Show Schema
      </summary>
      <pre style={{ background:"#1e1e1e", color:"#d4d4d4", padding:16,
                    borderRadius:8, fontSize:12.5, textAlign:"left" }}>
        {JSON.stringify(schema, null, 2)}
      </pre>
    </details>
  );
}

function DemoPage() {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily:sansSerif }}>
      <div style={{ padding:"12px 20px", borderBottom:"1px solid #e5e7eb",
                    display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={() => navigate({ to: "/" })}
          style={{ padding:"5px 12px", borderRadius:7, border:"1px solid #d1d5db",
                   background:"#fff", fontSize:12, cursor:"pointer", color:"#374151" }}>
          ← Back
        </button>
        <span style={{ fontSize:14, fontWeight:600, color:"#1f2937" }}>Demo</span>
      </div>
      <ProfileList />
      <SchemaViewer schema={PROFILE_SCHEMA} />
    </div>
  );
}

// Router (module-level singleton) //

const rootRoute    = createRootRoute();
const indexRoute   = createRoute({ getParentRoute: () => rootRoute, path: "/",        component: BuilderPage  });
const previewRoute = createRoute({ getParentRoute: () => rootRoute, path: "/preview", component: PreviewPage  });
const demoRoute    = createRoute({ getParentRoute: () => rootRoute, path: "/demo",    component: DemoPage     });

const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, previewRoute, demoRoute]),
});

// App root //
// Redux store  →  OpenFieldsProvider  →  SelectionProvider  →  Router //
// Redux is outermost so the store is available to every component. //
// The two UI contexts are separate so their state changes don't cross-pollute. //

export default function FormBuilderApp() {
  return (
    <Provider store={store}>
      <OpenFieldsProvider>
        <SelectionProvider>
          <RouterProvider router={router} />
        </SelectionProvider>
      </OpenFieldsProvider>
    </Provider>
  );
}

// Shared inline styles (defined once, not recreated per render) //

const sansSerif = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif';

const lbl: CSSProperties = { fontSize:11, color:"#6b7280", marginBottom:3, display:"block" };
const inp: CSSProperties = { width:"100%", padding:"5px 8px", borderRadius:6,
                              border:"1px solid #e5e7eb", fontSize:12,
                              boxSizing:"border-box", color:"#111" };
const rowInput: CSSProperties = { flex:1, padding:"5px 8px", borderRadius:6,
                                   border:"1px solid #e5e7eb", fontSize:12, color:"#111" };
const removeBtnSm: CSSProperties = { padding:"3px 7px", borderRadius:5,
                                      border:"1px solid #fca5a5", background:"#fef2f2",
                                      color:"#dc2626", fontSize:11, cursor:"pointer" };
const addOptBtn: CSSProperties = { padding:"4px 10px", borderRadius:6,
                                    border:"1px solid #d1d5db", background:"#f9fafb",
                                    fontSize:11, cursor:"pointer", color:"#374151" };
const arrowBtn: CSSProperties = { padding:"0 4px", border:"none",
                                   background:"none", cursor:"pointer",
                                   fontSize:10, lineHeight:1 };