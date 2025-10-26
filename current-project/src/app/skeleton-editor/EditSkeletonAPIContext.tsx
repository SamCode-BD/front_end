"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { produce } from "immer";
import { EditSkeletonAPI, DEFAULT_EDIT_SKELETON_API } from "./skeleton-editor-types";
import { loadSkeletonData } from "./api/loadSkeleton";
import { saveSkeletonData } from "./api/saveSkeleton";
import { linkSpecimenToSkeleton } from "./api/linkSpecimenToSkeleton";
import { saveCraniometrics } from "./api/saveCraniometrics";

const API_URL_ROOT = process.env.NEXT_PUBLIC_API_URL;
const EditSkeletonAPIContext = createContext<any>(null);

export const EditSkeletonAPIProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, setAPI] = useState<EditSkeletonAPI>(DEFAULT_EDIT_SKELETON_API);

  useEffect(() => {
    loadSkeletonData(API_URL_ROOT!, setAPI);
    
  }, []);

  //console.log(api);

  async function handleSave() {
    const result = await saveSkeletonData(API_URL_ROOT!, api);
    //const result = await saveCraniometrics(API_URL_ROOT!, api);
    alert(result.message);
    //await linkSpecimenToSkeleton(API_URL_ROOT!, api);
  }

  function updateField<T extends keyof EditSkeletonAPI>(
    section: T,
    fieldOrItem: keyof EditSkeletonAPI[T] | any,
    valueOrKey?: any,
    matchKey?: string
  ) {
    //console.log(api);
    setAPI(prev =>
      produce(prev, draft => {
        const target = draft[section];
        if (Array.isArray(target)) {
          const newItem = fieldOrItem;
          const key = valueOrKey;
          if (!key) return;
          const index = target.findIndex((item: any) => item[key] === newItem[key]);
          if (index !== -1) target[index] = newItem;
          else target.push(newItem);
          return;
        }

        const field = fieldOrItem as keyof EditSkeletonAPI[T];
        const value = valueOrKey;
        const current = target[field];

        if (Array.isArray(current)) {
          const idx = current.indexOf(value);
          if (idx === -1) current.push(value);
          else current.splice(idx, 1);
          return;
        }

        (target as any)[field] = value;
      })
    );
  }

  return (
    <EditSkeletonAPIContext.Provider value={{ api, updateAPI: setAPI, updateField, handleSave}}>
      {children}
    </EditSkeletonAPIContext.Provider>
  );
};

export function useEditSkeletonAPI() {
  const ctx = useContext(EditSkeletonAPIContext);
  if (!ctx)
    throw new Error("useEditSkeletonAPI must be used within an EditSkeletonAPIProvider");
  return ctx;
}
