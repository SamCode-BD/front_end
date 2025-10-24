"use client"

import Left from "@/app/skeleton-editor/Left"
import Right from "./Right"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ResponsiveLayout from "@/components/editor/responsiveLayout"
import {EditSkeletonAPI} from "./skeleton-editor-types"
import { DEFAULT_EDIT_SKELETON_API } from "./skeleton-editor-types"
//import { EditSkeletonAPIProvider } from "./EditSkeletonAPIContext"
import {jwtDecode} from "jwt-decode"

type DecodedToken = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
};

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
    let [api, updateAPI] = useState<EditSkeletonAPI>(DEFAULT_EDIT_SKELETON_API);
    useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
        try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log(decoded);

        updateAPI(prev => ({
            ...prev,
            user: {
            ...prev.user,
            user_id: decoded.id,
            user_name: decoded.name,
            },
        }));
        } catch (error) {
        console.error("Invalid token:", error);
        }
    }
    }, []);
    return (
            <ResponsiveLayout Left={Left2} Right={Right2}/>
     )
}
