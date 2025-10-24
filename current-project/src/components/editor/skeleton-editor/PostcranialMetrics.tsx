import {Table, TextField} from '@radix-ui/themes'
import { postcranialmetrics_list } from '@/app/metrics/postcranialmetrics' 
import { pcm_extra } from '@/app/metrics/pcm_extra'
import { useConfirmDialog } from '@/components/confirm-dialog-context';

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

export default function PostcranialMetrics() {
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
                    
                    {Object.keys(postcranialmetrics_list).map((boneType, i) =>
                        postcranialmetrics_list[boneType].map((metric, j) => (
                        
                            <Table.Row key={`${boneType}-${j}`}>
                                <Table.RowHeaderCell>
                                    {formatBoneName(boneType)}
                                </Table.RowHeaderCell>
                                <Table.Cell>{metric}</Table.Cell>
                                <Table.Cell>
                                    <TextField.Root type="number"/>
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