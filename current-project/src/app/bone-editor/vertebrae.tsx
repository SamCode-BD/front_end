import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function Vertebrae( {selectedList} ){

    let [fullCV, setFullCV] = useState(false);
    
    const [disabledInputs, setDisabledInputs] = useState<Record<string, boolean>>({});
    const listName = selectedList;
    const handleCheckboxChange = (vertebra: string, checked: boolean) => {
        setDisabledInputs(prev => ({
            ...prev,
            [vertebra]: checked
        }));
    };

    const vertebraeMap: Record<string, { array: string[], range: string }> = {
        cervical_vertebrae: { 
            array: ["C3", "C4", "C5", "C6", "C7"], 
            range: "C3-C7" 
        },
        thoracic_vertebrae: { 
            array: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"], 
            range: "T1-T12" 
        },
        lumbar_vertebrae: { 
            array: ["L1", "L2", "L3", "L4", "L5"], 
            range: "L1-L5" 
        },
    };

    // Then access like:
    const vertebraeRange = vertebraeMap[selectedList]?.range || "";
    const vertebraeList = vertebraeMap[selectedList]?.array || [];

    const enableDisableBox = (vertebra: string) => {
            return (
                <div> 
                    <label htmlFor={`input-${vertebra}`}> {vertebra} </label>
                    <div className="flex w-full items-center gap-2">
                        <Input className="w-1/2" 
                        id={`input-${vertebra}`} 
                        disabled={disabledInputs[vertebra] || false }/>

                        <Checkbox id={`absent-${vertebra}`}
                        onCheckedChange={(checked) => handleCheckboxChange(vertebra, checked as boolean)}/>
                        <Label htmlFor={`absent-${vertebra}`}>Missing {vertebra} Measurement</Label>
                    </div>
                </div>
            ) 
    }
    const getContents = () => {
        if(!fullCV) {
            return (
                <div>
                    {vertebraeList.map((vertebra, index) => (
                    <div key={index}>
                        {enableDisableBox(vertebra)}
                    </div>
        ))}
    </div>
            ) 
        } else if (fullCV) {
            return (
                <div> 

                        <label htmlFor="input1"> {vertebraeRange} Measurement </label>
                        <div className="flex w-full items-center gap-2">
                            <Input className="w-1/2" id="input1" />
                        </div>

                </div>
       ) }
    }
    

    return ( 
        <div>

            {selectedList === "cervical_vertebrae" && (
                <div> 
                    <label htmlFor="input0"> C2 </label>
                    <Input className="w-1/2 mt-2 mb-2" id="input0"></Input>
                </div>
            )}
           
           <div className="flex w-full items-center gap-2 mb-2">
                <Checkbox 
                id="full-cv"
                checked={fullCV}
                onCheckedChange={val => setFullCV(val === true)} // This will set fullCV to true or false
                />
                <Label htmlFor="full-cv">Full Vertebrae {vertebraeRange} Not Present</Label>
            </div>

            {getContents()}

        </div>
    )
}