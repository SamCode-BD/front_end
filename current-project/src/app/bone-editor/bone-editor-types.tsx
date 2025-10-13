export type EditBoneAPI = {
    specimen: Specimen,
    user: User,
    bone: Bone,
    measurements: Measurement[]
    taphonomy: Taphonomy,
    taxonomy: Taxonomy,
    locality: Locality
}

export type Taphonomy = {
    bone_condition: number,
    surface_exposure: boolean,
    bone_color: string,
    staining: string[],
    surface_damage: string[],
    adherent_materials: string[],
    modifications: string[],
    comments: string
}

export type Specimen = {
    specimen_id: number,
    specimen_number: number,
    museum_name: string,
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

export type Bone = {
    bone_id: number,
    bone_name: string
}

export type User = {
    user_id: number,
    user_name: string,
}

export type Measurement = {
    metric_name: string,
    metric_value: number
}

export const DEFAULT_EDIT_BONE_API: EditBoneAPI = {
    specimen: {
        specimen_id: -1,
        specimen_number: 0,
        museum_name: "",
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
    measurements: [],
    user: {
        user_id: -1,
        user_name: "",
    },
    bone: {
        bone_id: 0,
        bone_name: "",
    },
    taphonomy: {
        bone_condition: 0,
        surface_exposure: false,
        bone_color: "",
        staining: [],
        surface_damage: [],
        adherent_materials: [],
        modifications: [],
        comments: "",
    },
};
