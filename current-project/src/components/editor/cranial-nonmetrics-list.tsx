import {drop_down_options as d} from "./cn-dropdown-options"
import {drop_down_common as dc} from "./cn-dropdown-common"

export type CranialNonmetricRow = [string, string[]];
export type CranialNonmetricList = {
  facial: CranialNonmetricRow[];
  lateral: CranialNonmetricRow[];
  basilar: CranialNonmetricRow[];
  mandibular: CranialNonmetricRow[];
};

export const cranial_nonmetrics_list: CranialNonmetricList = {
    facial: [
        ["L Infraorbital Suture", dc._0129],
        ["R Infraorbital Suture", dc._0129],
        ["L Infraorbital Foramen", [d._0, d.part, d.comp, "2 Distinct Foramina", ">2 Distinct Foramina", d._9]],
        ["R Infraorbital Foramen", [d._0, d.part, d.comp, "2 Distinct Foramina", ">2 Distinct Foramina", d._9]],
        ["L Zygomaticofacial Foramen", [d._0, "1 Large Only", "1 Large Plus Smaller Foramina", "2 Large Foramina", "2 Large Plus Smaller Foramina", "Multiple Smaller Foramina", d._9]],
        ["R Zygomaticofacial Foramen", [d._0, "1 Large Only", "1 Large Plus Smaller Foramina", "2 Large Foramina", "2 Large Plus Smaller Foramina", "Multiple Smaller Foramina", d._9]],
        ["Metopic Suture", [d._0, "Partial (Nasal)", "Partial (Bregmatic)", d._9]],
        ["L Supraorbital Notch", dc.mltn],
        ["R Supraorbital Notch", dc.mltn],
        ["L Supraorbital Foramen", [d._0, d.pres, d.mltf, d._9]],
        ["R Supraorbital Foramen", [d._0, d.pres, d.mltf, d._9]],
        ["L Supratrochlear Notch", dc.mltn],
        ["R Supratrochlear Notch", dc.mltn],
        ["L Coronal Ossicle", dc._019],
        ["R Coronal Ossicle", dc._019],
        ["L Epipteric Bone", dc._019],
        ["R Epipteric Bone", dc._019],

    ],
    lateral: [
        ["Bregmatic Bone", dc._019],
        ["Saggital Ossicle", dc._019],
        ["L Parietal Foramen", [d._0, "Present on Left Parietal", d._9]],
        ["Midline Parietal Foramen", [d._0, "Present on Suture", d._9]],
        ["R Parietal Foramen", [d._0, "Present on Right Parietal", d._9]],
        ["Apical Bone", dc._019],
        ["Inca Bone", dc._019],
        ["L Lambdoid Ossicle", dc._019],
        ["R Lambdoid Ossicle", dc._019],
        ["L Asterionic Bone", dc._019],
        ["R Asterionic Bone", dc._019],
        ["L Ossicle in Occipitomastoid Suture", dc._019],
        ["R Ossicle in Occipitomastoid Suture", dc._019],
        ["L Parietal Notch Bone", dc._019],
        ["R Parietal Notch Bone", dc._019],
        ["L Auditory Exostosis", [d._0, "< 1/3 Canal Occluded, 1/3 - 2/3 Canal Occluded", "> 1/3 Canal Occluded", d._9]],
        ["R Auditory Exostosis", [d._0, "< 1/3 Canal Occluded, 1/3 - 2/3 Canal Occluded", "> 1/3 Canal Occluded", d._9]],
        ["L Mastoid Foramen Number", dc.fmn_num],
        ["R Mastoid Foramen Number", dc.fmn_num],
        ["L Mastoid Foramen Location", [d._0, "Temporal", "Sutural", "Occipital", "Temporal and Occipital", "Temporal and Sutural", d._9]],
        ["R Mastoid Foramen Location", [d._0, "Temporal", "Sutural", "Occipital", "Temporal and Occipital", "Temporal and Sutural", d._9]]
    ],
    basilar: [
        ["L Condylar Canal", dc._0129],
        ["R Condylar Canal", dc._0129],
        ["L Divided Hypoglossal Canal", [d._0, "Partial, Internal Surface", "Partial, Within Canal", "Complete, Internal Surface", "Complete, Within Canal", "Complete, Internal Surface and With Canal", "Partial, Internal Surface and With Canal", d._9]],
        ["R Divided Hypoglossal Canal", [d._0, "Partial, Internal Surface", "Partial, Within Canal", "Complete, Internal Surface", "Complete, Within Canal", "Complete, Internal Surface and With Canal", "Partial, Internal Surface and With Canal", d._9]],
        ["L Tympanic Dehiscence", [d._0, "Foramen Only", "Full Defect Present", d._9]],
        ["R Tympanic Dehiscence", [d._0, "Foramen Only", "Full Defect Present", d._9]],
        ["L Foramen Spinosum Incomplete", dc.fmn_inc],
        ["R Foramen Spinosum Incomplete", dc.fmn_inc],
        ["L Foramen Ovale Incomplete", dc.fmn_inc],
        ["R Foramen Ovale Incomplete", dc.fmn_inc],
        ["L Pterygospinous Bridge", dc.bridge],
        ["R Pterygospinous Bridge", dc.bridge],
        ["L Pterygoalar Bridge", dc.bridge],
        ["R Pterygoalar Bridge", dc.bridge],
        ["Palatine Torus development", dc.torus],
        ["Palatine Torus location", [d._0, "Anterior", "Posterior", "Both", d._9]],
    ],
    mandibular: [
        ["L Mylohyoid Bridge development", dc._0129],
        ["R Mylohyoid Bridge development", dc._0129],
        ["L Mylohyoid Bridge location", dc._0129],
        ["R Mylohyoid Bridge location", dc._0129],
        ["L Mental Foramen", dc.fmn_num],
        ["R Mental Foramen", dc.fmn_num],
        ["L Mandibular Torus", dc.torus],
        ["R Mandibular Torus", dc.torus]
    ]
}