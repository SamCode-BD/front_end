"use client";
//AI Slop code

import React, { createContext, useContext, useState } from "react";
import { produce } from "immer";
import { EditSkeletonAPI } from "./skeleton-editor-types";
import { DEFAULT_EDIT_SKELETON_API } from "./skeleton-editor-types";

// --- Helper Types ---
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
type ArraySections = {
  [K in keyof EditSkeletonAPI]: EditSkeletonAPI[K] extends Array<any> ? K : never;
}[keyof EditSkeletonAPI];

// --- Context Value Type ---
type EditSkeletonAPIContextType = {
  api: EditSkeletonAPI;
  updateAPI: React.Dispatch<React.SetStateAction<EditSkeletonAPI>>;
  updateField: {
    // object overload
    <T extends keyof EditSkeletonAPI>(
      section: Exclude<T, ArraySections>,
      field: keyof EditSkeletonAPI[T],
      value: EditSkeletonAPI[T][typeof field]
    ): void;
    // array overload
    <T extends ArraySections>(
      section: T,
      newItem: ArrayElement<EditSkeletonAPI[T]>,
      matchKey: keyof ArrayElement<EditSkeletonAPI[T]>
    ): void;
  };
};

// --- Create Context ---
const EditSkeletonAPIContext = createContext<EditSkeletonAPIContextType | null>(null);

// --- Provider ---
export const EditSkeletonAPIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [api, setAPI] = useState<EditSkeletonAPI>(DEFAULT_EDIT_SKELETON_API);

  // --- Unified Implementation ---
  function updateField<T extends keyof EditSkeletonAPI>(
  section: T,
  fieldOrItem: keyof EditSkeletonAPI[T] | any,
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
      const field = fieldOrItem as keyof EditSkeletonAPI[T];
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
    <EditSkeletonAPIContext.Provider value={{ api, updateAPI: setAPI, updateField }}>
      {children}
    </EditSkeletonAPIContext.Provider>
  );
};

// --- Hook for Consumers ---
export function useEditSkeletonAPI() {
  const ctx = useContext(EditSkeletonAPIContext);
  if (!ctx)
    throw new Error("useEditSkeletonAPI must be used within an EditSkeletonAPIProvider");
  return ctx;
}
