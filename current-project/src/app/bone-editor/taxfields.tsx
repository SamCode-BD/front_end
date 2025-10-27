
import { Button } from "@/components/ui/button"
import "@/app/globals.css"
import { Input } from "@/components/ui/input"

function TaxField(){
return (
    <div className = "flex flex-col ml-5 space-y-5 m-auto">
        
        <div className="flex items-center justify-between space-x-2">
            <p>Parvorder: </p>
            <Input className="h-[40px] w-2/3 max-w-sm bg-white"></Input>
        </div>

        <div className="flex items-center justify-between space-x-2">
            <p>Superfamily: </p>
            <Input className="h-[40px] w-2/3 max-w-sm bg-white"></Input>
        </div>

        <div className="flex items-center justify-between space-x-2">
            <p>Family: </p>
            <Input className="h-[40px] w-2/3 max-w-sm bg-white"></Input>
        </div>

        <div className="flex items-center justify-between space-x-2">
            <p>Subfamily: </p>
            <Input className="h-[40px] w-2/3 max-w-sm bg-white"></Input>
        </div>

        <div className="flex items-center justify-between space-x-2">
            <p>Genus: </p>
            <Input className="h-[40px] w-2/3 max-w-sm bg-white"></Input>
        </div>
    </div>

)
} export default TaxField