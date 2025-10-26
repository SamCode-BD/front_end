// utils/inventoryAPI.ts
const API_URL_ROOT = process.env.NEXT_PUBLIC_API_URL;
export async function loadInventory(type: "cranial" | "postcranial", specimen_id: number, setAPI : any) {
  try {
    const res = await fetch(`${API_URL_ROOT}/api/${type}_inventory/${specimen_id}`);
    if (!res.ok) {
      console.warn(`⚠️ Failed to load ${type} inventory: ${res.status} ${res.statusText}`);
      return []; // safely return empty array instead of throwing
    }
    const data = await res.json();
    const enhanced_data = data.map((item : any) => ({ //check the boxes that were found
      ...item,
      isChecked: true
    })
    )
    console.log(data);
    if(type == "cranial") {
      setAPI(prev => ({...prev, cranial_inventory: enhanced_data}))
    }
    else {
      setAPI(prev => ({...prev, postcranial_inventory: enhanced_data}))
    }

  } catch (err: any) {
    console.error(`❌ Error loading ${type} inventory:`, err.message || err);
    return []; // continue gracefully
  }
}

export async function saveInventory(
  type: "cranial" | "postcranial",
  specimen_id: number,
  inventoryArray: any[]
) {
  try {
    const res = await fetch(`${API_URL_ROOT}/api/${type}_inventory/${specimen_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inventory: inventoryArray.filter(i => i.isChecked == true) }),
    });
    if (!res.ok) {
      console.warn(`⚠️ Failed to save ${type} inventory: ${res.status} ${res.statusText}`);
      return { ok: false };
    }
    return await res.json();
  } catch (err: any) {
    console.error(`❌ Error saving ${type} inventory:`, err.message || err);
    return { ok: false };
  }
}
