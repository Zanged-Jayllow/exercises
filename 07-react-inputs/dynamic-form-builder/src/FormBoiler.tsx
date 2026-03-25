import { useState, useCallback, useMemo } from "react";
import type { CSSProperties } from "react";
import type { FormField, FormTheme, DynamicFormProps } from "./formBoiler.utils";
import type { FormValues, FormErrors } from "./formBoiler.utils";
import { validateField } from "./formBoiler.utils";

const defaultTheme: Required<FormTheme> = {
    primaryColor:   "#3b82f6",
    errorColor:     "#ef4444",
    errorBg:        "#fef2f2",
    errorBorder:    "#f87171",
    successColor:   "#15803d",
    successBg:      "#f0fdf4",
    successBorder:  "#bbf7d0",
    labelColor:     "#374151",
    inputBg:        "#ffffff",
    inputBorder:    "#e5e7eb",
    inputText:      "#111827",
    resetBg:        "#ffffff",
    resetBorder:    "#e5e7eb",
    resetText:      "#6b7280",
    borderRadius:   "10px",
    inputPadding:   "10px 14px",
    fontSize:       "14px",
    labelSize:      "13px",
};

// Converting CSS Classes //

function buildCSSVars(theme: FormTheme = {}): CSSProperties {
    const t = { ...defaultTheme, ...theme };
    return {
        "--fb-primary":        t.primaryColor,
        "--fb-error":          t.errorColor,
        "--fb-error-bg":       t.errorBg,
        "--fb-error-border":   t.errorBorder,
        "--fb-success":        t.successColor,
        "--fb-success-bg":     t.successBg,
        "--fb-success-border": t.successBorder,
        "--fb-label":          t.labelColor,
        "--fb-input-bg":       t.inputBg,
        "--fb-input-border":   t.inputBorder,
        "--fb-input-text":     t.inputText,
        "--fb-reset-bg":       t.resetBg,
        "--fb-reset-border":   t.resetBorder,
        "--fb-reset-text":     t.resetText,
        "--fb-radius":         t.borderRadius,
        "--fb-padding":        t.inputPadding,
        "--fb-font-size":      t.fontSize,
        "--fb-label-size":     t.labelSize,
    } as CSSProperties;
}

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
        padding: "var(--fb-padding)",
        borderRadius: "var(--fb-radius)",
        border: `1.5px solid ${error ? "var(--fb-error-border)" : "var(--fb-input-border)"}`,
        background: error ? "var(--fb-error-bg)" : "var(--fb-input-bg)",
        color: "var(--fb-input-text)",
        fontSize: "var(--fb-font-size)",
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
                    style={{ ...baseStyle,resize: "vertical", minHeight: 60 }}
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
                        style={{ width: 16, height: 16, accentColor: "var(--fb-primary)" }}
                        checked={Boolean(value)}
                        onChange={change}
                    />
                    <span style={{ fontSize: "var(--fb-font-size)", color: "var(--fb-label)" }}>{field.label}</span>
                </label>
            );
        case "color-swatch":
            return (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {field.options
                        ?.filter(o => o.value.trim() !== "" && o.label.trim() !== "")
                        .map(o => {
                            const selected = value !== "" && value === o.value;
                            return (
                                <button
                                    key={o.value}
                                    type="button"
                                    title={o.label}
                                    onClick={() => onChange(field.id, o.value)}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "var(--fb-radius)",
                                        background: o.value,
                                        border: `2.5px solid transparent`,
                                        outline: selected ? `3px solid ${o.value}` : "3px solid transparent",
                                        outlineOffset: 2,
                                        cursor: "pointer",
                                        transition: "outline-color 0.15s ease",
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

export function DynamicForm({ schema, onSubmit, theme }: DynamicFormProps) {
    const cssVars = useMemo(() => buildCSSVars(theme), [theme]);

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
            <div style={{
                ...cssVars,
                borderRadius: "var(--fb-radius)",
                border: "1px solid var(--fb-success-border)",
                background: "var(--fb-success-bg)",
                padding: 24,
                textAlign: "center",
            }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                <p style={{ fontWeight: 600, color: "var(--fb-success)", fontSize: 17, margin: "0 0 12px" }}>
                    Form submitted!
                </p>
                <pre style={{
                    textAlign: "left",
                    fontSize: 12,
                    background: "var(--fb-input-bg)",
                    border: "1px solid var(--fb-success-border)",
                    borderRadius: "var(--fb-radius)",
                    padding: 12,
                    overflow: "auto",
                    maxHeight: 192,
                }}>
                    {JSON.stringify(values, null, 2)}
                </pre>
                <button onClick={handleReset} style={{
                    marginTop: 12,
                    padding: "8px 18px",
                    borderRadius: "var(--fb-radius)",
                    border: "none",
                    background: "var(--fb-success)",
                    color: "#fff",
                    fontSize: "var(--fb-font-size)",
                    fontWeight: 600,
                    cursor: "pointer",
                }}>
                    Submit another
                </button>
            </div>
        );
    }

    return (
        <div style={{ ...cssVars, display: "flex", flexDirection: "column", gap: 14 }}>
            {schema.fields.map(field => (
                <div key={field.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {field.type !== "checkbox" && (
                        <label style={{ display: "block", fontSize: "var(--fb-label-size)", fontWeight: 600, color: "var(--fb-label)" }}>
                            {field.label}
                            {field.validation?.required && (
                                <span style={{ color: "var(--fb-error)", marginLeft: 4 }}>*</span>
                            )}
                        </label>
                    )}
                    <FieldRenderer
                        field={field}
                        value={values[field.id]}
                        error={errors[field.id] ?? ""}
                        onChange={handleChange}
                    />
                    {errors[field.id] && (
                        <p style={{ fontSize: 12, color: "var(--fb-error)", margin: "2px 0 0" }}>
                            {errors[field.id]}
                        </p>
                    )}
                </div>
            ))}

            <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
                <button onClick={handleSubmit} style={{
                    flex: 1,
                    padding: "11px 20px",
                    borderRadius: "var(--fb-radius)",
                    border: "none",
                    background: "var(--fb-primary)",
                    color: "#fff",
                    fontSize: "var(--fb-font-size)",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                }}>
                    Submit
                </button>
                <button onClick={handleReset} style={{
                    padding: "11px 20px",
                    borderRadius: "var(--fb-radius)",
                    border: `1.5px solid var(--fb-reset-border)`,
                    background: "var(--fb-reset-bg)",
                    fontSize: "var(--fb-font-size)",
                    fontWeight: 600,
                    color: "var(--fb-reset-text)",
                    cursor: "pointer",
                }}>
                    Reset
                </button>
            </div>
        </div>
    );
}