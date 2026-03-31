import { useState, useCallback, createContext, useContext } from "react";
import type { CSSProperties, FC } from "react";
import { DynamicForm } from "./FormBoiler";
import type { SelectOption, ValidationRule, FormSchema } from "./formBoiler.utils";
import type { FieldType } from "./formBoiler.utils";

import {
    createRouter,
    createRoute,
    createRootRoute,
    RouterProvider,
    useNavigate,
    useSearch,
} from "@tanstack/react-router";

// Type Declaration //

type BuilderValidation = {
    [K in keyof ValidationRule]: K extends "required" ? boolean : ValidationRule[K] | "";
};

interface BuilderField {
    id: string;
    fieldId: string;
    type: FieldType;
    label: string;
    placeholder: string;
    options: SelectOption[];
    validation: BuilderValidation;
    defaultValue: string;
}

interface BuilderContextValue {
    title: string;
    setTitle: (t: string) => void;
    fields: BuilderField[];
    setFields: React.Dispatch<React.SetStateAction<BuilderField[]>>;
    openFields: Set<string>;
    removeField: (id: string) => void;
    updateField: (id: string, updated: BuilderField) => void;
    toggleField: (id: string) => void;
}

// Constant Declaration //

const FIELD_TYPES: FieldType[] = [
    "text","email","number","select","checkbox","textarea","date","url","color-swatch"
];

let _id = 0;
const makeId = () => `field_${++_id}`;

const defaultField = (): BuilderField => ({
    id: makeId(), fieldId: "", type: "text", label: "", placeholder: "",
    options: [],
    validation: { required: false, minLength: "", maxLength: "", min: "", max: "", pattern: "", message: "" },
    defaultValue: "",
});

// Context //

const BuilderContext = createContext<BuilderContextValue | null>(null);
const useBuilder = () => {
    const ctx = useContext(BuilderContext);
    if (!ctx) throw new Error("useBuilder must be used within BuilderContext");
    return ctx;
};

// OptionsEditor //

interface OptionsEditorProps {
    options: SelectOption[];
    onChange: (opts: SelectOption[]) => void;
}

const OptionsEditor: FC<OptionsEditorProps> = ({ options, onChange }) => {
    const update = (i: number, key: keyof SelectOption, val: string) => {
        const o = [...options]; o[i] = { ...o[i], [key]: val }; onChange(o);
    };
    const add = () => onChange([...options, { _id: makeId(), label: "", value: "" }]);
    const remove = (i: number) => onChange(options.filter((_, idx) => idx !== i));
    return (
        <div style={{ marginTop: 6 }}>
            {options.map((o, i) => (
                <div key={(o as any)._id ?? i}
                    style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "center" }}>
                    <input placeholder="Label" value={o.label}
                        onChange={e => update(i, "label", e.target.value)}
                        style={{ flex: 1, padding: "5px 8px", borderRadius: 6, border: "1px solid #e5e7eb", fontSize: 12, color: "#111" }} />
                    <input placeholder="Value" value={o.value}
                        onChange={e => update(i, "value", e.target.value)}
                        style={{ flex: 1, padding: "5px 8px", borderRadius: 6, border: "1px solid #e5e7eb", fontSize: 12, color: "#111" }} />
                    <button onClick={() => remove(i)}
                        style={{ padding: "3px 7px", borderRadius: 5, border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626", fontSize: 11, cursor: "pointer" }}>×</button>
                </div>
            ))}
            <button onClick={add}
                style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #d1d5db", background: "#f9fafb", fontSize: 11, cursor: "pointer", color: "#374151" }}>
                + option
            </button>
        </div>
    );
};

// FieldEditor //

interface FieldEditorProps {
    field: BuilderField;
    idx: number;
    total: number;
    open: boolean;
    onToggle: () => void;
    onUpdate: (f: BuilderField) => void;
    onRemove: () => void;
    onMove: (idx: number, dir: -1 | 1) => void;
}

const FieldEditor: FC<FieldEditorProps> = ({ field, idx, total, open, onToggle, onUpdate, onRemove, onMove }) => {
    const u = <K extends keyof BuilderField>(key: K, val: BuilderField[K]) => onUpdate({...field, [key]: val});
    const uv = <K extends keyof BuilderValidation>(key: K, val: BuilderValidation[K]) =>
        onUpdate({...field, validation: {...field.validation, [key]: val}});
    const needsOpts = field.type === "select" || field.type === "color-swatch";

    const labelStyle: CSSProperties = {fontSize:11, color:"#6b7280", marginBottom:3, display:"block"};
    const inputStyle: CSSProperties = {width:"100%", padding:"5px 8px", borderRadius:6, border:"1px solid #e5e7eb", fontSize:12, boxSizing:"border-box", color:"#111"};

    return (
        <div style={{border:"1px solid #e5e7eb", borderRadius:10, background:"#fff", overflow:"hidden", marginBottom:8}}>
            <div style={{display:"flex", alignItems:"center", gap:8, padding:"10px 12px", cursor:"pointer", userSelect:"none"}}
                onClick={() => onToggle()}>
                <div style={{display:"flex", flexDirection:"column", gap:2}}>
                    <button onClick={e => { e.stopPropagation(); onMove(idx, -1); }} disabled={idx === 0}
                      style={{padding:"0 4px", border:"none", background:"none", cursor:idx===0?"default":"pointer", color:idx===0?"#d1d5db":"#9ca3af", fontSize:10, lineHeight:1}}>▲</button>
                    <button onClick={e => { e.stopPropagation(); onMove(idx, 1); }} disabled={idx === total - 1}
                      style={{padding:"0 4px", border:"none", background:"none", cursor:idx===total-1?"default":"pointer", color:idx===total-1?"#d1d5db":"#9ca3af", fontSize:10, lineHeight:1}}>▼</button>
                </div>
                <span style={{flex:1, fontSize:13, fontWeight:500, color:"#1f2937"}}>
                  {field.label || <span style={{color:"#9ca3af", fontStyle:"italic"}}>Untitled</span>}
                </span>
                <span style={{fontSize:11, color:"#9ca3af", background:"#f3f4f6", padding:"2px 7px", borderRadius:5}}>{field.type}</span>
                <button onClick={e => { e.stopPropagation(); onRemove(); }}
                  style={{padding:"2px 7px", borderRadius:6, border:"1px solid #fca5a5", background:"#fef2f2", color:"#dc2626", fontSize:11, cursor:"pointer"}}>Remove</button>
                <span style={{color:"#9ca3af", fontSize:12, marginLeft:2}}>{open ? "▾" : "▸"}</span>
            </div>

            {open && (
                <div style={{padding:"0 12px 14px", borderTop:"1px solid #f3f4f6", display:"flex", flexDirection:"column", gap:10}}>
                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10}}>
                      <div>
                        <label style={labelStyle}>Label</label>
                        <input style={inputStyle} value={field.label} onChange={e => u("label", e.target.value)} placeholder="Field label"/>
                      </div>
                      <div>
                        <label style={labelStyle}>ID</label>
                        <input style={inputStyle} value={field.fieldId} onChange={e => u("fieldId", e.target.value)} placeholder="field_id"/>
                      </div>
                      <div>
                        <label style={labelStyle}>Type</label>
                        <select style={inputStyle} value={field.type} onChange={e => u("type", e.target.value as FieldType)}>
                          {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      {field.type !== "checkbox" && field.type !== "color-swatch" && (
                        <div>
                          <label style={labelStyle}>Placeholder</label>
                          <input style={inputStyle} value={field.placeholder} onChange={e => u("placeholder", e.target.value)} placeholder="e.g. Enter your name"/>
                        </div>
                      )}
                    </div>

                    {needsOpts && (
                      <div>
                        <label style={labelStyle}>{field.type === "color-swatch" ? "Swatches (value = CSS color)" : "Options"}</label>
                        <OptionsEditor options={field.options} onChange={opts => u("options", opts)}/>
                      </div>
                    )}

                    <div style={{borderTop:"1px solid #f3f4f6", paddingTop:10}}>
                      <p style={{fontSize:11, fontWeight:600, color:"#6b7280", margin:"0 0 8px"}}>Validation</p>
                      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8}}>
                        <label style={{display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#374151", cursor:"pointer"}}>
                          <input type="checkbox" checked={!!field.validation.required}
                            onChange={e => uv("required", e.target.checked)} style={{width:12, height:12}}/>
                          Required
                        </label>
                        {(["minLength","maxLength","min","max"] as const).map(k => (
                          <div key={k}>
                            <label style={labelStyle}>{k}</label>
                            <input style={inputStyle} type="number" value={String(field.validation[k] ?? "")}
                              onChange={e => uv(k, e.target.value === "" ? "" : Number(e.target.value))} placeholder="—"/>
                          </div>
                        ))}
                        <div style={{gridColumn:"1/-1"}}>
                          <label style={labelStyle}>Pattern (regex)</label>
                          <input style={inputStyle} value={field.validation.pattern ?? ""}
                            onChange={e => uv("pattern", e.target.value)} placeholder="^[A-Za-z]+$"/>
                        </div>
                        <div style={{gridColumn:"1/-1"}}>
                          <label style={labelStyle}>Error message</label>
                          <input style={inputStyle} value={field.validation.message ?? ""}
                            onChange={e => uv("message", e.target.value)} placeholder="Custom error text"/>
                        </div>
                      </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Pages //

function BuilderPage() {
    const { title, setTitle, fields, setFields, openFields, removeField, updateField, toggleField } = useBuilder();
    const navigate = useNavigate();
    const [showExport, setShowExport] = useState(false);

    const addField = () => setFields(f => [...f, defaultField()]);
    const moveField = useCallback((idx: number, dir: -1 | 1) => {
      setFields(f => {
        const a = [...f]; const to = idx + dir;
        if (to < 0 || to >= a.length) return a;
        [a[idx], a[to]] = [a[to], a[idx]]; return a;
      });
    }, [setFields]);

    const schema: FormSchema = {
      title,
      fields: fields.map(f => ({
        id: f.fieldId || f.id,
        type: f.type,
        label: f.label,
        placeholder: f.placeholder || undefined,
        options: f.options.length ? f.options : undefined,
        defaultValue: f.defaultValue || undefined,
        validation: Object.fromEntries(
          Object.entries(f.validation).filter(([, v]) => v !== "" && v !== false && v !== undefined)
        ) as ValidationRule,
      })),
    };

    const goToPreview = () => {
        navigate({
            to: "/preview",
            search: { schema: JSON.stringify(schema) },
        });
    };

    return (
      <div style={{padding:20, background:"#fafafa", minHeight:"100vh", fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif'}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16}}>
          <h2 style={{margin:0, fontSize:15, fontWeight:700, color:"#1f2937"}}>Builder</h2>
          <div style={{display:"flex", gap:8}}>
            <button onClick={() => setShowExport(s => !s)}
              style={{padding:"5px 12px", borderRadius:7, border:"1px solid #d1d5db", background:"#fff", fontSize:12, cursor:"pointer", color:"#374151"}}>
              {showExport ? "Hide" : "Export"} schema
            </button>
            <button onClick={goToPreview}
              style={{padding:"5px 12px", borderRadius:7, border:"1px solid #6366f1", background:"#6366f1", fontSize:12, cursor:"pointer", color:"#fff", fontWeight:600}}>
              Preview →
            </button>
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:11, color:"#6b7280", display:"block", marginBottom:3}}>Form title</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            style={{width:"100%", padding:"7px 10px", borderRadius:8, border:"1px solid #e5e7eb", fontSize:13, boxSizing:"border-box", color:"#111"}}/>
        </div>
        {showExport && (
          <pre style={{fontSize:10, background:"#1e293b", color:"#e2e8f0", borderRadius:8, padding:12, overflow:"auto", maxHeight:220, marginBottom:14}}>
            {JSON.stringify(schema, null, 2)}
          </pre>
        )}
        {fields.map((f, i) => (
          <FieldEditor key={f.id} field={f} idx={i} total={fields.length}
            open={openFields.has(f.id)}
            onToggle={() => toggleField(f.id)}
            onUpdate={u => updateField(f.id, u)}
            onRemove={() => removeField(f.id)}
            onMove={moveField}/>
        ))}
        <button onClick={addField}
          style={{width:"100%", padding:"9px 0", borderRadius:10, border:"1.5px dashed #d1d5db", background:"transparent", fontSize:13, color:"#6b7280", cursor:"pointer", marginTop:2}}>
          + Add field
        </button>
      </div>
    );
}

function PreviewPage() {
    const navigate = useNavigate();
    const { schema: schemaStr } = useSearch({ strict: false }) as { schema?: string };
    const schema: FormSchema = schemaStr ? JSON.parse(schemaStr) : { title: "", fields: [] };

    return (
      <div style={{padding:20, background:"#fff", minHeight:"100vh", fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif'}}>
        <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:16}}>
          <button onClick={() => navigate({ to: "/" })}
            style={{padding:"5px 12px", borderRadius:7, border:"1px solid #d1d5db", background:"#fff", fontSize:12, cursor:"pointer", color:"#374151"}}>
            ← Back
          </button>
          <h2 style={{margin:0, fontSize:15, fontWeight:700, color:"#1f2937"}}>Preview</h2>
        </div>
        <p style={{margin:"0 0 14px", fontSize:16, fontWeight:700, color:"#1f2937"}}>{schema.title}</p>
        <DynamicForm schema={schema} onSubmit={() => {}} />
      </div>
    );
}

// Router (created once, outside any component) //

const rootRoute = createRootRoute();
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: BuilderPage });
const previewRoute = createRoute({ getParentRoute: () => rootRoute, path: "/preview", component: PreviewPage });

const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, previewRoute]),
});

// App //

export default function FormBuilderApp() {
    const [title, setTitle] = useState("My Form");
    const [fields, setFields] = useState<BuilderField[]>([]);
    const [openFields, setOpenFields] = useState<Set<string>>(new Set());

    const removeField = useCallback((id: string) => {
        setFields(f => f.filter(field => field.id !== id));
    }, []);

    const updateField = useCallback((id: string, updated: BuilderField) => {
        setFields(f => f.map(field => field.id === id ? updated : field));
    }, []);

    const toggleField = useCallback((id: string) => {
        setOpenFields(s => {
            const next = new Set(s);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    return (
        <BuilderContext.Provider value={{ title, setTitle, fields, setFields, openFields, removeField, updateField, toggleField }}>
            <RouterProvider router={router} />
        </BuilderContext.Provider>
    );
}