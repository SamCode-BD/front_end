export async function loadMuseums(API_URL_ROOT: string) {
  try {
    const response = await fetch(`${API_URL_ROOT}/api/museum`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch museums");
    const museums = await response.json();
    return museums; // array of { museum_id, museum_name, ... }
  } catch (error) {
    console.error("Error loading museums:", error);
    return [];
  }
}
