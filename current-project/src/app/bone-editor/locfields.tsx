
import { Button } from "@/components/ui/button"
import "@/app/globals.css"
import { Input } from "@/components/ui/input"
import { useEditBoneAPI } from "./EditBoneAPIContext"

function LocField(){
    const {api, updateField} = useEditBoneAPI();
return (
    <div className = "flex flex-col ml-5 space-y-5 m-auto">
        
        <div className="flex items-center justify-between space-x-2">
            <p>Parvorder: </p>
            <Input className="h-[40px] w-2/3 max-w-sm bg-white"
            value={api.taxonomy.parvorder}
            onChange={(e) => updateField("taxonomy", "parvorder", e.target.value)}></Input>
        </div>

        <div className="flex items-center justify-between space-x-2">
            <p>Superfamily: </p>
            <Input className="h-[40px] w-2/3 max-w-sm bg-white"
            value={api.taxonomy.superfamily}
            onChange={(e) => updateField("taxonomy", "superfamily", e.target.value)}></Input>
        </div>

        <div className="flex items-center justify-between space-x-2">
            <p>Family: </p>
            <Input className="h-[40px] w-2/3 max-w-sm bg-white"
            value={api.taxonomy.family}
            onChange={(e) => updateField("taxonomy", "family", e.target.value)}></Input>
        </div>

        <div className="flex items-center justify-between space-x-2">
            <p>Subfamily: </p>
            <Input className="h-[40px] w-2/3 max-w-sm bg-white"
            value={api.taxonomy.subfamily}
            onChange={(e) => updateField("taxonomy", "subfamily", e.target.value)}></Input>
        </div>

        <div className="flex items-center justify-between space-x-2">
            <p>Genus: </p>
            <Input className="h-[40px] w-2/3 max-w-sm bg-white"
            value={api.taxonomy.genus}
            onChange={(e) => updateField("taxonomy", "genus", e.target.value)}></Input>
        </div>
    </div>

)
} export default LocField