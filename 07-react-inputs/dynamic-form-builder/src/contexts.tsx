import { createContext, useContext, useState, useCallback } from "react";
import type { FC, ReactNode } from "react";
import type { OpenFieldsContextValue, SelectionContextValue } from "./types";

// ─── Context A: accordion open/close ─────────────────────────────────────────
// Completely independent of schema data — toggling a field open/closed must
// not cause the Redux-connected title or field-list to re-render.

const OpenFieldsCtx = createContext<OpenFieldsContextValue | null>(null);

export const OpenFieldsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [openFields, setOpenFields] = useState<Set<string>>(new Set());

  const toggleField = useCallback((id: string) => {
    setOpenFields(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return (
    <OpenFieldsCtx.Provider value={{ openFields, toggleField }}>
      {children}
    </OpenFieldsCtx.Provider>
  );
};

export function useOpenFields(): OpenFieldsContextValue {
  const ctx = useContext(OpenFieldsCtx);
  if (!ctx) throw new Error("useOpenFields must be used within OpenFieldsProvider");
  return ctx;
}

// ─── Context B: selected field (mirrors ?field= URL param) ───────────────────
// Kept in context (not just useSearch) so non-router-aware components like
// FieldEditor can read it without being coupled to TanStack Router's API.

const SelectionCtx = createContext<SelectionContextValue | null>(null);

export const SelectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  return (
    <SelectionCtx.Provider value={{ selectedFieldId, setSelectedFieldId }}>
      {children}
    </SelectionCtx.Provider>
  );
};

export function useSelection(): SelectionContextValue {
  const ctx = useContext(SelectionCtx);
  if (!ctx) throw new Error("useSelection must be used within SelectionProvider");
  return ctx;
}