import { postcranialmetrics_list } from "@/app/metrics/postcranialmetrics"
import MeasurementsBox from "@/components/ui/measurements_box"
import { Vertebrae } from "./vertebrae"
import Skull from "./skull"
import React, { useState, useEffect } from 'react';
import { useBoneData } from "./context/BoneDataContext"

function Measurements() {
    const { selectedBone, measurements, setMeasurements } = useBoneData();
    const [boneID, setBoneID] = useState("fallback");

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
    }, [selectedBone]);

    const normalizeBone = (boneName: string | null) => {
        return boneName?.toLowerCase().replace(/\s+/g, '_') || '';
    };

    // Handle measurement changes
    const handleMeasurementChange = (name: string, value: string) => {
        setMeasurements(prev => ({
            ...prev,
            [name]: value
        }));
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
            return postcranialmetrics_list[boneID]?.map((name, i) => (
                <MeasurementsBox 
                    name={name} 
                    key={i}
                    value={measurements[name] || ''}
                    onChange={(e) => handleMeasurementChange(name, e.target.value)}
                />
            ));
        }
    };

    return(
        <div>
            <section>
                {renderContent()}
            </section>
        </div>
    )
} 

export default Measurements