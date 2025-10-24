import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import {Table, TextField} from '@radix-ui/themes'
import {craniometrics_list} from "@/components/editor/craniometrics-list"

export default function Craniometrics() {
    return(
        <div className = "bone-container">
            <h3 className = "text-center">Craniometrics</h3>
            <Tabs defaultValue = "Cranium" className = "relative w-full">
                <TabsList className = "grid w-full grid-cols-2">
                    <TabsTrigger value="Cranium">Cranium</TabsTrigger>
                    <TabsTrigger value="Mandible">Mandible</TabsTrigger>
                </TabsList>
                <TabsContent value="Cranium">
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Measurement</Table.ColumnHeaderCell>
			                    <Table.ColumnHeaderCell>Landmarks</Table.ColumnHeaderCell>
			                    <Table.ColumnHeaderCell>Abbv.</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Input</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {craniometrics_list.metrics_cranium.map((info, i) => 
                            <Table.Row key = {i}>
                                <Table.RowHeaderCell>{info.split("\t")[0]}</Table.RowHeaderCell>
                                <Table.Cell>{info.split("\t")[1]}</Table.Cell>
                                <Table.Cell>{info.split("\t")[2]}</Table.Cell>
                                <Table.Cell>
                                    <TextField.Root type="number"/>
                                </Table.Cell>
                            </Table.Row>)}
                        </Table.Body>
                    </Table.Root>
                </TabsContent>
                <TabsContent value="Mandible">
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Measurement</Table.ColumnHeaderCell>
			                    <Table.ColumnHeaderCell>Landmarks</Table.ColumnHeaderCell>
			                    <Table.ColumnHeaderCell>Abbv.</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Input</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {craniometrics_list.metrics_mandible.map((info, i) => 
                            <Table.Row>
                                <Table.RowHeaderCell>{info.split("\t")[0]}</Table.RowHeaderCell>
                                <Table.Cell>{info.split("\t")[1]}</Table.Cell>
                                <Table.Cell>{info.split("\t")[2]}</Table.Cell>
                                <Table.Cell>
                                    <TextField.Root type="number"/>
                                </Table.Cell>
                            </Table.Row>)}
                        </Table.Body>
                    </Table.Root>
                </TabsContent>
            </Tabs>
        </div>
    )
}