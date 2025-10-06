"use client"

import { BoneMenu } from "./add_bone" 
import Header from "@/components/header"
import {redirect} from "next/navigation"
import useAuth from "@/lib/useAuth"

export default function Home(){
    const user = useAuth();

    if (!user) {
        redirect('/login'); // Next.js App Router redirect
    }
    return(
    <div>
        <Header></Header>
        <div className="add-bone-container">
            <BoneMenu></BoneMenu>
        </div>
    </div>
    )
}

