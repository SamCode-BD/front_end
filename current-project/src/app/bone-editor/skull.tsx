import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import {Table, TextField} from '@radix-ui/themes'
import {craniometrics_list} from "@/components/editor/skeleton-editor/craniometrics-list"
import Craniometrics from "@/components/editor/skeleton-editor/Craniometrics"
import CranialNonmetrics from "@/components/editor/skeleton-editor/CranialNonmetrics"
import CranialInventory from '@/components/editor/skeleton-editor/CranialInventory';

function Skull() {
    return(
        <div className = "flex flex-col h-screen col-span-2 lg:col-span-4 space-y-4 bg-gray-100/10">

            <div className="flex justify-center px-4">
                
                <Tabs defaultValue="Craniometrics" className="relative w-full">
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

            </div>
        </div>

    )
} export default Skull