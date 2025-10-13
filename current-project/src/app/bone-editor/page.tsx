"use client"

import { useState, useEffect } from "react"
import Left from "./Left"
import Right from "./Right"
import ResponsiveLayout from "@/components/editor/responsiveLayout"
import { EditBoneAPI } from "./bone-editor-types"
import { DEFAULT_EDIT_BONE_API } from "./bone-editor-types"
import { EditBoneAPIProvider } from "./EditBoneAPIContext";
import {jwtDecode} from "jwt-decode"


type DecodedToken = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
};

export default function Home() {

    let [api, updateAPI] = useState<EditBoneAPI>(DEFAULT_EDIT_BONE_API)
    useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);

        updateAPI(prev => ({
          ...prev,
          user: {
            ...prev.user,
            user_id: decoded.id,
            user_name: decoded.name, // 👈 update user_id from token
          },
        }));
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    }, []);

    //if new entry: need to decide what the new ids for insertion will be based on the next available id

    //insert a blank row with that id in each relevant table
    //(blank rows need to be inserted so that we can mark that id as "taken" in case multiple users are opening this page
    //to add something at the same time)

    //if the user exits the page without having saved successfully, those rows will be deleted
    //We can use a CRON job to clean up the database and delete blank/unused rows

    //for an existing entry: the ids should be transferred over here from the previous page

    function Left2() { //Save button is located in here
        return (
            <div>
                <Left />
            </div>
        )
    }

    function Right2() {
        return (
            <div>
                <Right/>
            </div>
        )
    }
    
    return (
        
        <EditBoneAPIProvider>
            <ResponsiveLayout 
                Left={Left2} 
                Right={Right2} 
            />
        </EditBoneAPIProvider>
    )
}