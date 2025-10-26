import { Button } from "@/components/ui/button";
import "@/app/globals.css";
import {useState, useEffect} from 'react'
import { Input } from "@/components/ui/input";
import { Select } from "@radix-ui/themes";
import { loadMuseums } from "@/app/skeleton-editor/api/loadMuseums";
import { useEditSkeletonAPI } from "@/app/skeleton-editor/EditSkeletonAPIContext";


function Field() {
    const { api, updateField } = useEditSkeletonAPI();
    const [museums, setMuseums] = useState<{ museum_id: number; museum_name: string }[]>([]);

    useEffect(() => {
    const fetchMuseums = async () => {
      const result = await loadMuseums(process.env.NEXT_PUBLIC_API_URL!);
      setMuseums(result);
    };
    fetchMuseums();
    }, []);

    // Find museum name based on loaded museum_id (for display)
    const currentMuseum = museums.find(m => m.museum_id === api.specimen.museum_id);
    const currentValue = currentMuseum ? String(currentMuseum.museum_id) : "";

    return (
        <div className="flex flex-col ml-5 space-y-5 m-auto">

            <div className="flex items-center justify-between space-x-2">
                <p>Specimen Number: </p>
                <Input
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                    value={api.specimen.specimen_number}
                    onChange={(e) => updateField("specimen", "specimen_number", Number(e.target.value))}
                />
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>Museum: </p>
                <Select.Root
                value={currentValue}
                onValueChange={(value) => {
                    const selected = museums.find(m => String(m.museum_id) === value);
                    updateField("specimen", "museum_id", Number(value)); // Save ID
                    updateField("specimen", "museum_name", selected?.museum_name || ""); // Save name for display convenience
                }}
                >
                <Select.Trigger className="h-[40px] w-2/3 max-w-sm bg-white" />
                <Select.Content>
                    {museums.map(museum => (
                    <Select.Item key={museum.museum_id} value={String(museum.museum_id)}>
                        {museum.museum_name}
                    </Select.Item>
                    ))}
                </Select.Content>
                </Select.Root>
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>Sex: </p>
                
                <Select.Root
                    value={api.specimen.sex}
                    onValueChange={(value) => updateField("specimen", "sex", value)}
                >
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value="male">Male</Select.Item>
                        <Select.Item value="female">Female</Select.Item>
                        <Select.Item value="?male">?Male</Select.Item>
                        <Select.Item value="?female">?Female</Select.Item>
                        <Select.Item value="unknown">Unknown</Select.Item>
                    </Select.Content>
                </Select.Root>
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>User: {api.user.user_name}</p>
            </div>
        </div>
    );
}

export default Field;
