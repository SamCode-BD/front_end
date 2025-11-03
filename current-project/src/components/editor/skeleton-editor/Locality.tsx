import { Button } from "@/components/ui/button";
import "@/app/globals.css";
import { Input } from "@/components/ui/input";
import { useEditSkeletonAPI } from "@/app/skeleton-editor/EditSkeletonAPIContext";

function Locality() {
    const { api, updateField } = useEditSkeletonAPI();
    const isSubMuseum = api.specimen.museum_id === '1';
    console.log(api.specimen.museum_id);

    return (
        <div className="flex flex-col ml-5 space-y-5 m-auto">

            <div className="flex items-center justify-between space-x-2">
                <p>Broad Region: </p>
                <Input
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                    value={api.locality.broad_region}
                    placeholder={isSubMuseum ? "East Coast" : "Enter broad region"}
                    disabled={isSubMuseum}
                    onChange={(e) => updateField("locality", "broad_region", e.target.value)}
                ></Input>
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>Country: </p>
                <Input
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                    value={api.locality.country}
                    placeholder={isSubMuseum ? "United States" : "Enter country"}
                    disabled={isSubMuseum}
                    onChange={(e) => updateField("locality", "country", e.target.value)}
                ></Input>
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>Locality: </p>
                <Input
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                    value={api.locality.locality}
                    placeholder={isSubMuseum ? "Salisbury" : "Enter locality"}
                    disabled={isSubMuseum}
                    onChange={(e) => updateField("locality", "locality", e.target.value)}
                ></Input>
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>Region: </p>
                <Input
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                    value={api.locality.region}
                    placeholder={isSubMuseum ? "MD" : "Enter region"}
                    disabled={isSubMuseum}
                    onChange={(e) => updateField("locality", "region", e.target.value)}
                ></Input>
            </div>
        </div>
    );
}

export default Locality;
