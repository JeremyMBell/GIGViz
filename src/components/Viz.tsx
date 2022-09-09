import React, { CSSProperties, useEffect, useReducer } from 'react';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryLabelProps, VictoryTheme, VictoryTooltip } from 'victory';
import { DataFilters, dataReducer, fetchDataWithControls } from '../data-facade';
import { ILocationMetadata } from '../types/api/ILocationMetadata';
import { IControlSelections } from '../types/IControlSelections';
import './Viz.css';

interface IVizProps {
  controlSelection: IControlSelections;
  locations: ILocationMetadata[];
}
const DEFAULT_FLAG_SIZE = 20;
type CustomLabelProps<T extends keyof VictoryLabelProps = 'x'> = Pick<VictoryLabelProps, 'x' | 'y' | T>;
const FlagLabel: React.FC<CustomLabelProps<'text'> & {flagSize?: number}> = ({text, x, y, flagSize=DEFAULT_FLAG_SIZE}) => {
  const locationName = typeof text === 'string' ? text : '';
  return (
    <image
      href={`https://countryflagsapi.com/png/${locationName.toLowerCase()}`}
      x={(x || 0) - flagSize/2 }
      y={y}
      width={flagSize}
      height={flagSize}
    />
  );
};
const Tooltip: React.FC<CustomLabelProps<'style' | 'text'>> = ({x, y, style, text}) => {
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
      <rect x={-fontSize} y={-fontSize} width="100%" height={fontSize*lineHeight*text.length} fill="white" />
      <FlagLabel x={10} y={-flagSize + flagSize/8} text={locationName} flagSize={flagSize} />
      <text x={10 + flagSize} fontWeight='bolder'>
        {locationName}
      </text>
      {info.map((infoText, i) => <text key={infoText} y={styleProperties.fontSize as number * (i+1) * lineHeight}>{infoText}</text>)}
    </g>
  );
};
export default function Viz({controlSelection, locations}: IVizProps) {
  const [[dataKey, data], dispatchData] = useReducer(dataReducer, ['', new Map()]);
  const [filteredData, dispatchDataFilter] = useReducer(DataFilters.maxData(10), []);
  const dataToPlot = data.get(dataKey);
  useEffect(() => {
    fetchDataWithControls(controlSelection, locations)
      .then(payload => dispatchData({
        controls: controlSelection,
        payload,
      }));
  }, [controlSelection, locations]);
  useEffect(() => {
    if (dataToPlot) {
      dispatchDataFilter(undefined); // reset the filteredData
      dataToPlot.forEach(item => {
        dispatchDataFilter({
          compareKey: 'mean',
          item,
        });
      });
    }
  }, [dataToPlot]);

  return (
    <main className="viz" style={{width: 500}}>
      {dataToPlot && (
        <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
          <VictoryAxis
            dependentAxis
            label="Deaths per 100,000"
            axisLabelComponent={<VictoryLabel dy={-20} />}
          />
          <VictoryAxis
            tickLabelComponent={<FlagLabel />}
          />
          <VictoryBar
            data={filteredData}
            labels={({datum}) => [
              datum.location_name,
              ` ${(datum.lower as number).toFixed(4)} - ${(datum.upper as number).toFixed(4)} deaths per 100,000`,
              `Average: ${(datum.mean as number).toFixed(4)} deaths per 100,000`,
            ]}
            labelComponent={<VictoryTooltip flyoutComponent={<></>} labelComponent={<Tooltip />} />}
            x="location_name"
            y="mean"
            sortKey="mean"
          />
      </VictoryChart>
      )}
    </main>
  );
}
