/*
const enum RowTypeEnum {
    VTB_2Chk = 0,
    VTB_2Sel = 1,
    LR = 2,
    LRSel = 3,
    Single = 4,
    LBodyR = 5,
    SingleNum = 6,
    TenBoxes = 7,
    Patella = 8,
    LRQ = 9,
    LRN = 10,
    LRQN = 11
}
    */
export const enum BoxTypeEnum {
    CHECKBOX,
    SELECT,
    NUMINPUT
}
export type RowType = {
    numBoxRows : number,
    numColumns : number,
    columnText : string[],
    boxType : BoxTypeEnum,
}
export type InputRange = {
    min : number,
    max : number
}
export type PostcranialCategory = {
    name : string,
    rows : PostcranialRow[]
}
export type PostcranialRow = {
    boneName : string,
    rowType : RowType,
    inputRange? : InputRange
    isHeader ?: boolean
    noNameCell ?: boolean
}

const row_types: Record<string, RowType> = {
    "VTB_2Chk": {numBoxRows: 1, numColumns: 2, columnText: [], boxType: BoxTypeEnum.CHECKBOX},
    "VTB_2Sel": {numBoxRows: 1, numColumns: 2, columnText: [], boxType: BoxTypeEnum.SELECT},
    "SingleNum": {numBoxRows: 1, numColumns: 1, columnText: ["#"], boxType: BoxTypeEnum.NUMINPUT},
    "LR": {numBoxRows: 1, numColumns: 2, columnText: ["L", "R"], boxType: BoxTypeEnum.CHECKBOX},
    "LRSel": {numBoxRows: 1, numColumns: 2, columnText: ["L", "R"], boxType: BoxTypeEnum.SELECT},
    "Single": {numBoxRows: 1, numColumns: 1, columnText: [], boxType: BoxTypeEnum.CHECKBOX},
    "LBodyR" : {numBoxRows: 1, numColumns: 3, columnText: ["L", "Body", "R"], boxType: BoxTypeEnum.CHECKBOX},
    "TenBoxes" : {numBoxRows: 2, numColumns: 5, columnText: ["Prox Epi", "Prox 1/3", "Mid 1/3", "Dist 1/3", "Dist Epi"], boxType: BoxTypeEnum.CHECKBOX},
    "Patella" : {numBoxRows: 2, numColumns: 1, columnText: ["Prox Epi"], boxType: BoxTypeEnum.CHECKBOX},
    "LRQ" : {numBoxRows: 1, numColumns: 3, columnText: ["L", "R", "?"], boxType: BoxTypeEnum.CHECKBOX},
    "LRN" : {numBoxRows: 1, numColumns: 3, columnText: ["L", "R", "#"], boxType: BoxTypeEnum.NUMINPUT},
    "LRQN" : {numBoxRows: 1, numColumns: 4, columnText: ["L", "R", "?", "#"], boxType: BoxTypeEnum.NUMINPUT}
}

const make_row = (boneName_ : string, type_ : string, inputRange_ ?: InputRange) : PostcranialRow => {
    const noNameCell_ = (boneName_ == "") 
    
    if(inputRange_){
        return {boneName : boneName_, rowType : row_types[type_], inputRange: inputRange_, noNameCell : noNameCell_}
    }
    else {
        return {boneName : boneName_, rowType : row_types[type_], noNameCell : noNameCell_}
    }
}

const make_header = (boneName_ : string) : PostcranialRow => {
    return {boneName: boneName_, rowType : row_types["Header"], isHeader: true}
}

const vertebrae_rows: PostcranialRow[] = [
    make_row("C1", "VTB_2Chk"),
    make_row("C2", "VTB_2Chk"),
    make_row("C3-C6", "VTB_2Sel", { min: 0, max: 4 }),
    make_row("T1-T9", "VTB_2Sel", { min: 0, max: 4 }),
    make_row("C7", "VTB_2Chk"),
    make_row("T10", "VTB_2Chk"),
    make_row("T11", "VTB_2Chk"),
    make_row("T12", "VTB_2Chk"),
    make_row("L1", "VTB_2Chk"),
    make_row("L2", "VTB_2Chk"),
    make_row("L3", "VTB_2Chk"),
    make_row("L4", "VTB_2Chk"),
    make_row("L5", "VTB_2Chk"),
    make_header("Unidentifiable Vertebrae"),
    make_row("Thoracic - Unidentifiable", "SingleNum", { min: 0, max: 12 }),
    make_row("Lumbar - Unidentifiable", "SingleNum", { min: 0, max: 12 })
];
const ribs_rows: PostcranialRow[] = [
    make_row("R1", "LR"),
    make_row("R2", "LR"),
    make_row("R3-R10", "LRSel", {min: 0, max: 8}),
    make_row("R11", "LR"),
    make_row("R12", "LR"),
]
const axgeneral_rows: PostcranialRow[] = [
    make_row("Sacrum", "Single"),
    make_row("Coccyx", "Single"),
    make_row("Illium", "LR"),
    make_row("Ischium", "LR"),
    make_row("Pubis", "LR"),
    make_row("Acetabulum", "LR"),
    make_row("Auricular Surf", "LR"),
]
const hyoid_rows: PostcranialRow[] = [
    make_row("Hyoid", "LBodyR")
]
const appgeneral_rows: PostcranialRow[] = [
    make_header("Humerus"),
    make_row("", "TenBoxes"),
    make_header("Radius"),
    make_row("", "TenBoxes"),
    make_header("Ulna"),
    make_row("", "TenBoxes"),
    make_header("Femur"),
    make_row("", "TenBoxes"),
    make_header("Patella"),
    make_row("", "Patella"),
    make_header("Tibia"),
    make_row("", "TenBoxes"),
    make_header("Fibula"),
    make_row("", "TenBoxes"),
]
const shoulder_rows: PostcranialRow[] = [
    make_row("Clavicle", "LR"),
    make_row("Scapula", "LR")
]
const sternum_rows: PostcranialRow[] = [
    make_row("Manubrium", "Single"),
    make_row("Body", "Single"),
    make_row("Xiphoid", "Single")
]

const carpal_names = [
  "Scaphoid", "Lunate", "Triquetral", "Pisiform", 
  "Greater Multa", "Lesser Multa", "Capitate", "Hamate"
];
const carpal_rows: PostcranialRow[] = carpal_names.map(name => make_row(name, "LRQ"))
  .concat(make_row("Unidentifiable", "SingleNum"));


const metacarpal_names = ["1", "2", "3", "4", "5", "Unidentifiable"];
const metacarpal_rows: PostcranialRow[] = metacarpal_names.map(name => make_row(name, "LRN", {min: 0, max: 10}))
    .concat(make_row("Unidentifiable", "SingleNum"));


const tarsal_names = ["Calcaneus", "Talus", "Cuboid", "1st Cuneiform", "2nd Cuneiform", "3rd Cuneiform", "Navicular"];
const tarsal_rows: PostcranialRow[] = tarsal_names.map(name => make_row(name, "LRQ"))
    .concat(make_row("Unidentifiable", "SingleNum"));

const metatarsal_names = ["1", "2", "3", "4", "5", "Unidentifiable"];
const metatarsal_rows: PostcranialRow[] = metatarsal_names.map(name => make_row(name, "LRN", {min: 0, max: 10}))
    .concat(make_row("Unidentifiable", "SingleNum"));

const phalanges_rows: PostcranialRow[] = [
    make_header("Hand Phalanges"),
    make_row("Prox", "LRQN"),
    make_row("Middle", "LRQN"),
    make_row("Distal", "LRQN"),
    make_header("Foot Phalanges"),
    make_row("Prox", "LRQN"),
    make_row("Middle", "LRQN"),
    make_row("Distal", "LRQN"),
]


export const postcranial_inventory_list: Record<string, PostcranialCategory[]> =  {
    "Axial": [{name: "Vertebrae", rows: vertebrae_rows},
                {name: "Ribs", rows: ribs_rows},
                {name: "General", rows: axgeneral_rows},
                {name: "Hyoid", rows: hyoid_rows}
    ],
    "Appendicular": [{name: "General", rows: appgeneral_rows},
                    {name: "Shoulder", rows: shoulder_rows},
                    {name: "Sternum", rows: sternum_rows}
    ],
    "Hands and Feet": [{name: "Carpals", rows: carpal_rows},
                        {name: "Metacarpals", rows: metacarpal_rows},
                        {name: "Tarsals", rows: tarsal_rows},
                        {name: "Metatarsals", rows: metatarsal_rows},
                        {name: "Phalanges", rows: phalanges_rows}
    ]
    
}
