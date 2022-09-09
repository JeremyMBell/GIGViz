import  React, { useCallback } from "react";
import { NumEventHandler } from "../../types/EventHandlers"

interface INumControlProps {
    onChange: NumEventHandler;
    value: number;
}
/**
 * Control that clamps the amount of results to display
 */
export const NumControl: React.FC<INumControlProps> = ({onChange, value}) => {
    const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
        (event) => {
            onChange(parseInt(event.target.value));
        },
        [onChange],
    );
    return <label>Max Results: <input type="number" value={value} onChange={handleChange} /></label>;
}