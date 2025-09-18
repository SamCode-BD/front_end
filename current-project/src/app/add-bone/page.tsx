import { BoneMenu } from "./add_bone" 
import Header from "@/components/header"

export default function Home(){
    return(
    <div>
        <Header></Header>
        <div className="add-bone-container">
            <BoneMenu></BoneMenu>
        </div>
    </div>
    )
}

