import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import {Table, TextField} from '@radix-ui/themes'
import {craniometrics_list} from "@/components/editor/skeleton-editor/craniometrics-list"
import { useEditSkeletonAPI } from "@/app/skeleton-editor/EditSkeletonAPIContext"

export default function Craniometrics() {
    const {api, updateField} = useEditSkeletonAPI();
    const displayName = (info) => info.split("\t")[0].trim(' ');
    function storageName(info: string): string {
        // Extract the part before the first tab — the descriptive label
        let name = info.split("\t")[0].trim();

        // Normalize: lowercase, remove special chars, replace spaces/dashes/slashes with underscores
        return name
            .toLowerCase()
            .replace(/[()/]/g, "")     // remove parentheses and slashes
            .replace(/[-\s]+/g, "_")   // replace spaces and dashes with underscores
            .replace(/[^a-z0-9_]/g, ""); // strip anything weird
    }
    
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
                            {craniometrics_list.metrics_cranium.map((row_info, i) => 
                            <Table.Row key = {i}>
                                <Table.RowHeaderCell>{displayName(row_info)}</Table.RowHeaderCell>
                                <Table.Cell>{row_info.split("\t")[1]}</Table.Cell>
                                <Table.Cell>{row_info.split("\t")[2]}</Table.Cell>
                                <Table.Cell>
                                    <TextField.Root type="number" 
                                    value={api.metrics_cranium.find((m) => storageName(row_info) === m.metric_name)?.metric_value || ''}
                                    onChange={(e) => updateField("metrics_cranium", {
                                                        metric_name: storageName(row_info),
                                                        metric_value: Number(e.target.value)
                                                    },
                                                     "metric_name")}/>
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
                            {craniometrics_list.metrics_mandible.map((row_info, i) => 
                            <Table.Row>
                                <Table.RowHeaderCell>{displayName(row_info)}</Table.RowHeaderCell>
                                <Table.Cell>{row_info.split("\t")[1]}</Table.Cell>
                                <Table.Cell>{row_info.split("\t")[2]}</Table.Cell>
                                <Table.Cell>
                                    <TextField.Root type="number" 
                                    value={api.metrics_mandible.find((m) => storageName(row_info) === m.metric_name)?.metric_value || ''}
                                    onChange={(e) => updateField("metrics_mandible", {
                                                        metric_name: storageName(row_info),
                                                        metric_value: Number(e.target.value)
                                                    },
                                                     "metric_name")}/>
                                </Table.Cell>
                            </Table.Row>)}
                        </Table.Body>
                    </Table.Root>
                </TabsContent>
            </Tabs>
        </div>
    )
}