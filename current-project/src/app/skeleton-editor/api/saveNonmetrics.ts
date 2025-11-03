import {EditSkeletonAPI} from "../skeleton-editor-types";
import type {CranialNonmetric} from "../skeleton-editor-types"
const API_URL_ROOT = process.env.NEXT_PUBLIC_API_URL;

export async function saveNonmetrics(api : EditSkeletonAPI) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated. Please log in first.");

    const specimenId = api.specimen.specimen_id;
    console.log(api.specimen.specimen_id);
    if (!specimenId || specimenId < 1) throw new Error("Invalid specimen ID");

    async function saveCategory (
        endpoint: string,
        all_values: CranialNonmetric[]
    ) {
        const nonmetrics = all_values.filter((n) => String(n.category) === String(endpoint));
        console.log(nonmetrics);
        if (!nonmetrics.length) return;
        //const body : Record<string, number | string> = {specimen_id : specimenId};
        const body : Record<string, number | string> = {};
        for (const n of nonmetrics) {
            if(n.nonmetric_name != undefined && n.value_str != undefined) {
                const col = n.nonmetric_name
                .toLowerCase()
                .replace(/\s+/g, "_")
                .replace(/[^\w_]/g, "");
                body[col] = n.value_str;
            }
        }
        console.log(body);

        const existingRes = await fetch(`${API_URL_ROOT}/api/${endpoint}/${specimenId}`, {
        method: 'GET',
        headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
        }});

        const existing = await existingRes.json();
        console.log(existing);
        //const method = existing != undefined ? "PUT" : "POST";
        const method = existingRes.ok ? "PUT" : "POST";

        const url =`${API_URL_ROOT}/api/${endpoint}/${specimenId}`;
        /*
        method === "PUT"
            ? `${API_URL_ROOT}/api/${endpoint}/${specimenId}`
            : `${API_URL_ROOT}/api/${endpoint}`;
            */

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
    await saveCategory("facial", api.cranial_nonmetrics);
    await saveCategory("lateral", api.cranial_nonmetrics);
    await saveCategory("basilar", api.cranial_nonmetrics);
    await saveCategory("mandibular", api.cranial_nonmetrics);
    await saveCategory("macromorphoscopics", api.cranial_nonmetrics);

    return { success: true };

}