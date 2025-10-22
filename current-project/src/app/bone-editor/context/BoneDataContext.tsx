"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

interface FormData {
    specimenNumber: string;  // Changed from boneId
    museumId: string;        // Store museum_id instead of museum name
    sex: string;
    user: string;
}

interface BoneDataContextType {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    measurements: Record<string, any>;
    setMeasurements: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    selectedBone: string | null;
    boneType: string | null;
    isSaving: boolean;
    handleSave: () => Promise<void>;
}

const BoneDataContext = createContext<BoneDataContextType | undefined>(undefined);

export function BoneDataProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams();
    const selectedBone = searchParams.get('boneName');
    const boneType = selectedBone?.toLowerCase().replace(/\s+/g, '_') || null;

    const [formData, setFormData] = useState<FormData>({
        specimenNumber: '',
        museumId: '',
        sex: 'unknown',
        user: ''
    });
    
    const [measurements, setMeasurements] = useState<Record<string, any>>({});
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        console.log('handleSave called!');
        console.log('formData:', formData);
        console.log('measurements:', measurements);
        console.log('selectedBone:', selectedBone);
        console.log('boneType:', boneType);

        // Validate required fields
        if (!formData.specimenNumber) {
            alert('Please enter a Specimen Number');
            return;
        }
        if (!formData.museumId) {
            alert('Please select a Museum');
            return;
        }

        setIsSaving(true);
        
        try {
            console.log('Sending request to backend...');
            const response = await fetch('http://localhost:3001/api/bones/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    specimenNumber: formData.specimenNumber,
                    museumId: formData.museumId,
                    boneName: selectedBone,
                    boneType: boneType,
                    sex: formData.sex,
                    user: formData.user,
                    measurements: measurements
                })
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (data.success) {
                alert(`Data saved successfully!\nSpecimen: ${data.specimenName}\nBone ID: ${data.boneId}`);
                setMeasurements({});
            } else {
                alert('Failed to save: ' + data.message);
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data. Check console for details.');
        } finally {
            setIsSaving(false);
            console.log('handleSave finished');
        }
    };

    return (
        <BoneDataContext.Provider 
            value={{ 
                formData, 
                setFormData, 
                measurements, 
                setMeasurements,
                selectedBone,
                boneType,
                isSaving,
                handleSave
            }}
        >
            {children}
        </BoneDataContext.Provider>
    );
}

export function useBoneData() {
    const context = useContext(BoneDataContext);
    if (context === undefined) {
        throw new Error('useBoneData must be used within a BoneDataProvider');
    }
    return context;
}