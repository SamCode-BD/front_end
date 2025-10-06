"use client"

import Left from "@/components/editor/Left"
import Right from "./Right"
import {redirect} from "next/navigation"
import useAuth from "@/lib/useAuth"
import ResponsiveLayout from "@/components/editor/responsiveLayout"


function Left2(){
    return(
        <div>
            <Left/>
        </div>
    )
}

function Right2(){
    return(
        <div>
            <Right/>
        </div>
    )
}

export default function Home(){
    
    const user = useAuth();

    if (!user) {
        redirect('/login'); // Next.js App Router redirect
    }
    return <ResponsiveLayout Left={Left2} Right={Right2} />
}
