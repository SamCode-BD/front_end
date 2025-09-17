"use client"
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
import { useRouter } from 'next/navigation';

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

import {useEffect, useState} from 'react';
import { useConfirmDialog } from '@/components/confirm-dialog-context';


export default function Main(){
  const router = useRouter();


  const [indData, setIndData] = useState<Individual[]>([]);
  const [boneData, setBoneData] = useState<Bone[]>([]);
  const [dentalData, setDentalData] = useState<Dental[]>([]);
  const [loading, setLoading] = useState(true);

  const confirm = useConfirmDialog();

  useEffect(() => {
    async function fetchData() {
      const [ind, bone, dental] = await Promise.all([
        getIndData(),
        getBoneData(),
        getDentalData(),
      ]);
      setIndData(ind);
      setBoneData(bone);
      setDentalData(dental);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  

  const confirmAddIndividual = async() => {
    const confirmed = await confirm({
                  title:"",
                  description:"This will create an entire skeleton. Are you sure you want to continue?",
                  confirmText:"OK",
                  cancelText:"Cancel"
                })
    if(!confirmed) {
      return;
    }
    else {
      setLoading(true);
      router.push('/skeleton-editor');
    }
  }

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
              <DataTable columns={boneColumns} data={boneData} type={"Bone"}
              onAddClick={() => router.push('/add-bone')}/>
            </div>
          </TabsContent>
        
          <TabsContent 
          value="individual"
          className="">
            <div>
                <DataTable columns={indColumns} data={indData} type={"Individual"}
                onAddClick={confirmAddIndividual}/>
            </div>
          </TabsContent>


          <TabsContent 
          value="dental"
          className="">
            <div>
              <DataTable columns={dentalColumns} data={dentalData} type={"Dental"}
              onAddClick={() => router.push("/add-bone")}/>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
