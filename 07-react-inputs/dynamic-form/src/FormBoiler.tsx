import { useState, useCallback } from "react";
import type { CSSProperties } from "react";

// Type Declaration //

type FieldType = "text" | "email" | "number" | "select" | "checkbox" | "textarea" | "date" | "url" | "color-swatch";

interface SelectOption {
    label: string;
    value: string;
}

interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
}

interface FormField {
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    options?: SelectOption[];       // for select fields
    validation?: ValidationRule;
    defaultValue?: string | boolean | number;
}

export interface FormSchema {
    title: string;
    fields: FormField[];
}

export type FormValues = Record<string, string | boolean | number>;
type FormErrors = Record<string, string>;

// Input Validation //

function validateField(field: FormField, value: string | boolean | number): string {
    const v = field.validation;
    if (!v) return "";
    const strVal = String(value ?? "");

    if (v.required && (value === "" || value === false || value === undefined))
        return v.message ?? `${field.label} is required.`;
    if (v.minLength && strVal.length < v.minLength)
        return v.message ?? `Minimum ${v.minLength} characters required.`;
    if (v.maxLength && strVal.length > v.maxLength)
        return v.message ?? `Maximum ${v.maxLength} characters allowed.`;
    if (v.min !== undefined && Number(value) < v.min)
        return v.message ?? `Minimum value is ${v.min}.`;
    if (v.max !== undefined && Number(value) > v.max)
        return v.message ?? `Maximum value is ${v.max}.`;
    if (v.pattern && !new RegExp(v.pattern).test(strVal))
        return v.message ?? `Invalid format.`;
    return "";
}

// Default Schema //

const DEFAULT_SCHEMA: FormSchema = {
    title: "User Registration",
    fields: [
        {
            id: "name",
            type: "text",
            label: "Full Name",
            placeholder: "Jane Doe",
            validation: { required: true, minLength: 2 },
        },
        {
            id: "email",
            type: "email",
            label: "Email Address",
            placeholder: "jane@example.com",
            validation: { required: true, pattern: "^[^@]+@[^@]+\\.[^@]+$", message: "Enter a valid email." },
        },
        {
            id: "age",
            type: "number",
            label: "Age",
            validation: { required: true, min: 18, max: 120 },
        },
        {
            id: "role",
            type: "select",
            label: "Role",
            options: [
                { label: "Developer", value: "dev" },
                { label: "Designer", value: "design" },
                { label: "Manager", value: "mgr" },
            ],
            validation: { required: true },
        },
        {
            id: "bio",
            type: "textarea",
            label: "Short Bio",
            placeholder: "Tell us about yourself…",
            validation: { maxLength: 200 },
        },
        {
            id: "agree",
            type: "checkbox",
            label: "I agree to the terms and conditions",
            validation: { required: true, message: "You must agree to continue." },
        },
    ],
};

// Field Components //

interface FieldProps {
    field: FormField;
    value: string | boolean | number;
    error: string;
    onChange: (id: string, val: string | boolean | number) => void;
}

function FieldRenderer({ field, value, error, onChange }: FieldProps) {
    const baseStyle: CSSProperties = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        border: `1.5px solid ${error ? "#f87171" : "#e5e7eb"}`,
        background: error ? "#fef2f2" : "#fff",
        fontSize: 14,
        outline: "none",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
    };

    const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const t = e.target as HTMLInputElement;
        onChange(field.id, field.type === "checkbox" ? t.checked : t.value);
    };

    switch (field.type) {
        case "select":
            return (
                <select style={baseStyle} value={String(value)} onChange={change}>
                    <option value="">— Select —</option>
                    {field.options?.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            );
        case "textarea":
            return (
                <textarea
                  style={{ ...baseStyle, resize: "vertical", minHeight: 60 }}
                  placeholder={field.placeholder}
                  value={String(value)}
                  onChange={change}
                />
            );
        case "checkbox":
            return (
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
                    <input
                      type="checkbox"
                      style={{ width: 16, height: 16, accentColor: "#3b82f6" }}
                      checked={Boolean(value)}
                      onChange={change}
                    />
                    <span style={{ fontSize: 14, color: "#374151" }}>{field.label}</span>
                </label>
            );
        case "color-swatch":
            return (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {field.options?.map(o => {
                        const selected = value === o.value;
                        return (
                            <button
                                key={o.value}
                                type="button"
                                title={o.label}
                                onClick={() => onChange(field.id, o.value)}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 10,
                                    background: o.value,
                                    border: selected ? `2.5px solid ${o.value}` : "2.5px solid transparent",
                                    outline: selected ? `2px solid ${o.value}` : "none",
                                    outlineOffset: 2,
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                            />
                        );
                    })}
                </div>
            );
        default:
            return (
                <input
                    type={field.type}
                    style={baseStyle}
                    placeholder={field.placeholder}
                    value={String(value)}
                    onChange={change}
                />
            );
    }
}

// Dynamic Form //

export interface DynamicFormProps {
    schema: FormSchema;
    onSubmit: (values: FormValues) => void;
}

export function DynamicForm({ schema, onSubmit }: DynamicFormProps) {
    const initValues = (): FormValues =>
        Object.fromEntries(
            schema.fields.map(f => [f.id, f.defaultValue ?? (f.type === "checkbox" ? false : "")])
        );

    const [values, setValues] = useState<FormValues>(initValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = useCallback((id: string, val: string | boolean | number) => {
        setValues(prev => ({ ...prev, [id]: val }));
        setErrors(prev => {
            const field = schema.fields.find(f => f.id === id)!;
            return { ...prev, [id]: validateField(field, val) };
        });
    }, [schema]);

    const handleSubmit = () => {
        const newErrors: FormErrors = {};
        schema.fields.forEach(f => {
            const err = validateField(f, values[f.id]);
            if (err) newErrors[f.id] = err;
        });
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setSubmitted(true);
            onSubmit(values);
        }
    };

    const handleReset = () => {
        setValues(initValues());
        setErrors({});
        setSubmitted(false);
    };

    if (submitted) {
        return (
            <div style={{ borderRadius: 12, border: "1px solid #bbf7d0", background: "#f0fdf4", padding: 24, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                <p style={{ fontWeight: 600, color: "#15803d", fontSize: 17, margin: "0 0 12px" }}>Form submitted!</p>
                <pre style={{ textAlign: "left", fontSize: 12, background: "#fff", border: "1px solid #bbf7d0", borderRadius: 8, padding: 12, overflow: "auto", maxHeight: 192 }}>
                    {JSON.stringify(values, null, 2)}
                </pre>
                <button onClick={handleReset} style={{ marginTop: 12, padding: "8px 18px", borderRadius: 10, border: "none", background: "#16a34a", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                    Submit another
                </button>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {schema.fields.map(field => (
                  <div key={field.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {field.type !== "checkbox" && (
                          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                            {field.label}
                            {field.validation?.required && <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>}
                          </label>
                      )}
                      <FieldRenderer
                          field={field}
                          value={values[field.id]}
                          error={errors[field.id] ?? ""}
                          onChange={handleChange}
                      />
                      {errors[field.id] && (
                          <p style={{ fontSize: 12, color: "#ef4444", margin: "2px 0 0" }}>{errors[field.id]}</p>
                      )}
                  </div>
            ))}

            <div className="flex gap-[10px] pt-2">
                <button
                    onClick={handleSubmit}
                    style={{
                        flex: 1,
                        padding: "11px 20px",
                        borderRadius: 12,
                        border: "none",
                        background: "#3b82f6",   // swap for a dynamic accentColor if you thread it through
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                >
                    Submit
                </button>
                <button
                    onClick={handleReset}
                    style={{
                        padding: "11px 20px",
                        borderRadius: 12,
                        border: "1.5px solid #e5e7eb",
                        background: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#6b7280",
                        cursor: "pointer",
                    }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

// Demo App //

export default function App() {
    const [log, setLog] = useState<FormValues | null>(null);
    console.log(log);

    return (
        <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{DEFAULT_SCHEMA.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Driven by a <code className="bg-gray-100 px-1 rounded">FormSchema</code> — swap in any schema to generate a new form.
                    </p>
                </div>

                <DynamicForm
                    schema={DEFAULT_SCHEMA}
                    onSubmit={vals => setLog(vals)}
                />
            </div>
        </div>
    );
}