import type { EditSkeletonAPI, CranialNonmetric } from "../skeleton-editor-types";

/**
 * Load all cranial nonmetric categories from backend (facial, lateral, basilar, mandibular, macromorphoscopics)
 * and merge them into the EditSkeletonAPI context.
 */
export async function loadNonmetrics(
  API_URL_ROOT: string,
  specimen_id: number,
  setAPI: React.Dispatch<React.SetStateAction<EditSkeletonAPI>>
) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated. Please log in first.");

  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  };

  const endpoints = [
    "facial",
    "lateral",
    "basilar",
    "mandibular",
    "macromorphoscopics",
  ];

  // Helper to normalize database column keys into readable labels
  function normalizeKey(key: string): string {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  }

  const results: CranialNonmetric[] = [];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${API_URL_ROOT}/api/${endpoint}/${specimen_id}`, {
        headers,
      });
      if (!res.ok) {
        console.warn(`⚠️ ${endpoint} not found for specimen ${specimen_id}`);
        continue;
      }

      const row = await res.json();

      // If backend returns a single record (object)
      if (row && typeof row === "object") {
        Object.entries(row)
          .filter(([key]) => key !== "specimen_id")
          .forEach(([key, value]) => {
            results.push({
              category: endpoint,
              nonmetric_name: normalizeKey(key),
              value_str: value ? String(value) : "",
            });
          });
      }
    } catch (err) {
      console.error(`❌ Failed to load ${endpoint}:`, err);
    }
  }

  // ✅ Update the context with all combined nonmetrics
  setAPI((prev: EditSkeletonAPI) => ({
    ...prev,
    cranial_nonmetrics: results,
    specimen: {
      ...prev.specimen,
      specimen_id,
    },
  }));

  console.log("✅ Loaded nonmetrics:", results);
  return results;
}
