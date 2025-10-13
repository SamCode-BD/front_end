import TCheckbox from "@/components/ui/TCheckbox";
import React, {useState} from 'react';
import {taphonomy_options} from "./taphonomy-options-list";
import HorizontalRadioButton from "@/components/ui/HorizontalRadioButton";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {useEditBoneAPI} from "./EditBoneAPIContext"

function Taphonomy() {
    let [activeSubmenu, setActiveSubmenu] = useState("bone color");
    const {api, updateField} = useEditBoneAPI();
    const [comment, setComment] = useState(api.taphonomy.comments ?? "");


    const getContents = () => {
        if(activeSubmenu == "bone color") {
            return <div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.bone_color.map((name, i) => <HorizontalRadioButton name={name} key={i}
                                                                onChange={() => updateField("taphonomy", "bone_color", name)}/>)}
                </div>
            </div>
        }
        if(activeSubmenu == "staining") { //The updateField function will insert/remove an item from the staining array
                                          //When the box is checked/unchecked
            return <div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.staining.map((name, i) => <TCheckbox name={name} key={i}
                                                            checked={api.taphonomy.staining.includes(name)}
                                                            onChange={() => updateField("taphonomy", "staining", name)}/>)}
                </div>
            </div>
        }
        if(activeSubmenu == "surface damage") {
            return <div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.surface_damage.map((name, i) => <TCheckbox name={name} key={i}
                                                            checked={api.taphonomy.surface_damage.includes(name)}
                                                            onChange={() => updateField("taphonomy", "surface_damage", name)}/>)}
                </div>
            </div>
        }
        if(activeSubmenu == "adherent materials") {
            return (<div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.adherent_materials.map((name, i) => <TCheckbox name={name} key={i}
                                                            checked={api.taphonomy.adherent_materials.includes(name)}
                                                            onChange={() => updateField("taphonomy", "adherent_materials", name)}/>)}
                </div>
            </div>)
        }
        if(activeSubmenu == "modifications") {
            return (<div>
                <div className="flex flex-col md:flex-row justify-center gap-10">
                    <div className="p-2.5 flex flex-col justify-start items-start">
                        <h3>Curation Modifications</h3>
                        {taphonomy_options.curation_modifications.map((name, i) => <TCheckbox name={name} key={i}
                                                        checked={api.taphonomy.modifications.includes(name)}
                                                        onChange={() => updateField("taphonomy", "modifications", name)}/>)}
                    </div>
                    
                    <div className="p-2.5 flex flex-col justify-start items-start">
                        <h3>Cultural Modifications</h3>
                        {taphonomy_options.cultural_modifications.map((name, i) => <TCheckbox name={name} key={i}
                                                        checked={api.taphonomy.modifications.includes(name)}
                                                        onChange={() => updateField("taphonomy", "modifications", name)}/>)}
                    </div>
                </div>
            </div>)
        }
        if(activeSubmenu == "comments") {
            return (<div>
                <div className="flex flex-col">
                    <h3>Comments:</h3>
                    <textarea className="p-1 h-40 border-1 border-gray-200 rounded-lg resize-none"
                    onChange={(e) => setComment(e.target.value)}/>
                    <Button className="w-34 ml-auto mt-4 bg-maroon hover:bg-maroon/90" onClick={() => updateField("taphonomy", "comments", comment)}>
                    Save Comments</Button>
                </div>
            </div>)
        }
    }

        return(
            <div>
                <div className = "w-1/2 justify-left">
                    <label htmlFor="bone-cond">Bone Condition: </label>
                    <div className="mt-1 flex gap-2 text-left">
                        <Input className="w-1/2" id="bone-cond" onChange={(e) => updateField("taphonomy", "bone_condition", Number(e.target.value))}/>
                        <Button className="bg-maroon hover:bg-maroon/90">?</Button>
                    </div>
                    <div className="flex mt-4 gap-2">
                        <input type="checkbox" checked={api.taphonomy.surface_exposure} onChange={() => updateField("taphonomy", "surface_exposure", 
                                                                                                                !api.taphonomy.surface_exposure)}/>
                        <p className = "" >Surface Exposure </p>
                    </div>
                </div>
                <div className = "flex flex-col md:w-full md:flex-row mt-4 justify-center items-center [padding-inline:10px] gap-2">
                    <div className = "flex w-full gap-2">
                        <Button variant="outline" onClick={() => setActiveSubmenu("bone color")}>Bone Color</Button>
                        <Button variant="outline" onClick={() => setActiveSubmenu("staining")}>Staining</Button>
                        <Button variant="outline" onClick={() => setActiveSubmenu("surface damage")}>Surface Damage</Button>
                    </div>
                    <div className="flex w-full gap-2">
                        <Button variant="outline" onClick={() => setActiveSubmenu("adherent materials")}>Adherent Materials</Button>
                        <Button variant="outline" onClick={() => setActiveSubmenu("modifications")}>Modifications</Button>
                        <Button variant="outline" onClick={() => setActiveSubmenu("comments")}>Comments</Button>
                    </div>
                </div>
                {getContents()}
            </div>
        );
    
}
export default Taphonomy