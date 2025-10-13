"use client";
//AI Slop code

import React, { createContext, useContext, useState } from "react";
import { produce } from "immer";
import { EditBoneAPI } from "./bone-editor-types";
import { DEFAULT_EDIT_BONE_API } from "./bone-editor-types";

// --- Helper Types ---
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
type ArraySections = {
  [K in keyof EditBoneAPI]: EditBoneAPI[K] extends Array<any> ? K : never;
}[keyof EditBoneAPI];

// --- Context Value Type ---
type EditBoneAPIContextType = {
  api: EditBoneAPI;
  updateAPI: React.Dispatch<React.SetStateAction<EditBoneAPI>>;
  updateField: {
    // object overload
    <T extends keyof EditBoneAPI>(
      section: Exclude<T, ArraySections>,
      field: keyof EditBoneAPI[T],
      value: EditBoneAPI[T][typeof field]
    ): void;
    // array overload
    <T extends ArraySections>(
      section: T,
      newItem: ArrayElement<EditBoneAPI[T]>,
      matchKey: keyof ArrayElement<EditBoneAPI[T]>
    ): void;
  };
};

// --- Create Context ---
const EditBoneAPIContext = createContext<EditBoneAPIContextType | null>(null);

// --- Provider ---
export const EditBoneAPIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [api, setAPI] = useState<EditBoneAPI>(DEFAULT_EDIT_BONE_API);

  // --- Unified Implementation ---
  function updateField<T extends keyof EditBoneAPI>(
  section: T,
  fieldOrItem: keyof EditBoneAPI[T] | any,
  valueOrKey?: any,
  matchKey?: string
) {
  setAPI(prev =>
    produce(prev, draft => {
      const target = draft[section];

      // ✅ CASE 1: Top-level array (like measurements)
      if (Array.isArray(target)) {
        const newItem = fieldOrItem;
        const key = valueOrKey;

        if (!key) {
          console.error(
            `updateField: matchKey is required for array section (${String(section)})`
          );
          return;
        }

        const index = target.findIndex((item: any) => item[key] === newItem[key]);
        if (index !== -1) target[index] = newItem;
        else target.push(newItem);
        return;
      }

      // ✅ CASE 2: Nested array inside an object (like taphonomy.staining)
      const field = fieldOrItem as keyof EditBoneAPI[T];
      const value = valueOrKey;
      const current = target[field];

      if (Array.isArray(current)) {
        // toggle-like behavior: add if missing, remove if present
        const idx = current.indexOf(value);
        if (idx === -1) current.push(value);
        else current.splice(idx, 1);
        return;
      }

      // ✅ CASE 3: Normal object field (string, boolean, number, etc.)
      (target as any)[field] = value;
    })
  );
}

  return (
    <EditBoneAPIContext.Provider value={{ api, updateAPI: setAPI, updateField }}>
      {children}
    </EditBoneAPIContext.Provider>
  );
};

// --- Hook for Consumers ---
export function useEditBoneAPI() {
  const ctx = useContext(EditBoneAPIContext);
  if (!ctx)
    throw new Error("useEditBoneAPI must be used within an EditBoneAPIProvider");
  return ctx;
}
