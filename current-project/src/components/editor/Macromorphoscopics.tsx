"use client"
import {mms_list} from "@/components/editor/mms-list"
import { RadioGroup, TextArea } from "@radix-ui/themes"
import {useState} from 'react'

const getImage = (trait, code) => {
    //console.log(mms_list.dict[trait][2][code].src);
        if(trait != null && code != null) {
            //console.log(mms_list.dict[trait][2] != null && mms_list.dict[trait][2][code].src);
            return mms_list.dict[trait][2] != null && mms_list.dict[trait][2][code].src;
        }
    }

export default function Macromorphoscopics() {

    let [trait, selectTrait] = useState("Anterior Nasal Spine");
    let [code, selectCode] = useState(1);

    
    return(<div className = "grid w-full grid-cols-2">
    <div className = "text-left flex flex-col">
        <div className = "w-full h-full">
            <RadioGroup.Root name="traitSelect">
                {Object.keys(mms_list.dict).map((traitName, i) => 
                <RadioGroup.Item value={traitName} onChange={() => {selectTrait(traitName); selectCode(0)}}>{traitName}</RadioGroup.Item>)}
            </RadioGroup.Root>
            
        </div>
        <div>
            <TextArea readOnly className = "w-[250px] h-[250px]" value="aaa"/>
        </div>

    </div>
    <div className = "text-left flex flex-col items-center">
        <img className = "mt-[10px] min-w-[300px] max-w-[600px] min-h-[300px] max-h-[400px]" src={getImage(trait, code)}/>
        <div className = "mt-[10px] w-[350px] h-[50px] flex flex-row items-center justify-center">

        </div>
        <div className = "mt-[10px] w-[450px] h-[85px]">
        </div>
    </div>
    </div>)
}