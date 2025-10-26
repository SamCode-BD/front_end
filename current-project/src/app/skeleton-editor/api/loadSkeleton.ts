// app/skeleton-editor/api/loadSkeleton.ts
import { DEFAULT_EDIT_SKELETON_API } from "../skeleton-editor-types";
import {jwtDecode} from "jwt-decode"
import { loadCraniometrics } from "./loadCraniometrics";
import { loadInventory } from "./inventoryUtils";
import { loadPostcranialMetrics } from "./metricsAPI";


type DecodedToken = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
};

export async function loadSkeletonData(API_URL_ROOT: string, setAPI: any) {
  try {
    const token = localStorage.getItem("token");

    if (token) {
        try {
        const decoded = jwtDecode<DecodedToken>(token);
        //console.log(decoded);

        setAPI(prev => ({
            ...prev,
            user: {
            ...prev.user,
            user_id: decoded.id,
            user_name: decoded.name,
            },
        }));
        } catch (error) {
        console.error("Invalid token:", error);
        }
    }

    const response = await fetch(`${API_URL_ROOT}/api/skeletal_inventory/1`);
    if (!response.ok) throw new Error(`Failed to fetch skeleton: ${response.status}`);
    const skeletonData = await response.json();

    const specimenId = skeletonData.specimen_id;
    const specimenResponse = await fetch(`${API_URL_ROOT}/api/specimen/${specimenId}`);
    const specimenData = await specimenResponse.json();

    let taxonomyData: Partial<typeof DEFAULT_EDIT_SKELETON_API["taxonomy"]> | null = null;
    try {
      const taxonomyResponse = await fetch(`${API_URL_ROOT}/api/taxonomy/bySpecimen/${specimenId}`);
      if (taxonomyResponse.ok) {
        const taxonomyList = await taxonomyResponse.json();
        taxonomyData = Array.isArray(taxonomyList) ? taxonomyList[0] : taxonomyList;
      }
    } catch {
      console.warn("No taxonomy found for specimen — continuing without it.");
    }

    setAPI((prev: any) => ({
      ...prev,
      skeleton_id: skeletonData.skeleton_id,
      specimen: {
        specimen_id: specimenData.specimen_id,
        specimen_number: specimenData.specimen_number,
        museum_id: specimenData.museum_id,
        sex: specimenData.sex || "",
      },
      taxonomy: taxonomyData
        ? {
            parvorder: taxonomyData.parvorder || "",
            superfamily: taxonomyData.superfamily || "",
            family: taxonomyData.family || "",
            subfamily: taxonomyData.subfamily || "",
            genus: taxonomyData.genus || "",
          }
        : prev.taxonomy,
      locality: {
        broad_region: specimenData.broad_region || "",
        country: specimenData.country || "",
        locality: specimenData.locality || "",
        region: specimenData.region || "",
      },
    }));

    await loadCraniometrics(API_URL_ROOT, specimenData.specimen_id, setAPI);
    await loadInventory("cranial", specimenData.specimen_id, setAPI);
    await loadInventory("postcranial", specimenData.specimen_id, setAPI);
    await loadPostcranialMetrics(skeletonData.skeleton_id, setAPI);
    

    console.log("✅ Skeleton data loaded successfully");
  } catch (error) {
    console.error("❌ Error loading skeleton data:", error);
  }
}
