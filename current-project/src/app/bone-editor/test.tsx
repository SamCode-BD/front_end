import { postcranialmetrics_list } from "@/app/metrics/postcranialmetrics"
import MeasurementsBox from "@/components/ui/measurements_box"
import { Vertebrae } from "./vertebrae"
import Skull from "./skull"
import React, {useState, useEffect} from 'react';

function Measurements( {selectedBone} ){

    let [boneID, setBoneID] = useState("fallback");
    const [measurements, setMeasurements] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const normalized = normalizeBone(selectedBone);
        if (postcranialmetrics_list.hasOwnProperty(normalized)) {
            setBoneID(normalized);
        } else if (selectedBone === "Skull") {
            setBoneID("skull");
        } else {
            console.warn(`Unknown bone type: ${selectedBone}`);
            setBoneID("fallback");
        }
        // Reset measurements when bone changes
        setMeasurements({});
    }, [selectedBone]);

    const normalizeBone = (boneName) => {
        return boneName?.toLowerCase().replace(/\s+/g, '_');
    };

    // Handle measurement changes
    const handleMeasurementChange = (name, value) => {
        setMeasurements(prev => ({
            ...prev,
            [name]: value
        }));
    };

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
                    boneType: boneID,
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

    const renderContent = () => {
        // Check if it's a vertebrae type
        if (boneID === "cervical_vertebrae") {
            return <div><Vertebrae selectedList={boneID}></Vertebrae></div>;
        } else if (boneID === "thoracic_vertebrae") {
            return <div><Vertebrae selectedList={boneID}></Vertebrae></div>;
        } else if (boneID === "lumbar_vertebrae") {
            return <div><Vertebrae selectedList={boneID}></Vertebrae></div>;
        } else if (boneID === "skull") {
            return <div><Skull></Skull></div>;
        }
        // Otherwise render appendicular bones
        else {
            return postcranialmetrics_list[boneID].map((name, i) => (
                <MeasurementsBox 
                    name={name} 
                    key={i}
                    value={measurements[name] || ''}
                    onChange={(value) => handleMeasurementChange(name, value)}
                />
            ));
        }
    };

    // Only show save button for appendicular bones
    const showSaveButton = !["cervical_vertebrae", "thoracic_vertebrae", "lumbar_vertebrae", "skull"].includes(boneID);

    return(
        <div>
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
        </div>
    )
} 

export default Measurements