"use client"

import { Suspense } from 'react';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Measurements from "./measurements"
import { Button } from "@/components/ui/button"
import Taphonomy from "./Taphonomy"
import { useBoneData } from "./context/BoneDataContext"
 
function InnerRight() {
    const { selectedBone } = useBoneData();

    return(
        <div className = "flex flex-col h-screen col-span-2 lg:col-span-4 space-y-4 bg-gray-100/10">
            
            <div className="w-full flex h-[10%] px-20"><h1>{selectedBone}</h1></div>

            <div className="flex justify-center px-4">
                <Tabs defaultValue="measurements" className="relative w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="measurements">Measurements</TabsTrigger>
                        <TabsTrigger value="taphonomy">Taphonomy</TabsTrigger>
                    </TabsList>
                    <TabsContent value="measurements">
                        <div className="bone-container">
                            <Measurements />
                        </div>
                    </TabsContent>
                    <TabsContent value="taphonomy">
                        <div className="bone-container">
                            <Taphonomy />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>   
    );
}

function Right() {
  return (
    <div className="flex flex-col h-screen col-span-2 lg:col-span-4 space-y-4 bg-gray-100/10">
      <Suspense fallback={<div>Loading search params...</div>}>
        <InnerRight />
      </Suspense>
    </div>
  );
}

export default Right
