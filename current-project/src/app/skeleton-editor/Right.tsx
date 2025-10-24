"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import Measurements from "@/components/editor/measurements"
  import { Button } from "@/components/ui/button"
  import Taphonomy from "@/components/editor/Taphonomy"
  import Craniometrics from "@/components/editor/Craniometrics"
  import PostcranialMetrics from '@/components/editor/PostcranialMetrics';
  import CranialNonmetrics from "@/components/editor/CranialNonmetrics"
import CranialInventory from '@/components/editor/CranialInventory';
import PostcranialInventory from '@/components/editor/PostcranialInventory';
import PermanentInventory from '@/components/editor/PermanentInventory';
import DeciduousInventory from '@/components/editor/DeciduousInventory';
 
function Right() {
    
    return(

    <div className = "flex flex-col h-screen col-span-2 lg:col-span-4 space-y-4 bg-gray-100/10">

        <div className="flex justify-center px-4">
            <Tabs defaultValue="cranium" className="relative w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="cranium">Cranium</TabsTrigger>
                    <TabsTrigger value="postcranial">Postcranial</TabsTrigger>
                    <TabsTrigger value="dental">Dental</TabsTrigger>
                </TabsList>
                    <TabsContent value="cranium">
                        <Tabs className="relative w-full">
                            <TabsList className = "grid w-full grid-cols-3">
                                <TabsTrigger value="Craniometrics">Metrics</TabsTrigger>
                                <TabsTrigger value="Cranial Nonmetrics">Nonmetrics</TabsTrigger>
                                <TabsTrigger value="Cranial Inventory">Inventory</TabsTrigger>
                            </TabsList>
                            <TabsContent value="Craniometrics">
                                <Craniometrics/>
                            </TabsContent>
                            <TabsContent value="Cranial Nonmetrics">
                                <CranialNonmetrics/>
                            </TabsContent>
                            <TabsContent value="Cranial Inventory">
                                <CranialInventory/>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                    <TabsContent value="postcranial">
                        <Tabs className="relative w-full">
                            <TabsList className = "grid w-full grid-cols-2">
                                <TabsTrigger value="Postcranial Metrics">Metrics</TabsTrigger>
                                <TabsTrigger value="Postcranial Inventory">Inventory</TabsTrigger>
                            </TabsList>
                            <TabsContent value="Postcranial Metrics">
                                <PostcranialMetrics/>
                            </TabsContent>
                            <TabsContent value="Postcranial Inventory">
                                <PostcranialInventory/>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                    <TabsContent value="dental">
                        <Tabs className="relative w-full">
                            <TabsList className = "grid w-full grid-cols-2">
                                <TabsTrigger value="Dental Permanent">Permanent</TabsTrigger>
                                <TabsTrigger value="Dental Deciduous">Deciduous</TabsTrigger>
                            </TabsList>
                            <TabsContent value="Dental Permanent">
                               <PermanentInventory/>
                            </TabsContent>
                            <TabsContent value="Dental Deciduous">
                                <DeciduousInventory/>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
            </Tabs>
        </div>

    </div>  

    );
}
export default Right