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
        ["Left Infraorbital Suture", dc._0129],
        ["Right Infraorbital Suture", dc._0129],
        ["Left Infraorbital Foramen", [d._0, d.part, d.comp, "2 Distinct Foramina", ">2 Distinct Foramina", d._9]],
        ["Right Infraorbital Foramen", [d._0, d.part, d.comp, "2 Distinct Foramina", ">2 Distinct Foramina", d._9]],
        ["Left Zygomaticofacial Foramen", [d._0, "1 Large Only", "1 Large Plus Smaller Foramina", "2 Large Foramina", "2 Large Plus Smaller Foramina", "Multiple Smaller Foramina", d._9]],
        ["Right Zygomaticofacial Foramen", [d._0, "1 Large Only", "1 Large Plus Smaller Foramina", "2 Large Foramina", "2 Large Plus Smaller Foramina", "Multiple Smaller Foramina", d._9]],
        ["Metopic Suture", [d._0, "Partial (Nasal)", "Partial (Bregmatic)", d._9]],
        ["Left Supraorbital Notch", dc.mltn],
        ["Right Supraorbital Notch", dc.mltn],
        ["Left Supraorbital Foramen", [d._0, d.pres, d.mltf, d._9]],
        ["Right Supraorbital Foramen", [d._0, d.pres, d.mltf, d._9]],
        ["Left Supratrochlear Notch", dc.mltn],
        ["Right Supratrochlear Notch", dc.mltn],
        ["Left Coronal Ossicle", dc._019],
        ["Right Coronal Ossicle", dc._019],
        ["Left Epipteric Bone", dc._019],
        ["Right Epipteric Bone", dc._019],

    ],
    lateral: [
        ["Bregmatic Bone", dc._019],
        ["Saggital Ossicle", dc._019],
        ["Left Parietal Foramen", [d._0, "Present on Left Parietal", d._9]],
        ["Midline Parietal Foramen", [d._0, "Present on Suture", d._9]],
        ["Right Parietal Foramen", [d._0, "Present on Right Parietal", d._9]],
        ["Apical Bone", dc._019],
        ["Inca Bone", dc._019],
        ["Left Lambdoid Ossicle", dc._019],
        ["Right Lambdoid Ossicle", dc._019],
        ["Left Asterionic Bone", dc._019],
        ["Right Asterionic Bone", dc._019],
        ["Left Ossicle in Occipitomastoid Suture", dc._019],
        ["Right Ossicle in Occipitomastoid Suture", dc._019],
        ["Left Parietal Notch Bone", dc._019],
        ["Right Parietal Notch Bone", dc._019],
        ["Left Auditory Exostosis", [d._0, "< 1/3 Canal Occluded, 1/3 - 2/3 Canal Occluded", "> 1/3 Canal Occluded", d._9]],
        ["Right Auditory Exostosis", [d._0, "< 1/3 Canal Occluded, 1/3 - 2/3 Canal Occluded", "> 1/3 Canal Occluded", d._9]],
        ["Left Mastoid Foramen Number", dc.fmn_num],
        ["Right Mastoid Foramen Number", dc.fmn_num],
        ["Left Mastoid Foramen Location", [d._0, "Temporal", "Sutural", "Occipital", "Temporal and Occipital", "Temporal and Sutural", d._9]],
        ["Right Mastoid Foramen Location", [d._0, "Temporal", "Sutural", "Occipital", "Temporal and Occipital", "Temporal and Sutural", d._9]]
    ],
    basilar: [
        ["Left Condylar Canal", dc._0129],
        ["Right Condylar Canal", dc._0129],
        ["Left Divided Hypoglossal Canal", [d._0, "Partial, Internal Surface", "Partial, Within Canal", "Complete, Internal Surface", "Complete, Within Canal", "Complete, Internal Surface and With Canal", "Partial, Internal Surface and With Canal", d._9]],
        ["Right Divided Hypoglossal Canal", [d._0, "Partial, Internal Surface", "Partial, Within Canal", "Complete, Internal Surface", "Complete, Within Canal", "Complete, Internal Surface and With Canal", "Partial, Internal Surface and With Canal", d._9]],
        ["Left Tympanic Dehiscence", [d._0, "Foramen Only", "Full Defect Present", d._9]],
        ["Right Tympanic Dehiscence", [d._0, "Foramen Only", "Full Defect Present", d._9]],
        ["Left Foramen Spinosum Incomplete", dc.fmn_inc],
        ["Right Foramen Spinosum Incomplete", dc.fmn_inc],
        ["Left Foramen Ovale Incomplete", dc.fmn_inc],
        ["Right Foramen Ovale Incomplete", dc.fmn_inc],
        ["Left Pterygospinous Bridge", dc.bridge],
        ["Right Pterygospinous Bridge", dc.bridge],
        ["Left Pterygoalar Bridge", dc.bridge],
        ["Right Pterygoalar Bridge", dc.bridge],
        ["Palatine Torus development", dc.torus],
        ["Palatine Torus location", [d._0, "Anterior", "Posterior", "Both", d._9]],
    ],
    mandibular: [
        ["Left Mylohyoid Bridge development", dc._0129],
        ["Right Mylohyoid Bridge development", dc._0129],
        ["Left Mylohyoid Bridge location", dc._0129],
        ["Right Mylohyoid Bridge location", dc._0129],
        ["Left Mental Foramen", dc.fmn_num],
        ["Right Mental Foramen", dc.fmn_num],
        ["Left Mandibular Torus", dc.torus],
        ["Right Mandibular Torus", dc.torus]
    ]
}