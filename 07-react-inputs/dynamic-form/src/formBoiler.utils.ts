// Type Declaration //

export type FieldType = "text" | "email" | "number" | "select" | "checkbox" | "textarea" | "date" | "url" | "color-swatch";

export interface SelectOption {
    _id?: string;
    label: string;
    value: string;
}

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
}

export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    options?: SelectOption[];
    validation?: ValidationRule;
    defaultValue?: string | boolean | number;
}

export interface FormSchema {
    title: string;
    fields: FormField[];
}

export type FormValues = Record<string, string | boolean | number>;

export type FormErrors = Record<string, string>;

export interface FormTheme {
    // Colours //
    primaryColor?: string;        // submit button + accent
    errorColor?: string;          // border + text on error
    errorBg?: string;             // input background on error
    errorBorder?: string;         // input border on error
    successColor?: string;        // success state text
    successBg?: string;           // success state background
    successBorder?: string;       // success state border
    labelColor?: string;
    inputBg?: string;
    inputBorder?: string;
    inputText?: string;
    resetBg?: string;
    resetBorder?: string;
    resetText?: string;

    // Shape + Padding //
    borderRadius?: string;
    inputPadding?: string;
    fontSize?: string;
    labelSize?: string;
}

// Input Validation //

export function validateField(field: FormField, value: string | boolean | number): string {
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

// Dynamic Form //

export interface DynamicFormProps {
    schema: FormSchema;
    onSubmit: (values: FormValues) => void;
    theme?: FormTheme;
}