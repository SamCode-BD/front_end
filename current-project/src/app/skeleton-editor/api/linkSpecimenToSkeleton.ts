import { EditSkeletonAPI } from "../skeleton-editor-types";

export async function linkSpecimenToSkeleton(API_URL_ROOT: string, api: EditSkeletonAPI) {

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated. Please log in first.");

    const hasSkeletonBody = {
        specimen_id: api.specimen.specimen_id,
        skeleton_id: api.skeleton_id
    }
    const response = await fetch(`${API_URL_ROOT}/api/has_skeleton`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "authorization": `Bearer ${token}`
    },
    body: JSON.stringify(hasSkeletonBody),
    });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to link specimen to skeleton');
  }
}