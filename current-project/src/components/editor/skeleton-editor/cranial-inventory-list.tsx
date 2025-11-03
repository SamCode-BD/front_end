export type CranialInventoryRow = {
    boneName : string,
    numBoxes : number
}
export type CranialInventoryList = {
    contents: CranialInventoryRow[]
}
export const cranial_inventory_list = {
    contents: [
        { boneName: "Frontal", numBoxes: 2 },
        { boneName: "Temporal", numBoxes: 2 },
        { boneName: "TMJ", numBoxes: 2 },
        { boneName: "Parietal", numBoxes: 2 },
        { boneName: "Occipital", numBoxes: 1 },
        { boneName: "Sphenoid", numBoxes: 1 },
        { boneName: "Zygomatic", numBoxes: 2 },
        { boneName: "Maxilla", numBoxes: 2 },
        { boneName: "Mandible", numBoxes: 3 },
        //{ boneName: "Teeth", numBoxes: 0 }
    ]
}

export const excludeCategoriesFromTaphonomy = (row: CranialInventoryRow) => {
    let exclude =
    [
    "Teeth"
    ];
    return exclude.some(term => row.boneName.includes(term));
};