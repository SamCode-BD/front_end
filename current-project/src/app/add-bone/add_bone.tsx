"use client"

import { metrics_list } from "../metrics/fullmetricslist"
import React, {useState, useContext} from 'react';
import { useRouter } from 'next/navigation';

import {
  Tabs,
  TabsTrigger,
  TabsContent,
  TabsList
} from "@/components/ui/tabs"

  import {
    Button
  } from "@/components/ui/button"

  import {
    Button2 
  } from "@/components/ui/button2"
   
  export function BoneMenu() {

    let [boneName, setBoneName] = useState("bone name");
    const router = useRouter();

    return (
      <>
        <h1> Add Bone</h1>
        <div className="flex flex-col">
          <Tabs defaultValue="cranial" className="w-full">
            <TabsList className="w-full mt-4 mb-5">
              <TabsTrigger value="cranial">Cranial</TabsTrigger>
              <TabsTrigger value="postcranial">Postcranial</TabsTrigger>
            </TabsList>
            <TabsContent value="cranial">
              <div className="flex flex-wrap gap-2 w-24">
                <div>
                  {metrics_list.cranial_metrics.map((name, i) => <Button className="text-left" variant="ghost" name={name} key={i} 
                    onClick={() => {
                      setBoneName(name);
                      router.push(`/bone-editor?boneName=${encodeURIComponent(name)}`);
                    }}
                    >
                    {name} </Button>)}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="postcranial">
              <div className="flex flex-wrap justify-evenly max-h-150 gap-2 w-full">
                {metrics_list.postcranial_metrics.map((name, i) => 
                <Button2 className="text-left text-white bg-maroon hover:bg-maroon2" variant="default" name={name} key={i} 
                onClick={() => {
                  setBoneName(name);
                  router.push(`/bone-editor?boneName=${encodeURIComponent(name)}`);
                  }}
                > 
                {name} </Button2>)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </>
    )
  }
