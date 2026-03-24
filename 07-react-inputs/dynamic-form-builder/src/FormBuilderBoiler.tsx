import { useState, useCallback } from "react";
import type { CSSProperties, FC, ChangeEvent } from "react";

// ── Types ────────────────────────────────────────────────────────────────

type FieldType = "text"|"email"|"number"|"select"|"checkbox"|"textarea"|"date"|"url"|"color-swatch";

interface SelectOption { label: string; value: string; }

interface ValidationRule {
  required?: boolean;
  minLength?: number | "";
  maxLength?: number | "";
  min?: number | "";
  max?: number | "";
  pattern?: string;
  message?: string;
}

interface BuilderField {
  id: string;
  fieldId: string;
  type: FieldType;
  label: string;
  placeholder: string;
  options: SelectOption[];
  validation: ValidationRule;
  defaultValue: string;
}

interface PreviewFormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  options?: SelectOption[];
  defaultValue?: string | boolean;
  validation?: ValidationRule;
}

interface PreviewSchema { title: string; fields: PreviewFormField[]; }

type FormValues = Record<string, string | boolean>;
type FormErrors = Record<string, string>;

// ── Constants ────────────────────────────────────────────────────────────

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

// ── Validation ───────────────────────────────────────────────────────────

function validateField(field: PreviewFormField, value: string | boolean): string {
  const v = field.validation;
  if (!v) return "";
  const strVal = String(value ?? "");
  if (v.required && (value === "" || value === false)) return v.message ?? `${field.label} is required.`;
  if (v.minLength && strVal.length < Number(v.minLength)) return v.message ?? `Min ${v.minLength} characters.`;
  if (v.maxLength && strVal.length > Number(v.maxLength)) return v.message ?? `Max ${v.maxLength} characters.`;
  if (v.min !== "" && v.min !== undefined && Number(value) < Number(v.min)) return v.message ?? `Min value is ${v.min}.`;
  if (v.max !== "" && v.max !== undefined && Number(value) > Number(v.max)) return v.message ?? `Max value is ${v.max}.`;
  if (v.pattern && strVal && !new RegExp(v.pattern).test(strVal)) return v.message ?? "Invalid format.";
  return "";
}

// ── PreviewField ─────────────────────────────────────────────────────────

interface PreviewFieldProps {
  field: PreviewFormField;
  value: string | boolean;
  error: string;
  onChange: (id: string, val: string | boolean) => void;
}

const PreviewField: FC<PreviewFieldProps> = ({ field, value, error, onChange }) => {
  const opts = field.options ?? [];
  const base: CSSProperties = {
    width: "100%", padding: "8px 12px", borderRadius: 8,
    border: `1.5px solid ${error ? "#f87171" : "#e5e7eb"}`,
    background: error ? "#fef2f2" : "#fff", fontSize: 13,
    outline: "none", boxSizing: "border-box", color: "#111",
  };
  const chg = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const t = e.target as HTMLInputElement;
    onChange(field.id, field.type === "checkbox" ? t.checked : t.value);
  };
  switch (field.type) {
    case "select": return (
      <select style={base} value={String(value)} onChange={chg}>
        <option value="">— select —</option>
        {opts.map((o, i) => <option key={i} value={o.value}>{o.label}</option>)}
      </select>
    );
    case "textarea": return (
      <textarea style={{...base, resize:"vertical", minHeight:56}}
        placeholder={field.placeholder} value={String(value)} onChange={chg}/>
    );
    case "checkbox": return (
      <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13}}>
        <input type="checkbox" checked={Boolean(value)} onChange={chg} style={{width:14, height:14}}/>
        <span style={{color:"#374151"}}>{field.label}</span>
      </label>
    );
    case "color-swatch": return (
      <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
        {opts.map((o, i) => (
          <button key={i} type="button" title={o.label} onClick={() => onChange(field.id, o.value)}
            style={{width:26, height:26, borderRadius:8, background:o.value,
              border:`2.5px solid ${value === o.value ? o.value : "transparent"}`,
              outline: value === o.value ? `2px solid ${o.value}` : "none",
              outlineOffset:2, cursor:"pointer"}}/>
        ))}
      </div>
    );
    default: return (
      <input type={field.type} style={base}
        placeholder={field.placeholder} value={String(value)} onChange={chg}/>
    );
  }
};

// ── FormPreview ──────────────────────────────────────────────────────────

const FormPreview: FC<{ schema: PreviewSchema }> = ({ schema }) => {
  const init = (): FormValues =>
    Object.fromEntries(schema.fields.map(f => [f.id, f.defaultValue ?? (f.type === "checkbox" ? false : "")]));

  const [vals, setVals] = useState<FormValues>(init);
  const [errs, setErrs] = useState<FormErrors>({});
  const [done, setDone] = useState(false);

  const handleChange = (id: string, val: string | boolean) => {
    setVals(p => ({...p, [id]: val}));
    const f = schema.fields.find(x => x.id === id);
    if (f) setErrs(p => ({...p, [id]: validateField(f, val)}));
  };

  const handleSubmit = () => {
    const e: FormErrors = {};
    schema.fields.forEach(f => { const err = validateField(f, vals[f.id]); if (err) e[f.id] = err; });
    setErrs(e);
    if (!Object.keys(e).length) setDone(true);
  };

  if (done) return (
    <div style={{borderRadius:10, border:"1px solid #bbf7d0", background:"#f0fdf4", padding:20, textAlign:"center"}}>
      <div style={{fontSize:28, marginBottom:6}}>✓</div>
      <p style={{fontWeight:600, color:"#15803d", margin:"0 0 10px", fontSize:14}}>Submitted</p>
      <pre style={{textAlign:"left", fontSize:11, background:"#fff", border:"1px solid #bbf7d0", borderRadius:7, padding:10, overflow:"auto", maxHeight:160}}>
        {JSON.stringify(vals, null, 2)}
      </pre>
      <button onClick={() => { setVals(init()); setErrs({}); setDone(false); }}
        style={{marginTop:10, padding:"6px 14px", borderRadius:8, border:"none", background:"#16a34a", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer"}}>
        Reset
      </button>
    </div>
  );

  if (!schema.fields.length) return (
    <div style={{textAlign:"center", padding:"32px 0", color:"#9ca3af", fontSize:13}}>
      No fields yet — add one on the left.
    </div>
  );

  return (
    <div style={{display:"flex", flexDirection:"column", gap:12}}>
      {schema.fields.map(f => (
        <div key={f.id} style={{display:"flex", flexDirection:"column", gap:3}}>
          {f.type !== "checkbox" && (
            <label style={{fontSize:12, fontWeight:600, color:"#374151"}}>
              {f.label || <span style={{color:"#9ca3af", fontStyle:"italic"}}>Untitled field</span>}
              {f.validation?.required && <span style={{color:"#ef4444", marginLeft:3}}>*</span>}
            </label>
          )}
          <PreviewField field={f} value={vals[f.id] ?? ""} error={errs[f.id] ?? ""} onChange={handleChange}/>
          {errs[f.id] && <p style={{fontSize:11, color:"#ef4444", margin:"1px 0 0"}}>{errs[f.id]}</p>}
        </div>
      ))}
      <button onClick={handleSubmit}
        style={{marginTop:4, padding:"9px 16px", borderRadius:10, border:"none", background:"#3b82f6", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer"}}>
        Submit
      </button>
    </div>
  );
};

// ── OptionsEditor ────────────────────────────────────────────────────────

interface OptionsEditorProps {
  options: SelectOption[];
  onChange: (opts: SelectOption[]) => void;
}

const OptionsEditor: FC<OptionsEditorProps> = ({ options, onChange }) => {
  const update = (i: number, key: keyof SelectOption, val: string) => {
    const o = [...options]; o[i] = {...o[i], [key]: val}; onChange(o);
  };
  const add = () => onChange([...options, {label: "", value: ""}]);
  const remove = (i: number) => onChange(options.filter((_, idx) => idx !== i));
  return (
    <div style={{marginTop:6}}>
      {options.map((o, i) => (
        <div key={i} style={{display:"flex", gap:6, marginBottom:5, alignItems:"center"}}>
          <input placeholder="Label" value={o.label} onChange={e => update(i, "label", e.target.value)}
            style={{flex:1, padding:"5px 8px", borderRadius:6, border:"1px solid #e5e7eb", fontSize:12, color:"#111"}}/>
          <input placeholder="Value" value={o.value} onChange={e => update(i, "value", e.target.value)}
            style={{flex:1, padding:"5px 8px", borderRadius:6, border:"1px solid #e5e7eb", fontSize:12, color:"#111"}}/>
          <button onClick={() => remove(i)}
            style={{padding:"3px 7px", borderRadius:5, border:"1px solid #fca5a5", background:"#fef2f2", color:"#dc2626", fontSize:11, cursor:"pointer"}}>×</button>
        </div>
      ))}
      <button onClick={add}
        style={{padding:"4px 10px", borderRadius:6, border:"1px solid #d1d5db", background:"#f9fafb", fontSize:11, cursor:"pointer", color:"#374151"}}>
        + option
      </button>
    </div>
  );
};

// ── FieldEditor ──────────────────────────────────────────────────────────

interface FieldEditorProps {
  field: BuilderField;
  idx: number;
  total: number;
  onUpdate: (f: BuilderField) => void;
  onRemove: () => void;
  onMove: (idx: number, dir: -1 | 1) => void;
}

const FieldEditor: FC<FieldEditorProps> = ({ field, idx, total, onUpdate, onRemove, onMove }) => {
  const [open, setOpen] = useState(false);
  const u = <K extends keyof BuilderField>(key: K, val: BuilderField[K]) => onUpdate({...field, [key]: val});
  const uv = <K extends keyof ValidationRule>(key: K, val: ValidationRule[K]) =>
    onUpdate({...field, validation: {...field.validation, [key]: val}});
  const needsOpts = field.type === "select" || field.type === "color-swatch";

  const labelStyle: CSSProperties = {fontSize:11, color:"#6b7280", marginBottom:3, display:"block"};
  const inputStyle: CSSProperties = {width:"100%", padding:"5px 8px", borderRadius:6, border:"1px solid #e5e7eb", fontSize:12, boxSizing:"border-box", color:"#111"};

  return (
    <div style={{border:"1px solid #e5e7eb", borderRadius:10, background:"#fff", overflow:"hidden", marginBottom:8}}>
      <div style={{display:"flex", alignItems:"center", gap:8, padding:"10px 12px", cursor:"pointer", userSelect:"none"}}
        onClick={() => setOpen(o => !o)}>
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

// ── App ──────────────────────────────────────────────────────────────────

export default function FormBuilderApp() {
  const [title, setTitle] = useState("My Form");
  const [fields, setFields] = useState<BuilderField[]>([]);
  const [showExport, setShowExport] = useState(false);

  const addField = () => setFields(f => [...f, defaultField()]);
  const removeField = (id: string) => setFields(f => f.filter(x => x.id !== id));
  const updateField = (id: string, updated: BuilderField) => setFields(f => f.map(x => x.id === id ? updated : x));
  const moveField = useCallback((idx: number, dir: -1 | 1) => {
    setFields(f => {
      const a = [...f]; const to = idx + dir;
      if (to < 0 || to >= a.length) return a;
      [a[idx], a[to]] = [a[to], a[idx]]; return a;
    });
  }, []);

  const schema: PreviewSchema = {
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

  return (
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:0, minHeight:"100vh", fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif'}}>
      <div style={{borderRight:"1px solid #e5e7eb", padding:20, overflowY:"auto", background:"#fafafa"}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16}}>
          <h2 style={{margin:0, fontSize:15, fontWeight:700, color:"#1f2937"}}>Builder</h2>
          <button onClick={() => setShowExport(s => !s)}
            style={{padding:"5px 12px", borderRadius:7, border:"1px solid #d1d5db", background:"#fff", fontSize:12, cursor:"pointer", color:"#374151"}}>
            {showExport ? "Hide" : "Export"} schema
          </button>
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
            onUpdate={u => updateField(f.id, u)}
            onRemove={() => removeField(f.id)}
            onMove={moveField}/>
        ))}
        <button onClick={addField}
          style={{width:"100%", padding:"9px 0", borderRadius:10, border:"1.5px dashed #d1d5db", background:"transparent", fontSize:13, color:"#6b7280", cursor:"pointer", marginTop:2}}>
          + Add field
        </button>
      </div>

      <div style={{padding:20, background:"#fff", overflowY:"auto"}}>
        <h2 style={{margin:"0 0 16px", fontSize:15, fontWeight:700, color:"#1f2937"}}>Preview</h2>
        <p style={{margin:"0 0 14px", fontSize:16, fontWeight:700, color:"#1f2937"}}>{title}</p>
        <FormPreview schema={schema}/>
      </div>
    </div>
  );
}