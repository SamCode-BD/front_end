import { Button } from "@/components/ui/button"
import "@/app/globals.css"
import { Input } from "@/components/ui/input"
import { useBoneData } from "./context/BoneDataContext"

function LocField() {
    const { localityData, formData } = useBoneData();
    
    // Check if SUB museum is selected
    const isSubMuseum = formData.museumId === '1';

    return (
        <div className = "flex flex-col ml-5 space-y-5 m-auto">
            
            <div className="flex items-center justify-between space-x-2">
                <p>Broad Region: </p>
                <Input 
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                    value={localityData.broadRegion}
                    placeholder={isSubMuseum ? "East Coast" : "Enter broad region"}
                    disabled={isSubMuseum}
                />
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>Country: </p>
                <Input 
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                    value={localityData.country}
                    placeholder={isSubMuseum ? "United States" : "Enter country"}
                    disabled={isSubMuseum}
                />
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>Locality: </p>
                <Input 
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                    value={localityData.locality}
                    placeholder={isSubMuseum ? "Salisbury" : "Enter locality"}
                    disabled={isSubMuseum}
                />
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>Region: </p>
                <Input 
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                    value={localityData.region}
                    placeholder={isSubMuseum ? "MD" : "Enter region"}
                    disabled={isSubMuseum}
                />
            </div>
        </div>
    )
} 

export default LocField