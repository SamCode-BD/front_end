export const enum BoxTypeEnum {
  CHECKBOX,
  SELECT,
  NUMINPUT
}

export type RowType = {
  numBoxRows: number
  numColumns: number
  columnText: string[]
  boxType: BoxTypeEnum
}

export type InputRange = {
  min: number
  max: number
}

export type PostcranialCategory = {
  name: string
  rows: PostcranialRow[]
}

export type PostcranialRow = {
  parentInfo?: string
  boneName: string
  rowType: RowType
  inputRange?: InputRange
  isHeader?: boolean
  noNameCell?: boolean
}

// --- Base Row Type Definitions ---
const row_types: Record<string, RowType> = {
  "VTB_2Chk": { numBoxRows: 1, numColumns: 2, columnText: [], boxType: BoxTypeEnum.CHECKBOX },
  "VTB_2Sel": { numBoxRows: 1, numColumns: 2, columnText: [], boxType: BoxTypeEnum.SELECT },
  "SingleNum": { numBoxRows: 1, numColumns: 1, columnText: ["#"], boxType: BoxTypeEnum.NUMINPUT },
  "LR": { numBoxRows: 1, numColumns: 2, columnText: ["L", "R"], boxType: BoxTypeEnum.CHECKBOX },
  "LRSel": { numBoxRows: 1, numColumns: 2, columnText: ["L", "R"], boxType: BoxTypeEnum.SELECT },
  "Single": { numBoxRows: 1, numColumns: 1, columnText: [], boxType: BoxTypeEnum.CHECKBOX },
  "LBodyR": { numBoxRows: 1, numColumns: 3, columnText: ["L", "Body", "R"], boxType: BoxTypeEnum.CHECKBOX },
  "TenBoxes": {
    numBoxRows: 1,
    numColumns: 5,
    columnText: ["Prox Epi", "Prox 1/3", "Mid 1/3", "Dist 1/3", "Dist Epi"],
    boxType: BoxTypeEnum.CHECKBOX
  },
  "Patella": { numBoxRows: 2, numColumns: 1, columnText: ["Prox Epi"], boxType: BoxTypeEnum.CHECKBOX },
  "LRQ": { numBoxRows: 1, numColumns: 3, columnText: ["L", "R", "?"], boxType: BoxTypeEnum.CHECKBOX },
  "LRN": { numBoxRows: 1, numColumns: 3, columnText: ["L", "R", "#"], boxType: BoxTypeEnum.NUMINPUT },
  "LRQN": { numBoxRows: 1, numColumns: 4, columnText: ["L", "R", "?", "#"], boxType: BoxTypeEnum.NUMINPUT }
}

// --- Row creation helpers ---
const make_row = (
  boneName: string,
  type: string,
  inputRange?: InputRange,
  parentInfo?: string
): PostcranialRow => {
  const noNameCell = boneName === ""
  const row: PostcranialRow = {
    boneName,
    rowType: row_types[type],
    noNameCell
  }
  if (inputRange) row.inputRange = inputRange
  if (parentInfo) row.parentInfo = parentInfo
  return row
}

const make_header = (boneName: string): PostcranialRow => ({
  boneName,
  rowType: row_types["Single"],
  isHeader: true
})

/** Bulk-create rows that all share the same parentInfo. */
function makeRowsWithParentInfo(
  parentInfo: string,
  rowsData: (readonly [string, string, InputRange?])[]
): PostcranialRow[] {
  return rowsData.map(([boneName, type, inputRange]) =>
    make_row(boneName, type, inputRange, parentInfo)
  )
}

// --- Normal group rows ---
const vertebrae_rows: PostcranialRow[] = [
  ...makeRowsWithParentInfo("Vertebrae", [
    ["C1", "LR"],
    ["C2", "LR"],
    ["C3-C6", "LRSel", { min: 0, max: 4 }],
    ["T1-T9", "LRSel", { min: 0, max: 4 }],
    ["C7", "LR"],
    ["T10", "LR"],
    ["T11", "LR"],
    ["T12", "LR"],
    ["L1", "LR"],
    ["L2", "LR"],
    ["L3", "LR"],
    ["L4", "LR"],
    ["L5", "LR"]
  ]),
  make_header("Unidentifiable Vertebrae"),
  ...makeRowsWithParentInfo("Unidentifiable Vertebrae", [
    ["Thoracic - Unidentifiable", "SingleNum", { min: 0, max: 12 }],
    ["Lumbar - Unidentifiable", "SingleNum", { min: 0, max: 12 }]
  ])
]

const ribs_rows: PostcranialRow[] = makeRowsWithParentInfo("Ribs", [
  ["R1", "LR"],
  ["R2", "LR"],
  ["R3-R10", "LRSel", { min: 0, max: 8 }],
  ["R11", "LR"],
  ["R12", "LR"]
])

const axgeneral_rows: PostcranialRow[] = [
  make_row("Sacrum", "Single"),
  make_row("Coccyx", "Single"),
  make_row("Illium", "LR"),
  make_row("Ischium", "LR"),
  make_row("Pubis", "LR"),
  make_row("Acetabulum", "LR"),
  make_row("Auricular Surf", "LR")
]

const hyoid_rows: PostcranialRow[] = [make_row("Hyoid", "LBodyR")]

// --- Special: AppGeneral rows ---
function make_appgeneral_rows(bone: string): PostcranialRow[] {
  const columns = ["Prox Epi", "Prox 1/3", "Mid 1/3", "Dist 1/3", "Dist Epi"]
  return [
    {
      parentInfo: bone,
      boneName: "L",
      rowType: { numBoxRows: 1, numColumns: 5, columnText: columns, boxType: BoxTypeEnum.CHECKBOX },
      isHeader: false
    },
    {
      parentInfo: bone,
      boneName: "R",
      rowType: { numBoxRows: 1, numColumns: 5, columnText: columns, boxType: BoxTypeEnum.CHECKBOX },
      isHeader: false
    }
  ]
}

const appgeneral_rows: PostcranialRow[] = [
  make_header("Humerus"),
  ...make_appgeneral_rows("Humerus"),
  make_header("Radius"),
  ...make_appgeneral_rows("Radius"),
  make_header("Ulna"),
  ...make_appgeneral_rows("Ulna"),
  make_header("Femur"),
  ...make_appgeneral_rows("Femur"),
  make_header("Patella"),
  ...make_appgeneral_rows("Patella"),
  make_header("Tibia"),
  ...make_appgeneral_rows("Tibia"),
  make_header("Fibula"),
  ...make_appgeneral_rows("Fibula")
]

const shoulder_rows: PostcranialRow[] = makeRowsWithParentInfo("", [
  ["Clavicle", "LR"],
  ["Scapula", "LR"]
])

const sternum_rows: PostcranialRow[] = makeRowsWithParentInfo("Sternum", [
  ["Manubrium", "Single"],
  ["Body", "Single"],
  ["Xiphoid", "Single"]
])

const carpal_names = [
  "Scaphoid",
  "Lunate",
  "Triquetral",
  "Pisiform",
  "Greater Multa",
  "Lesser Multa",
  "Capitate",
  "Hamate"
]
const carpal_rows: PostcranialRow[] = makeRowsWithParentInfo(
  "",
  carpal_names.map((name) => [name, "LRQ"] as const)
).concat(make_row("Unidentifiable", "SingleNum", undefined, "Carpals"))

const metacarpal_names = ["1", "2", "3", "4", "5", "Unidentifiable"]
const metacarpal_rows: PostcranialRow[] = makeRowsWithParentInfo(
  "Metacarpals",
  metacarpal_names.map((name) => [name, "LRN", { min: 0, max: 10 }] as const)
).concat(make_row("Unidentifiable", "SingleNum", undefined, "Metacarpals"))

const tarsal_names = ["Calcaneus", "Talus", "Cuboid", "1st Cuneiform", "2nd Cuneiform", "3rd Cuneiform", "Navicular"]
const tarsal_rows: PostcranialRow[] = makeRowsWithParentInfo(
  "",
  tarsal_names.map((name) => [name, "LRQ"] as const)
).concat(make_row("Unidentifiable", "SingleNum", undefined, "Tarsals"))

const metatarsal_names = ["1", "2", "3", "4", "5", "Unidentifiable"]
const metatarsal_rows: PostcranialRow[] = makeRowsWithParentInfo(
  "Metatarsals",
  metatarsal_names.map((name) => [name, "LRN", { min: 0, max: 10 }] as const)
).concat(make_row("Unidentifiable", "SingleNum", undefined, "Metatarsals"))

const phalanges_rows: PostcranialRow[] = [
  make_header("Hand Phalanges"),
  ...makeRowsWithParentInfo("Hand Phalanges", [
    ["Prox", "LRQN"],
    ["Middle", "LRQN"],
    ["Distal", "LRQN"]
  ]),
  make_header("Foot Phalanges"),
  ...makeRowsWithParentInfo("Foot Phalanges", [
    ["Prox", "LRQN"],
    ["Middle", "LRQN"],
    ["Distal", "LRQN"]
  ])
]

// --- Final Export ---
export const postcranial_inventory_list: Record<string, PostcranialCategory[]> = {
  Axial: [
    { name: "Vertebrae", rows: vertebrae_rows },
    { name: "Ribs", rows: ribs_rows },
    { name: "General", rows: axgeneral_rows },
    { name: "Hyoid", rows: hyoid_rows }
  ],
  Appendicular: [
    { name: "General", rows: appgeneral_rows },
    { name: "Shoulder", rows: shoulder_rows },
    { name: "Sternum", rows: sternum_rows }
  ],
  "Hands and Feet": [
    { name: "Carpals", rows: carpal_rows },
    { name: "Metacarpals", rows: metacarpal_rows },
    { name: "Tarsals", rows: tarsal_rows },
    { name: "Metatarsals", rows: metatarsal_rows },
    { name: "Phalanges", rows: phalanges_rows }
  ]
}


export const excludeCategoriesFromTaphonomy = (row: PostcranialRow) => {
    let rowName = row.parentInfo? row.parentInfo + " " + row.boneName : row.boneName;
    let exclude =
    [
    "Unidentifiable",
    "Metacarpals",
    "Metatarsals",
    "Phalanges"
    ];
    return exclude.some(term => rowName.includes(term));
};

export const trimTagsFromBoneName = (boneName: string): string => {
  const tags = ["Prox Epi", "Prox 1/3", "Mid 1/3", "Dist 1/3", "Dist Epi", "#"];
  
  let trimmed = boneName;
  for (const tag of tags) {
    // Remove each tag wherever it appears, ignoring case and extra spaces
    const regex = new RegExp(tag, "gi");
    trimmed = trimmed.replace(regex, "");
  }

  // Clean up leftover double spaces and trim edges
  return trimmed.trim().replace(/\s{2,}/g, " ");
};

export const filterTaphonomyDropdownTags = (tags: string[]): string[] => {
  const exclude_tags = ["Prox Epi", "Prox 1/3", "Mid 1/3", "Dist 1/3", "Dist Epi", "#"];

  // Return only tags not in exclude_tags (case-insensitive)
  return tags.filter(
    (tag) => !exclude_tags.some((excluded) => excluded.toLowerCase() === tag.toLowerCase())
  );
};


export const doesNotRequireBoneSideDropdown = (row: PostcranialRow) => { 
  let rowName = row.parentInfo? row.parentInfo + " " + row.boneName : row.boneName;
  let exclude = [
    "Sacrum",
    "Coccyx",
    "Humerus",
    "Radius",
    "Ulna",
    "Femur",
    "Patella",
    "Tibia",
    "Fibula",
    "Sternum Manubrium",
    "Sternum Body",
    "Sternum Xiphoid"
  ];
  return exclude.some(term => rowName.includes(term));
}