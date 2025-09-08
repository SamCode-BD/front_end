import { postcranialmetrics_list } from "../metrics/postcranialmetrics"
import MeasurementsBox from "../../components/ui/measurements_box"
import React, {useState, useContext, useEffect} from 'react';

function Measurements( {selectedBone} ){

    let [boneID, setBoneID] = useState("fallback");

    
    useEffect(() => {
        const normalized = normalizeBone(selectedBone);
        if (postcranialmetrics_list.hasOwnProperty(normalized)) {
            setBoneID(normalized);
        } else {
            console.warn(`Unknown bone type: ${selectedBone}`);
            setBoneID("fallback"); // fallback
        }
    }, [selectedBone]);

    const normalizeBone = (boneName) => {
        return boneName?.toLowerCase().replace(/\s+/g, '_');
    };

    return(
        <div>
        <form>
            <section>
                {postcranialmetrics_list[boneID].map((name, i) => (
                    <MeasurementsBox name={name} key={i} />
                ))}
            </section>
        </form>
    </div>
    )
} export default Measurements