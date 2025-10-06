"use client"

import { BoneMenu } from "./add_bone" 
import Header from "@/components/header"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home(){
    const router = useRouter();
    useEffect(() => {
        
        const token = localStorage.getItem('authToken')
        if (!token) {
            router.push('/login')
        }
        }, [])
    return(
    <div>
        <Header></Header>
        <div className="add-bone-container">
            <BoneMenu></BoneMenu>
        </div>
    </div>
    )
}

