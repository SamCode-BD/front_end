"use client"

import { useSearchParams } from 'next/navigation';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import Measurements from "@/components/editor/measurements"
  import { Button } from "@/components/ui/button"
  import Taphonomy from "@/components/editor/Taphonomy"
 
function Right() {

    const searchParams = useSearchParams();
    const boneName = searchParams.get('boneName');
    const selectedBone = boneName;

    
    return(

    <div className = "flex flex-col h-screen col-span-2 lg:col-span-4 space-y-4 bg-gray-100/10">
         

        <div className="w-full flex h-[10%] px-20"><h1>{boneName}</h1></div>

        <div className="flex justify-center px-4">
            <Tabs defaultValue="measurements" className="relative w-[800px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="measurements">Measurements</TabsTrigger>
                    <TabsTrigger value="taphonomy">Taphonomy</TabsTrigger>
                </TabsList>
                    <TabsContent value="measurements">
                        
                        <div className="bone-container">
                            <Measurements selectedBone = {selectedBone} ></Measurements>
                        </div>
                        
                    </TabsContent>
                    <TabsContent value="taphonomy">
                        <div className="bone-container">
                                <Taphonomy></Taphonomy>
                        </div>
    
                    </TabsContent>
            </Tabs>
        </div>

    </div>  

    );
}
export default Right