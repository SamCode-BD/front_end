async function getIndData(): Promise<Individual[]> {
  // Fetch data from your API here.
  return [
    {
      id: "18",
      name: "Individual A",
      museum: "SUB",
      user: "Zach",
      menuID: "Actions"
    },
    {
        id: "19",
        name: "Individual B",
        museum: "SUB",
        user: "Owen",
        menuID: "Actions"
    },
    // ...
  ]
}

async function getBoneData(): Promise<Bone[]> {
  // Fetch data from your API here.
  return [
    {
      id: "75",
      name: "femur",
      museum: "SUB",
      user: "Sam",
      menuID: "Actions"
    },
    {
        id: "76",
        name: "clavicle",
        museum: "SUB",
        user: "Aaron",
        menuID: "Actions"
    },
    // ...
  ]
}

async function getDentalData(): Promise<Dental[]> {
  // Fetch data from your API here.
  return [
    {
      id: "36",
      name: "I2MD",
      museum: "SUB",
      user: "Jhayden",
      menuID: "Actions"
    },
    {
        id: "37",
        name: "I1BL",
        museum: "SUB",
        user: "Sam",
        menuID: "Actions"
    },
    // ...
  ]
}

import { Button } from "@/components/ui/button"

  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import * as React from "react"

import { DataTable } from "./data-table"
import { Individual, indColumns } from "./columns/ind-columns"
import { Dental, dentalColumns } from "./columns/dental-columns"
import { Bone, boneColumns } from "./columns/bone-columns"

export default async function Main(){

  const indData = await getIndData()
  const boneData = await getBoneData();
  const dentalData = await getDentalData();

  return (
    <div>
      <div className="rounded-md">
        <Tabs defaultValue="bone" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bone">Bone</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="dental">Dental</TabsTrigger>
            </TabsList>
          <TabsContent value="bone">
            <div>
              <DataTable columns={boneColumns} data={boneData} type={"Bone"}/>
            </div>
          </TabsContent>
        
          <TabsContent 
          value="individual"
          className="">
            <div>
                <DataTable columns={indColumns} data={indData} type={"Individual"}/>
            </div>
          </TabsContent>


          <TabsContent 
          value="dental"
          className="">
            <div>
              <DataTable columns={dentalColumns} data={dentalData} type={"Dental"}/>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
