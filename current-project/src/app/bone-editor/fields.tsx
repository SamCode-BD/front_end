import { Button } from "@/components/ui/button"
import "@/app/globals.css"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useBoneData } from "./context/BoneDataContext"

function Field() {
    const { formData, setFormData } = useBoneData();
    
    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className = "flex flex-col ml-5 space-y-5 m-auto">
            
            <div className="flex items-center justify-between space-x-2">
                <p>Specimen #: </p>
                <Input 
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                    type="number"
                    value={formData.specimenNumber}
                    onChange={(e) => handleChange('specimenNumber', e.target.value)}
                    placeholder="Enter specimen number"
                />
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>Museum: </p>
                <Select 
                    value={formData.museumId} 
                    onValueChange={(value) => handleChange('museumId', value)}
                >
                    <SelectTrigger className="h-[40px] w-2/3 max-w-sm bg-white">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">SUB</SelectItem>
                        {/* Add more museums here as needed */}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>Sex: </p>
                <Select 
                    value={formData.sex} 
                    onValueChange={(value) => handleChange('sex', value)}
                >
                    <SelectTrigger className="h-[40px] w-2/3 max-w-sm bg-white">
                        <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>User: </p>
                <Input 
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                    value={formData.user}
                    onChange={(e) => handleChange('user', e.target.value)}
                    placeholder="Enter user"
                />
            </div>
        </div>
    )   
} 

export default Field