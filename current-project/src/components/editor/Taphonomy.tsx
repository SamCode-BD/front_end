import TCheckbox from "@/components/ui/TCheckbox";
import React, {useState, useContext} from 'react';
import {taphonomy_options} from "./taphonomy-options-list";
import HorizontalRadioButton from "@/components/ui/HorizontalRadioButton";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function Taphonomy(props) {
    let [activeSubmenu, setActiveSubmenu] = useState("bone color");

    const getContents = () => {
        if(activeSubmenu == "bone color") {
            return <div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.bone_color.map((name, i) => <HorizontalRadioButton name={name} key={i}/>)}
                </div>
            </div>
        }
        if(activeSubmenu == "staining") {
            return <div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.staining.map((name, i) => <TCheckbox name={name} key={i} onChange={() => {}}/>)}
                </div>
            </div>
        }
        if(activeSubmenu == "surface damage") {
            return <div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.surface_damage.map((name, i) => <TCheckbox name={name} key={i} onChange={() => {}}/>)}
                </div>
            </div>
        }
        if(activeSubmenu == "adherent materials") {
            return (<div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.adherent_materials.map((name, i) => <TCheckbox name={name} key={i} onChange={() => {}}/>)}
                </div>
            </div>)
        }
        if(activeSubmenu == "modifications") {
            return (<div>
                <div className="flex flex-col justify-center gap-10">
                    <div className="p-2.5 flex flex-col justify-start items-start">
                        <h3 className="break-words leading-normal">Curation Modifications</h3>
                        {taphonomy_options.curation_modifications.map((name, i) => <TCheckbox name={name} key={i} onChange={() => {}}/>)}
                    </div>
                    
                    <div className="p-2.5 flex flex-col justify-start items-start">
                        <h3 className="break-words leading-normal" >Cultural Modifications</h3>
                        {taphonomy_options.cultural_modifications.map((name, i) => <TCheckbox name={name} key={i} onChange={() => {}}/>)}
                    </div>
                </div>
            </div>)
        }
        if(activeSubmenu == "comments") {
            return (<div>
                <div className="flex flex-col">
                    <h3>Comments:</h3>
                    <textarea className="p-1 h-40 border-1 border-gray-200 rounded-lg"/>
                    <Button className="w-34 ml-auto mt-4 bg-maroon hover:bg-maroon/90">Save Comments</Button>
                </div>
            </div>)
        }
    }

        return(
            <div className="w-full">
                <h3>{props.boneName}</h3>
                <div className = "w-1/2 justify-left">
                    <label htmlFor="bone-cond">Bone Condition: </label>
                    <div className="mt-1 flex gap-2 text-left">
                        <Input className="w-1/2" id="bone-cond"/>
                        <Button className="bg-maroon hover:bg-maroon/90">?</Button>
                    </div>
                    <div className="flex mt-4 gap-2">
                        <input type="checkbox"/>
                        <p className = "" >Surface Exposure </p>
                    </div>
                </div>
                <div>
                    <div className="flex flex-wrap w-full gap-2 justify-center">
                        <Button variant="outline" onClick={() => setActiveSubmenu("bone color")}>Bone Color</Button>
                        <Button variant="outline" onClick={() => setActiveSubmenu("staining")}>Staining</Button>
                        <Button variant="outline" onClick={() => setActiveSubmenu("surface damage")}>Surface Damage</Button>
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