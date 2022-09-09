import type { CustomLabelProps } from "../../types/VictoryProps";
import React from 'react';

const DEFAULT_FLAG_SIZE = 20;
/**
 * Displays Flag as if it were a label
 * @prop text -- the name of the location
 * @prop flagSize -- how large the flag should render\
 * @prop x -- x-coordinate where the flag should be rendered
 * @prop y -- y-coordinate where the flag should be rendered
 */
export const FlagLabel: React.FC<CustomLabelProps<'text'> & {flagSize?: number}> = ({text, x, y, flagSize=DEFAULT_FLAG_SIZE}) => {
  const locationName = typeof text === 'string' ? text : '';
  const imageX = (x || 0) - flagSize/2;
  return (
    <g className="FlagLabel">
        <image
        href={`https://countryflagsapi.com/png/${locationName.toLowerCase()}`}
        x={imageX}
        y={y}
        width={flagSize}
        height={flagSize}
        />
    </g>
  );
};