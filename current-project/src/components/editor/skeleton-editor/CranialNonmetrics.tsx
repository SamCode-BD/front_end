
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import React from 'react'

import {Table, Select} from '@radix-ui/themes'

import { cranial_nonmetrics_list } from "@/components/editor/skeleton-editor/cranial-nonmetrics-list"
import type { CranialNonmetricRow } from "@/components/editor/skeleton-editor/cranial-nonmetrics-list"
import Macromorphoscopics from "@/components/editor/skeleton-editor/Macromorphoscopics"
import { useEditSkeletonAPI } from "@/app/skeleton-editor/EditSkeletonAPIContext"

function CranialNonmetrics() {

    const {api, updateField} = useEditSkeletonAPI();

    function renderTable(tab_str : string) {
        const info: CranialNonmetricRow[] = cranial_nonmetrics_list[tab_str];
        return (
            <Table.Root>
            <Table.Body>
            {info.map((row, i) => (
                <Table.Row key={i}>
                    <Table.RowHeaderCell>{row[0]}</Table.RowHeaderCell>
                    <Table.Cell>
                        <Select.Root
                        value={api.cranial_nonmetrics.find((r) => r.nonmetric_name === row[0])?.value_str}
                        onValueChange={(value) => {updateField("cranial_nonmetrics", {
                            category: tab_str,
                            nonmetric_name: row[0],
                            value_str: value
                        }, "nonmetric_name"
                        )}}>
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
            </Table.Body>
        </Table.Root>
        )
    }
    const tab_values = ["facial", "lateral", "basilar", "mandibular", "macromorphoscopics"];

    return(<div className = "bone-container">
                <h3 className = "text-center">Cranial Nonmetrics</h3>
                    <Tabs defaultValue = "facial">
                        <TabsList>
                            {tab_values.map((tab, i) =>
                            <TabsTrigger value={tab}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</TabsTrigger>)}
                        </TabsList>
                        {tab_values.map((tab, i) => tab != "macromorphoscopics" &&
                            <TabsContent value={tab}>
                                {renderTable(tab)}
                            </TabsContent>
                        )}
                        <TabsContent value="macromorphoscopics">
                            <Macromorphoscopics/>
                        </TabsContent>
                    </Tabs>
            </div>)
}

export default CranialNonmetrics