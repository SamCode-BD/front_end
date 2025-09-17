import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import {Table, Select} from '@radix-ui/themes'

import { cranial_nonmetrics_list } from "@/components/editor/cranial-nonmetrics-list"
import type { CranialNonmetricRow } from "@/components/editor/cranial-nonmetrics-list"
import Macromorphoscopics from "@/components/editor/Macromorphoscopics"

export default function CranialNonmetrics() {

    function renderTable(info: CranialNonmetricRow[]) {
        return (
            <Table.Root>
            {info.map((row, i) => (
                <Table.Row key={i}>
                    <Table.RowHeaderCell>{row[0]}</Table.RowHeaderCell>
                    <Table.Cell>
                        <Select.Root>
                            <Select.Trigger />
                            <Select.Content>
                                {Array.isArray(row[1]) ? (
                                    row[1].map((option, j) =>
                                        <Select.Item key={j} value={option}>{option}</Select.Item>
                                    )
                                ) : (
                                    <Select.Item value={row[1]}>{row[1]}</Select.Item>
                                )}
                            </Select.Content>
                        </Select.Root>
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Root>
        )
    }
    return(<div className = "bone-container">
                <h3 className = "text-center">Cranial Nonmetrics</h3>
                    <Tabs defaultValue = "Facial">
                        <TabsList>
                            <TabsTrigger value="Facial">Facial</TabsTrigger>
                            <TabsTrigger value="Lateral">Lateral</TabsTrigger>
                            <TabsTrigger value="Basilar">Basilar</TabsTrigger>
                            <TabsTrigger value="Mandibular">Mandibular</TabsTrigger>
                            <TabsTrigger value="Macromorphoscopics">Macromorphoscopics</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Facial">
                            {renderTable(cranial_nonmetrics_list.facial)}
                        </TabsContent>
                        <TabsContent value="Lateral">
                            {renderTable(cranial_nonmetrics_list.lateral)}
                        </TabsContent>
                        <TabsContent value="Basilar">
                            {renderTable(cranial_nonmetrics_list.basilar)}
                        </TabsContent>
                        <TabsContent value="Mandibular">
                            {renderTable(cranial_nonmetrics_list.mandibular)}
                        </TabsContent>
                        <TabsContent value="Macromorphoscopics">
                            <Macromorphoscopics/>
                        </TabsContent>
                    </Tabs>
            </div>)
}