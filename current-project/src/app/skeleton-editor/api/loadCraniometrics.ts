
export async function loadCraniometrics(API_URL_ROOT: string, specimen_id : number, setAPI : any) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", authorization: `Bearer ${token}` };

  const [craniumRes, mandibleRes] = await Promise.all([
    fetch(`${API_URL_ROOT}/api/cranium_measurements/${specimen_id}`, { headers }),
    fetch(`${API_URL_ROOT}/api/mandible_measurements/${specimen_id}`, { headers }),
  ]);

  const craniumData = craniumRes.ok ? await craniumRes.json() : [];
  const mandibleData = mandibleRes.ok ? await mandibleRes.json() : [];

  function mapMeasurements(row: Record<string, any>): { metric_name: string; metric_value: number }[] {
      return Object.entries(row)
        .filter(([key]) => key !== "specimen_id")
        .map(([key, value]) => ({
          metric_name: key,
          metric_value: Number(value),
        }))
        .filter((m) => !isNaN(m.metric_value));
    }

    console.log(craniumData);

    // If backend returns an array (which it does)
    const newCraniumMetrics = Object.keys(craniumData).length
      ? mapMeasurements(craniumData)
      : [];
    const newMandibleMetrics = Object.keys(mandibleData).length
      ? mapMeasurements(mandibleData)
      : [];
    
      console.log(newCraniumMetrics)

    // ✅ Update context so the UI re-renders with the new data
    setAPI((prev : any) => ({
      ...prev,
      metrics_cranium: newCraniumMetrics,
      metrics_mandible: newMandibleMetrics,
      specimen: {
        ...prev,
        specimen_id: specimen_id, // keep it consistent
      },
    }));

  return { craniumData, mandibleData };
}
