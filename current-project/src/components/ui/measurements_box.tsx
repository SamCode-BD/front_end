import { Input } from "@/components/ui/input"

function MeasurementsBox(props){
    return ( 
        <div>
            <label htmlFor="input"> {props.name} </label>
            <Input className="w-1/2 mt-2 mb-2" id="input"></Input>
        </div>
    )
} export default MeasurementsBox