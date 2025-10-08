"use client"

import Left from "@/components/editor/Left"
import Right from "./Right"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('authToken')
        //if (!token) {
         //   router.push('/login')
       // }
        }, [])
    return <ResponsiveLayout Left={Left2} Right={Right2} />
}
