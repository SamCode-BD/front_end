import { postcranial_inventory_list } from "@/components/editor/skeleton-editor/postcranial-inventory-list";

const API_ROOT = process.env.NEXT_PUBLIC_API_URL || "";

export async function loadPostcranialMetrics(skeleton_id: number, setAPI : any) {
  try {
    const res = await fetch(`${API_ROOT}/api/postcranial_metrics/${skeleton_id}`);
    if (!res.ok) {
      console.warn(`⚠️ Failed to load postcranial metrics: ${res.status}`);
      return [];
    }
    const data = await res.json();
    setAPI(prev => ({...prev, postcranial_metrics : data}));
    //console.log(data);
  } catch (err) {
    console.error("❌ Error loading postcranial metrics:", err);
    return [];
  }
}

export async function savePostcranialMetrics(
  skeleton_id: number,
  metrics: { metric_name: string; metric_value: number | null }[]
) {
  try {
    const res = await fetch(`${API_ROOT}/api/postcranial_metrics/${skeleton_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metrics }),
    });
    if (!res.ok) {
      console.warn(`⚠️ Failed to save postcranial metrics: ${res.status}`);
      return { ok: false };
    }
    return await res.json();
  } catch (err) {
    console.error("❌ Error saving postcranial metrics:", err);
    return { ok: false };
  }
}
