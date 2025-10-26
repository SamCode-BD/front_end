import {Table, TextField} from '@radix-ui/themes'
import { postcranialmetrics_list } from '@/app/metrics/postcranialmetrics' 
import { pcm_extra } from '@/app/metrics/pcm_extra'
import { useConfirmDialog } from '@/components/confirm-dialog-context';
import { useEditSkeletonAPI } from '@/app/skeleton-editor/EditSkeletonAPIContext';

function formatBoneName(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
function formatInfo(info: string): string {
    return info
        .split("(Figure")[0]
        .split(": ").slice(1).join(": ")
}

function toColumnName(metricName) {
  return metricName
    .replace(/[()]/g, '')      // ✅ Remove parentheses but keep the content inside
    .replace(/\//g, ' ')       // Replace slashes with spaces
    .replace(/-/g, ' ')        // Replace hyphens with spaces
    .replace(/,/g, ' ')        // Replace commas
    .replace(/:/g, '')         // Remove colons
    .replace(/\s+/g, ' ')      // Collapse multiple spaces
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');     // Replace spaces with underscores
}


export default function PostcranialMetrics() {
    const {api, updateField} = useEditSkeletonAPI();
    const infoPanel = useConfirmDialog();
    const displayInfo = async(boneName : string, info : string) => {
        const ok = await infoPanel({
            title: boneName,
            description: info,
            cancelText: "Close"
        }
        )
    }
    return(
        <div className = "bone-container">
            <h3 className = "text-center">Postcranial Metrics</h3>
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Bone</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Measurement</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Input</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Info</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    
                    {Object.keys(postcranialmetrics_list)
                    .filter((boneType) => boneType !== "cranium" && boneType !== "mandible")
                    .map((boneType, i) =>
                        postcranialmetrics_list[boneType].map((metric, j) => (
                        
                            <Table.Row key={`${boneType}-${j}`}>
                                <Table.RowHeaderCell>
                                    {formatBoneName(boneType)}
                                </Table.RowHeaderCell>
                                <Table.Cell>{metric}</Table.Cell>
                                <Table.Cell>
                                    <TextField.Root type="number"
                                    value={api.postcranial_metrics.find((m) => m.metric_name === toColumnName(boneType + " " + metric))?.metric_value}
                                    onChange={(e) => updateField("postcranial_metrics", {
                                                        metric_name: toColumnName(boneType + " " + metric),
                                                        metric_value: Number(e.target.value)}, "metric_name")}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <button
                                        className="w-10"
                                        onClick={() => displayInfo(formatBoneName(boneType), formatInfo(pcm_extra[i + j].split("\t")[2]))}
                                    >?</button>
                                </Table.Cell>
                            </Table.Row>
                        
                        ))
                    )}
                </Table.Body>
            </Table.Root>
        </div>
    )

}