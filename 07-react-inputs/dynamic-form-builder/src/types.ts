import type { SelectOption, ValidationRule, FieldType } from "./formBoiler.utils";

// ─── BuilderField (lives in Redux) ───────────────────────────────────────────

export type BuilderValidation = {
  [K in keyof ValidationRule]: K extends "required" ? boolean : ValidationRule[K] | "";
};

export interface BuilderField {
  id:           string;   // stable internal key
  fieldId:      string;   // user-specified form field id
  type:         FieldType;
  label:        string;
  placeholder:  string;
  options:      SelectOption[];
  validation:   BuilderValidation;
  defaultValue: string;
}

// ─── UI Context A: open/closed accordion state (changes frequently) ──────────
// Split from schema state so field-editor expansion never re-renders the
// title input or the preview, and vice-versa.

export interface OpenFieldsContextValue {
  openFields:  Set<string>;
  toggleField: (id: string) => void;
}

// ─── UI Context B: selected field id (URL-driven, but mirrored here for      ─
//     components that don't want to call useSearch directly)                  ─

export interface SelectionContextValue {
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
}