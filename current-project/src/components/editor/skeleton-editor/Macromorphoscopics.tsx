"use client"
import {mms_list} from "@/components/editor/skeleton-editor/mms-list"
import { RadioGroup, TextArea } from "@radix-ui/themes"
import {useState} from 'react'
import { useEditSkeletonAPI } from "@/app/skeleton-editor/EditSkeletonAPIContext"

const getImage = (trait, code) => {
    console.log("trait: " + trait + " code: " + code);
    //console.log(mms_list.dict[trait][2][code].src);
        if(trait != null && code != null) {
            console.log(mms_list.dict[trait][2] != null && mms_list.dict[trait][2][code].src);
            return mms_list.dict[trait][2] != null && mms_list.dict[trait][2][code].src;
        }
    }

export default function Macromorphoscopics() {

    const {api, updateField} = useEditSkeletonAPI();

    let [trait, selectTrait] = useState("Anterior Nasal Spine");
    let [code, selectCode] = useState(0);

     const getRadioButtons = (trait) => {
        const codes = mms_list.dict[trait][1]
        if(codes != null) {
            return(<RadioGroup.Root name="codeSelect"
                                    onValueChange={(number) => {
                                        selectCode(Number(number)); 
                                        updateField("cranial_nonmetrics", {
                                            category: "macromorphoscopics",
                                            value_str: codes[number],
                                            nonmetric_name: trait
                                        }, "nonmetric_name")}}
                                    >
                    {codes.map((number, i) => 
                <RadioGroup.Item key={i} value={i}
                checked={api.cranial_nonmetrics.find((cn) =>
                        (cn.category === "macromorphoscopics" && cn.nonmetric_name === trait && cn.value_str === number)) != null}>
                    {number}
                </RadioGroup.Item>)}
            </RadioGroup.Root>)
                
        }
        else {
            return(<></>)
        }
    }

    
    return(<div className = "grid w-full grid-cols-2">
    <div className = "text-left flex flex-col">
        <div className="w-full h-full">
        <RadioGroup.Root
            name="traitSelect"
            onValueChange={(traitName) => {
            const index = Object.keys(mms_list.dict).indexOf(traitName);
            selectTrait(traitName);
            selectCode(0);
            }}
        >
            {Object.keys(mms_list.dict).map((traitName) => (
            <RadioGroup.Item key={traitName} value={traitName}>
                {traitName}
            </RadioGroup.Item>
            ))}
        </RadioGroup.Root>
        </div>
        <div>
            <TextArea readOnly className = "w-[250px] h-[250px]" value={mms_list.trait_desc[mms_list.dict[trait][0]]}/>
        </div>

    </div>
    <div className = "text-left flex flex-col items-center">
        <img className = "mt-[10px] min-w-[300px] max-w-[600px] min-h-[300px] max-h-[400px]" src={getImage(trait, code)}/>
        <div className="flex flex-row">
            <div className = "mt-[50px] mr-[50px] h-[50px] items-center justify-center">
                {getRadioButtons(trait)}
            </div>
            <div className = "mt-[10px] w-[450px] h-[85px]">
                <TextArea readOnly className="w-[500px] h-[200px]" value={mms_list.code_desc[mms_list.dict[trait][0]][code]}/>
            </div>
        </div>
    </div>
    </div>)
}