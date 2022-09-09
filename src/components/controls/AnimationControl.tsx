import type { BoolEventHandler } from "../../types/EventHandlers";
import React from 'react';

interface IAnimationControl {
    value?: boolean;
    onChange: BoolEventHandler;
}
/**
 * Control that steps through each year and updates the viz
 */
export const AnimationControl: React.FC<IAnimationControl> = ({value, onChange}) => {
    return (<button onClick={onChange.bind(null, !value)}>{value ? 'Stop ' : 'Start '} Playback</button>);
};