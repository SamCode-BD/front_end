"use client"

import Left from "@/components/editor/Left"
import Right from "./Right"

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
    return <ResponsiveLayout Left={Left2} Right={Right2} />
}
