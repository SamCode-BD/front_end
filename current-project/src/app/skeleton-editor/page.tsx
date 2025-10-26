"use client"

import Left from "@/app/skeleton-editor/Left"
import Right from "./Right"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ResponsiveLayout from "@/components/editor/responsiveLayout"
import {EditSkeletonAPI} from "./skeleton-editor-types"
import { DEFAULT_EDIT_SKELETON_API } from "./skeleton-editor-types"
import { EditSkeletonAPIProvider } from "./EditSkeletonAPIContext"


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

    const router = useRouter();


    return (
        <EditSkeletonAPIProvider>
            <ResponsiveLayout Left={Left2} Right={Right2}/>
        </EditSkeletonAPIProvider>
     )
}
