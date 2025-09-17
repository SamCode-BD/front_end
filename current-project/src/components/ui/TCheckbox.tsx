
function TCheckbox(props) {
    return(<div className="flex gap-2">
        <input type="checkbox"/>
        <label>{props.name}</label>
    </div>)
}
export default TCheckbox