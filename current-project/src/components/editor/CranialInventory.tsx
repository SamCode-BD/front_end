import { useState } from "react";
import { Table, TextField } from "@radix-ui/themes";
import * as Checkbox from "@radix-ui/react-checkbox";
import { cranial_inventory_list } from "./cranial-inventory-list";
import Taphonomy from "@/components/editor/Taphonomy"
import "./InventoryStyles.css"

export default function CranialInventory() {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [selectedBone, setSelectedBone] = useState("")

  function getCheckboxLabels(numBoxes: number): string[] {
    if (numBoxes === 1) return [];
    if (numBoxes === 2) return ["L", "R"];
    if (numBoxes === 3) return ["L", "Body", "R"];
    return [];
  }

  function createCheckboxes(numBoxes: number) {
    return Array.from({ length: numBoxes }).map((_, idx) => (
      <Checkbox.Root
        key={idx}
        className="w-6 h-6 mx-2 border border-gray-400 rounded flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Checkbox.Indicator>
          <svg
            className="w-4 h-4 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </Checkbox.Indicator>
      </Checkbox.Root>
    ));
  }

  return (
    <div className="bone-container">
      <div className="grid w-full grid-cols-2">
        <div className="flex flex-col">
          <h3>Cranial Inventory</h3>
          <Table.Root className="table-root">
            <Table.Header>
              <Table.ColumnHeaderCell className="table-header-cell bone">Bone</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="table-header-cell inventory">Inventory Options</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="table-header-cell edit">Edit Information</Table.ColumnHeaderCell>
            </Table.Header>
            <Table.Body>
              {cranial_inventory_list.contents.map((bone, i) => {
                const labels = getCheckboxLabels(bone.numBoxes);

                return (
                  <Table.Row
                    key={i}
                    onMouseEnter={() => setHoveredRowIndex(i)}
                    onMouseLeave={() => setHoveredRowIndex(null)}
                    className="align-top" // Ensure vertical alignment at top
                  >
                    <Table.RowHeaderCell className="table-row-header-cell bone">{bone.boneName}</Table.RowHeaderCell>
                    {bone.boneName != "Teeth" ?
                    <Table.Cell className="table-cell inventory">
                      <div className="flex flex-col items-center">
                        {/* Labels row */}
                        {labels.length > 0 && (
                          <div className="flex justify-center gap-8 mb-1 w-full ">
                            {labels.map((label, idx) => (
                              <span
                                key={idx}
                                className="text-sm font-medium text-gray-700"
                                style={{ width: "48px", textAlign: "center", whiteSpace: "nowrap" }}
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Checkboxes row */}
                        <div className="flex justify-center gap-6 w-full ">
                          {createCheckboxes(bone.numBoxes)}
                        </div>
                      </div>
                    </Table.Cell>
                    : //for teeth row only
                    <Table.Cell className="table-cell inventory">
                        <div className = "flex flex-col items-center gap-1">
                            <p>Enter number of teeth:</p>
                            <TextField.Root className="w-20" type="number" />
                        </div>
                        
                    </Table.Cell>
                    }
                    <Table.Cell className="table-cell edit flex justify-center items-center">
                      {hoveredRowIndex === i && (
                        <button className="w-10"
                                onClick={() => setSelectedBone(bone.boneName)}>Edit</button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </div>
        {selectedBone != "" && <Taphonomy boneName={selectedBone}/>}
      </div>
      
    </div>
  );
}
