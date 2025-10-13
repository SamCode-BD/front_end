type TCheckboxProps = {
  name: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
};

function TCheckbox({name, checked, onChange} : TCheckboxProps) {
    return(<div className="flex gap-2">
        <input type="checkbox" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}/>
        <label>{name}</label>
    </div>)
}
export default TCheckbox