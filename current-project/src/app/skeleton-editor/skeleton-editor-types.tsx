export type User = {
    user_id:  number
    user_name: string
}

export type Specimen = {
    specimen_id: number,
    skeleton_name : string,
    specimen_number: number,
    museum_id: number,
    sex: string
}

export type Taxonomy = {
    parvorder: string,
    superfamily: string,
    family: string,
    subfamily: string,
    genus: string
}

export type Locality = {
    broad_region: string,
    country: string,
    locality: string,
    region: string
}

export type Measurement = {
    metric_name: string,
    metric_value: number
}

export type Inventory = {
    inv_entry_name: string
    value?: number
    taphonomy_id?: number
    isChecked: boolean
}

export type Taphonomy = {
    bone_name: string,
    taphonomy_id: number,
    bone_condition: number,
    surface_exposure: boolean,
    bone_color: string,
    staining: string[],
    surface_damage: string[],
    adherent_materials: string[],
    modifications: string[],
    comments: string
}

export type CranialNonmetric = {
    category: string
    nonmetric_name: string
    value_str: string
}

export type EditSkeletonAPI = {
    skeleton_id: number
    user: User
    specimen: Specimen
    locality: Locality
    taxonomy: Taxonomy
    taphonomy_all: Taphonomy[]
    metrics_cranium: Measurement[]
    metrics_mandible: Measurement[]
    postcranial_metrics: Measurement[]
    cranial_inventory: Inventory[]
    postcranial_inventory: Inventory[]
    cranial_nonmetrics: CranialNonmetric[]
}

export const DEFAULT_EDIT_SKELETON_API: EditSkeletonAPI = {
  skeleton_id: -1,
  user: {
    user_id: -1,
    user_name: "",
  },
  specimen: {
    specimen_id: -1,
    skeleton_name: "",
    specimen_number: 0,
    museum_id: 0,
    sex: "",
  },
  taxonomy: {
      parvorder: "",
      superfamily: "",
      family: "",
      subfamily: "",
      genus: "",
    },
    locality: {
        broad_region: "",
        country: "",
        locality: "",
        region: "",
    },
  taphonomy_all: [],
  metrics_cranium: [],
  metrics_mandible: [],
  postcranial_metrics: [],
  cranial_inventory: [],
  postcranial_inventory: [],
  cranial_nonmetrics: [],
};