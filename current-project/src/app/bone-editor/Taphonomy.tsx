import TCheckbox from "@/components/ui/TCheckbox";
import React, {useState, useEffect} from 'react';
import {taphonomy_options} from "./taphonomy-options-list";
import HorizontalRadioButton from "@/components/ui/HorizontalRadioButton";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBoneData } from "./context/BoneDataContext";

function Taphonomy(props) {
    let [activeSubmenu, setActiveSubmenu] = useState("bone color");
    const { measurements, setMeasurements } = useBoneData();

    // Initialize taphonomy structure in measurements if it doesn't exist
    useEffect(() => {
        if (!measurements.taphonomy) {
            setMeasurements({
                ...measurements,
                taphonomy: {
                    staining: [],
                    surface_damage: [],
                    adherent_materials: [],
                    curation_modifications: [],
                    cultural_modifications: []
                }
            });
        }
    }, []);

    // Get current taphonomy data, with fallback to empty structure
    const taphonomy = measurements.taphonomy || {
        staining: [],
        surface_damage: [],
        adherent_materials: [],
        curation_modifications: [],
        cultural_modifications: []
    };

    const handleCheckboxChange = (category: string, value: string, checked: boolean) => {
        console.log('handleCheckboxChange called:', { category, value, checked });
        console.log('Current taphonomy state:', taphonomy);
        
        const currentArray = taphonomy[category] || [];
        const newArray = checked 
            ? [...currentArray, value]
            : currentArray.filter((item: string) => item !== value);
        
        console.log('New array for', category, ':', newArray);
        
        const newMeasurements = {
            ...measurements,
            taphonomy: {
                ...taphonomy,
                [category]: newArray
            }
        };
        
        console.log('Setting new measurements:', newMeasurements);
        setMeasurements(newMeasurements);
    };

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
                {taphonomy_options.staining.map((name, i) => (
                    <TCheckbox 
                        key={`staining-${i}`}
                        name={name} 
                        checked={taphonomy.staining?.includes(name) || false}
                        onChange={(checked) => handleCheckboxChange('staining', name, checked)}
                    />
                ))}
                </div>
            </div>
        }
        if(activeSubmenu == "surface damage") {
            return <div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.surface_damage.map((name, i) => (
                    <TCheckbox 
                        key={`surface-damage-${i}`}
                        name={name} 
                        checked={taphonomy.surface_damage?.includes(name) || false}
                        onChange={(checked) => handleCheckboxChange('surface_damage', name, checked)}
                    />
                ))}
                </div>
            </div>
        }
        if(activeSubmenu == "adherent materials") {
            return (<div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.adherent_materials.map((name, i) => (
                    <TCheckbox 
                        key={`adherent-materials-${i}`}
                        name={name} 
                        checked={taphonomy.adherent_materials?.includes(name) || false}
                        onChange={(checked) => handleCheckboxChange('adherent_materials', name, checked)}
                    />
                ))}
                </div>
            </div>)
        }
        if(activeSubmenu == "modifications") {
            return (<div>
                <div className="flex flex-col md:flex-row justify-center gap-10">
                    <div className="p-2.5 flex flex-col justify-start items-start">
                        <h3 className="font-semibold mb-2">Curation Modifications</h3>
                        {taphonomy_options.curation_modifications.map((name, i) => (
                            <TCheckbox 
                                key={`curation-mods-${i}`}
                                name={name} 
                                checked={taphonomy.curation_modifications?.includes(name) || false}
                                onChange={(checked) => handleCheckboxChange('curation_modifications', name, checked)}
                            />
                        ))}
                    </div>
                    
                    <div className="p-2.5 flex flex-col justify-start items-start">
                        <h3 className="font-semibold mb-2">Cultural Modifications</h3>
                        {taphonomy_options.cultural_modifications.map((name, i) => (
                            <TCheckbox 
                                key={`cultural-mods-${i}`}
                                name={name} 
                                checked={taphonomy.cultural_modifications?.includes(name) || false}
                                onChange={(checked) => handleCheckboxChange('cultural_modifications', name, checked)}
                            />
                        ))}
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
            <div>
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
                
                {/* Debug view - remove this in production */}
                <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
                    <p className="font-semibold">Current Taphonomy State (Debug):</p>
                    <pre>{JSON.stringify(taphonomy, null, 2)}</pre>
                </div>
            </div>
        );
    
}
export default Taphonomy