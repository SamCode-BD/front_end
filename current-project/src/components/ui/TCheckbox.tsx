interface TCheckboxProps {
    name: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}

function TCheckbox(props: TCheckboxProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(`TCheckbox ${props.name} changed to:`, e.target.checked);
        if (props.onChange) {
            props.onChange(e.target.checked);
        }
    };

    return (
        <div className="flex gap-2">
            <input 
                type="checkbox"
                checked={props.checked === true}
                onChange={handleChange}
            />
            <label className="cursor-pointer" onClick={() => {
                if (props.onChange) {
                    props.onChange(!props.checked);
                }
            }}>
                {props.name}
            </label>
        </div>
    );
}

export default TCheckbox