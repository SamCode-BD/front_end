import { EditSkeletonAPI } from "../skeleton-editor-types";

export async function saveCraniometrics(API_URL_ROOT: string, api: EditSkeletonAPI) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated. Please log in first.");

  const specimenId = api.specimen.specimen_id;
  if (!specimenId || specimenId < 1) throw new Error("Invalid specimen ID");

  // Helper function to upsert data
  async function saveMeasurements(
    endpoint: string,
    measurements: { metric_name: string; metric_value: number }[]
  ) {
    // Convert to body with dynamic columns
    const body: Record<string, number | string> = { specimen_id: specimenId };
    for (const m of measurements) {
      if (m.metric_value !== undefined && !isNaN(m.metric_value)) {
        // Convert metric name to SQL-friendly column
        const col = m.metric_name
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^\w_]/g, "");
        body[col] = m.metric_value;
      }
    }
    //console.log(body);

    // Check if entry already exists
    const existingRes = await fetch(`${API_URL_ROOT}/api/${endpoint}/${specimenId}`, {
        method: 'GET',
        headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
        },
    });

    const existing = await existingRes.json();
    const method = existing != undefined ? "PUT" : "POST";
    //console.log(existing);
    //console.log("Array.isArray(existing) " + String(Array.isArray(existing)) + "\nexisting.length > 0 " + String(existing.length > 0));
    
    const url =
      method === "PUT"
        ? `${API_URL_ROOT}/api/${endpoint}/${specimenId}`
        : `${API_URL_ROOT}/api/${endpoint}`;

    // Save the record
    const saveRes = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!saveRes.ok) {
      const err = await saveRes.json();
      throw new Error(err.error || `Failed to save ${endpoint}`);
    }

    console.log(`✅ ${endpoint} ${method} successful`);
  }

  // --- Save both sets ---
  await saveMeasurements("cranium_measurements", api.metrics_cranium);
  await saveMeasurements("mandible_measurements", api.metrics_mandible);

  return { success: true };
}
