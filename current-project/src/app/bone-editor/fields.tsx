import { Button } from "@/components/ui/button"
import "@/app/globals.css"
import { Input } from "@/components/ui/input"
import { Select } from "@radix-ui/themes"
import { useEditBoneAPI } from "./EditBoneAPIContext"


function Field() {
    
    const {api, updateField} = useEditBoneAPI();
    console.log(api);
    return (
        <div className = "flex flex-col ml-5 space-y-5 m-auto">
            
            <div className="flex items-center justify-between space-x-2">
                <p>Specimen Number: </p>
                <Input 
                    value={api.specimen.specimen_number}
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                    onChange={(e) => updateField("specimen","specimen_number", Number(e.target.value))}
                />
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>Museum: </p>
                <Input 
                    value={api.specimen.museum_name}
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                     onChange={(e) => updateField("specimen", "museum_name", e.target.value)}
                />
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>Sex: </p>
                <Select.Root
                value={api.specimen.sex}
                onValueChange={(value) => updateField("specimen", "sex", value)}>
                    <Select.Trigger/>
                    <Select.Content>
                        <Select.Item value="Male">Male</Select.Item>
                        <Select.Item value="Female">Female</Select.Item>
                        <Select.Item value="?Male">?Male</Select.Item>
                        <Select.Item value="?Female">?Female</Select.Item>
                        <Select.Item value="Unknown">Unknown</Select.Item>
                    </Select.Content>
                </Select.Root>
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>User: {api.user.user_name}</p>

            </div>
        </div>
    )   
} 

export default Field