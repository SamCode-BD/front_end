"use client"

import { useState } from "react"
import Left from "./Left"
import Right from "./Right"
import ResponsiveLayout from "@/components/editor/responsiveLayout"

function Left2() {
    return (
        <div>
            <Left/>
        </div>
    )
}

function Right2() {
    return (
        <div>
            <Right/>
        </div>
    )
}

export default function Home() {
    /*All shared state lives here
    const [formData, setFormData] = useState({
        id: '',
        museum: '',
        sex: '',
        user: ''
    });
    
    //const [measurements, setMeasurements] = useState({});
    //const [isSaving, setIsSaving] = useState(false);

    /* Save handler that collects data from both sides
    const handleSave = async () => {
        setIsSaving(true);
        
        try {
            // Get the selected bone from URL
            const searchParams = new URLSearchParams(window.location.search);
            const selectedBone = searchParams.get('boneName');
            const boneType = selectedBone?.toLowerCase().replace(/\s+/g, '_');

            const response = await fetch('http://localhost:3001/api/bones/measurements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    boneName: selectedBone,
                    boneType: boneType,
                    measurements: measurements,
                    // Include other form data if needed
                    formData: formData
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('All data saved successfully!');
                // Reset if needed
                setMeasurements({});
            } else {
                alert('Failed to save: ' + data.message);
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data. Check console for details.');
        } finally {
            setIsSaving(false);
        }
    };
*/
    return (
        
        <ResponsiveLayout 
            Left={Left2} 
            Right={Right2} 
        />
    )
}