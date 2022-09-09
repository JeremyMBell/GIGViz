import React, { CSSProperties } from "react";
import { CustomLabelProps } from "../../types/VictoryProps";
import { FlagLabel } from "./FlagLabel";

/**
 * Displays a tooltip for use with our bar chart visualization.
 * @prop style -- CSS styling of the component
 * @prop text -- a list of lines in the tooltip -- first line should always be the location name
 * @prop x -- x-coordinate of where the tooltip should render
 * @prop y -- y-coordinate of where the tooltip should render
 */
export const BarChartTooltip: React.FC<CustomLabelProps<'style' | 'text'>> = ({x, y, style, text}) => {
    if (!Array.isArray(text)) {
      return null;
    }
    const [locationName, ...info] = text;
    const styleProperties = style as CSSProperties;
    const fontSize = styleProperties.fontSize as number;
    const lineHeight = 1.1;
    const flagSize = fontSize*lineHeight;
    return (
      <g transform={`translate(${(x || 0)}, ${y || 0})`} style={styleProperties}>
        {/* rect is the tooltip background, since we remove the flyover due to it being more complicated than necessary. */}
        <rect x={-fontSize} y={-fontSize} width="100%" height={fontSize*lineHeight*text.length} fill="white" />
        <FlagLabel x={10} y={-flagSize + flagSize/8} text={locationName} flagSize={flagSize} />
        <text x={10 + flagSize} fontWeight='bolder'>
          {locationName}
        </text>
        {info.map((infoText, i) => <text key={infoText} y={styleProperties.fontSize as number * (i+1) * lineHeight}>{infoText}</text>)}
      </g>
    );
  };