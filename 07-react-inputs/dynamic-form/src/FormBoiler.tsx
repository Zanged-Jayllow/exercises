import { useState, useCallback } from "react";

// Type Declaration //

type FieldType = "text" | "email" | "number" | "select" | "checkbox" | "textarea" | "date";

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

type FormValues = Record<string, string | boolean | number>;
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
  const base =
    "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all focus:ring-2 " +
    (error
      ? "border-red-400 focus:ring-red-300 bg-red-50"
      : "border-gray-300 focus:ring-blue-300 bg-white");

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const t = e.target as HTMLInputElement;
    onChange(field.id, field.type === "checkbox" ? t.checked : t.value);
  };

  switch (field.type) {
    case "select":
      return (
        <select className={base} value={String(value)} onChange={change}>
          <option value="">— Select —</option>
          {field.options?.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    case "textarea":
      return (
        <textarea
          className={`${base} resize-none h-24`}
          placeholder={field.placeholder}
          value={String(value)}
          onChange={change}
        />
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 accent-blue-500"
            checked={Boolean(value)}
            onChange={change}
          />
          <span className="text-sm text-gray-700">{field.label}</span>
        </label>
      );
    default:
      return (
        <input
          type={field.type}
          className={base}
          placeholder={field.placeholder}
          value={String(value)}
          onChange={change}
        />
      );
  }
}

// Dynamic Form //

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (values: FormValues) => void;
}

function DynamicForm({ schema, onSubmit }: DynamicFormProps) {
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
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center space-y-3">
        <div className="text-4xl">✅</div>
        <p className="font-semibold text-green-700 text-lg">Form submitted!</p>
        <pre className="text-left text-xs bg-white border border-green-200 rounded-lg p-3 overflow-auto max-h-48">
          {JSON.stringify(values, null, 2)}
        </pre>
        <button
          onClick={handleReset}
          className="mt-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {schema.fields.map(field => (
        <div key={field.id} className="space-y-1">
          {field.type !== "checkbox" && (
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          <FieldRenderer
            field={field}
            value={values[field.id]}
            error={errors[field.id] ?? ""}
            onChange={handleChange}
          />
          {errors[field.id] && (
            <p className="text-xs text-red-500">{errors[field.id]}</p>
          )}
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSubmit}
          className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          Submit
        </button>
        <button
          onClick={handleReset}
          className="px-4 rounded-lg border border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
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