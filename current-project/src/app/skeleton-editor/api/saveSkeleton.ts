// app/skeleton-editor/api/saveSkeleton.ts
import { EditSkeletonAPI } from "../skeleton-editor-types";
import { loadCraniometrics } from "./loadCraniometrics";
import { saveCraniometrics } from "./saveCraniometrics";
import { saveInventory } from "./inventoryUtils";
import { savePostcranialMetrics } from "./metricsAPI";

/**
 * Saves the skeleton and its related data (specimen, taxonomy, etc.)
 * back to the backend using existing /api routes.
 *
 * @param API_URL_ROOT - Root URL of your backend
 * @param api - The full EditSkeletonAPI object from context
 * @returns A success/failure message or thrown error
 */
export async function saveSkeletonData(API_URL_ROOT: string, api: EditSkeletonAPI) {
  try {
    console.log("💾 Saving skeleton data...");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated. Please log in first.");

    // --- 1️⃣ Save or update specimen ---
    const specimenBody = {
      museum_id: api.specimen.museum_id,
      specimen_name: "",
      specimen_number: api.specimen.specimen_number,
      broad_region: api.locality.broad_region || "",
      country: api.locality.country || "",
      locality: api.locality.locality || "",
      region: api.locality.region || "",
      sex: api.specimen.sex || "",
      user_id: api.user.user_id || null,
    };

    let specimenId = api.specimen.specimen_id;

    // Check if specimen already exists (update) or create new
    const specimenMethod = specimenId && specimenId > 0 ? "PUT" : "POST";
    const specimenUrl =
      specimenMethod === "PUT"
        ? `${API_URL_ROOT}/api/specimen/${specimenId}`
        : `${API_URL_ROOT}/api/specimen`;

    const specimenRes = await fetch(specimenUrl, {
      method: specimenMethod,
      headers: { "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
       },
      body: JSON.stringify(specimenBody),
    });

    if (!specimenRes.ok) throw new Error(`Specimen save failed (${specimenRes.status})`);
    const specimenResult = await specimenRes.json();

    // If new, update the ID
    if (!specimenId || specimenId < 0) specimenId = specimenResult.id;

        // --- 2️⃣ Save or update taxonomy ---
    const taxonomyBody = {
    parvorder: api.taxonomy.parvorder || "",
    superfamily: api.taxonomy.superfamily || "",
    family: api.taxonomy.family || "",
    subfamily: api.taxonomy.subfamily || "",
    genus: api.taxonomy.genus || "",
    species: "", // optional for now
    specimen_id: specimenId,
    };

    // ✅ Step 1: Check if taxonomy already exists for this specimen
    const existingTaxonomyRes = await fetch(
    `${API_URL_ROOT}/api/taxonomy/bySpecimen/${specimenId}`,
    {
        headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
        },
    }
    );

    let taxonomyMethod = "POST";
    let taxonomyUrl = `${API_URL_ROOT}/api/taxonomy`;

    if (existingTaxonomyRes.ok) {
    const taxonomies = await existingTaxonomyRes.json();

    // if there is already a taxonomy for this specimen
    if (Array.isArray(taxonomies) && taxonomies.length > 0) {
        const taxonomyId = taxonomies[0].taxonomy_id;
        taxonomyMethod = "PUT";
        taxonomyUrl = `${API_URL_ROOT}/api/taxonomy/${taxonomyId}`;
    }
    }

    // ✅ Step 2: Save (create or update)
    const taxonomyRes = await fetch(taxonomyUrl, {
    method: taxonomyMethod,
    headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(taxonomyBody),
    });

    if (!taxonomyRes.ok) {
    console.warn("⚠️ Taxonomy save skipped or failed (no taxonomy yet).");
    } else {
    console.log(`✅ Taxonomy ${taxonomyMethod} successful`);
    }

    // --- 3️⃣ Save skeleton record itself ---
    const skeletonBody = {
      specimen_id: specimenId,
      skeleton_type: "full",
      skeleton_name: "Test Skeleton",
    };

    const skeletonMethod = api.skeleton_id && api.skeleton_id > 0 ? "PUT" : "POST";
    const skeletonUrl =
      skeletonMethod === "PUT"
        ? `${API_URL_ROOT}/api/skeletal_inventory/${api.skeleton_id}`
        : `${API_URL_ROOT}/api/skeletal_inventory`;

    const skeletonRes = await fetch(skeletonUrl, {
      method: skeletonMethod,
      headers: { "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
       },
      body: JSON.stringify(skeletonBody),
    });

    if (!skeletonRes.ok)
      throw new Error(`Skeleton save failed (${skeletonRes.status})`);

    const skeletonResult = await skeletonRes.json();
    await saveCraniometrics(API_URL_ROOT, api);
    await saveInventory("cranial", api.specimen.specimen_id, api.cranial_inventory);
    await saveInventory("postcranial", api.specimen.specimen_id, api.postcranial_inventory);
    await savePostcranialMetrics(api.skeleton_id, api.postcranial_metrics);
    console.log(api);

    

    console.log("✅ Skeleton saved successfully:", skeletonResult);
    return { success: true, message: "Skeleton saved successfully." };


  } catch (error: any) {
    console.error("❌ Error saving skeleton data:", error);
    return { success: false, message: error.message };
  }

}
