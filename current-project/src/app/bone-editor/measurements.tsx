import { postcranialmetrics_list } from "@/app/metrics/postcranialmetrics"
import MeasurementsBox from "@/components/ui/measurements_box"
import { Vertebrae } from "./vertebrae"
import Skull from "./skull"
import React, {useState, useEffect} from 'react';
import { useEditBoneAPI } from "./EditBoneAPIContext"

function Measurements( {selectedBone} ){
    const {api, updateField} = useEditBoneAPI();
    console.log(api)

    let [boneName, setboneName] = useState("fallback");
    //const [measurements, setMeasurements] = useState({});
    //const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const normalized = normalizeBone(selectedBone);
        if (postcranialmetrics_list.hasOwnProperty(normalized)) {
            setboneName(normalized);
        } else if (selectedBone === "Skull") {
            setboneName("skull");
        } else {
            console.warn(`Unknown bone type: ${selectedBone}`);
            setboneName("fallback");
        }
    }, [selectedBone]);

    const normalizeBone = (boneName) => {
        return boneName?.toLowerCase().replace(/\s+/g, '_');
    };

    // Handle measurement changes
    const handleMeasurementChange = (name, value) => {
        //console.log("value: " + value);
        updateField("measurements", {metric_name:  name, metric_value: value}, "metric_name");
        /*
        setMeasurements(prev => ({
            ...prev,
            [name]: value
        }));
        */
    };
    /*
    // Save measurements to database (only for appendicular bones)
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch('http://localhost:3001/api/bones/measurements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    boneName: selectedBone,
                    boneType: boneName,
                    measurements: measurements
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('Bone measurements saved successfully!');
                // Reset measurements
                setMeasurements({});
            } else {
                alert('Failed to save: ' + data.message);
            }
        } catch (error) {
            console.error('Error saving bone data:', error);
            alert('Error saving bone data. Check console for details.');
        } finally {
            setIsSaving(false);
        }
    };
    */

    const renderContent = () => {
        // Check if it's a vertebrae type
        if (boneName === "cervical_vertebrae") {
            return <div><Vertebrae selectedList={boneName}></Vertebrae></div>;
        } else if (boneName === "thoracic_vertebrae") {
            return <div><Vertebrae selectedList={boneName}></Vertebrae></div>;
        } else if (boneName === "lumbar_vertebrae") {
            return <div><Vertebrae selectedList={boneName}></Vertebrae></div>;
        } else if (boneName === "skull") {
            return <div><Skull></Skull></div>;
        }
        else {
            return postcranialmetrics_list[boneName].map((name, i) => (
                <MeasurementsBox 
                    name={name} 
                    key={i}
                    value= {api.measurements.find((m) => m.metric_name === name)?.metric_value ?? ''}
                    onChange={(e) => handleMeasurementChange(name, e.target.value)}
                />
            ));
        }
    };

    // Only show save button for appendicular bones
    //const showSaveButton = !["cervical_vertebrae", "thoracic_vertebrae", "lumbar_vertebrae", "skull"].includes(boneName);

    return(
        <div>
            {renderContent()}
            {/*
            <form onSubmit={handleSave}>
                <section>
                    {renderContent()}
                </section>
                
                {showSaveButton && (
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isSaving ? 'Saving...' : 'Save Measurements'}
                    </button>
                )}
                    
            </form>
            */}
        </div>
    )
} 

export default Measurements