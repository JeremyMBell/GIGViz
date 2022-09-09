import React, { useEffect, useReducer } from 'react';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryContainer, VictoryLabel, VictoryTheme, VictoryTooltip } from 'victory';
import { DataFilters, dataReducer, fetchDataWithControls, hashControls } from '../data-facade';
import { ILocationMetadata } from '../types/api/ILocationMetadata';
import { IControlSelections } from '../types/IControlSelections';
import './Viz.css';
import { BarChartTooltip } from './viz/BarChartTooltip';
import { FlagLabel } from './viz/FlagLabel';

interface IVizProps {
  controlSelection: IControlSelections;
  locations: ILocationMetadata[];
}

/**
 * Simple bar chart, with some incorporation of flags as labels for brevity
 */
export default function Viz({controlSelection, locations}: IVizProps) {
  const [[dataKey, data], dispatchData] = useReducer(dataReducer, ['', new Map()]);
  const [filteredData, dispatchDataFilter] = useReducer(DataFilters.maxData(controlSelection.numCountries), []);
  const dataToPlot = data.get(dataKey);
  /**
   * Fetches data; if we need to
   */
  useEffect(() => {
    if (data.has(hashControls(controlSelection))) {
      return;
    }

    fetchDataWithControls(controlSelection, locations)
      .then(payload => dispatchData({
        controls: controlSelection,
        payload,
      }));
  }, [controlSelection, locations]);

  /**
   * Filters data if data exists
   */
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
  const chartTitle = [`Opioid Deaths per 100,000 for`, `${controlSelection.sex.toLowerCase()} in ${controlSelection.year}`];
  const titleFontSize = 12;
  const chartWidth = 400;
  return (
    <main className="BarChartViz">
      {dataToPlot && (
        <VictoryChart
          animate={controlSelection.animate ? {duration: 100} : {}}
          title={chartTitle.join(" ")}
          domainPadding={20}
          theme={VictoryTheme.material}
          width={chartWidth}
          height={250}>
          <VictoryLabel
            text={chartTitle}
            x={chartWidth/2}
            y={chartTitle.length * titleFontSize}
            textAnchor='middle'
            style={{fontSize: titleFontSize}} />
          <VictoryAxis
            dependentAxis
            label="Deaths per 100,000"
            axisLabelComponent={<VictoryLabel dy={-20} />}
          />
          <VictoryAxis
            tickLabelComponent={<FlagLabel flagSize={200/controlSelection.numCountries} />}
          />
          <VictoryBar
            data={filteredData}
            labels={({datum}) => [
              datum.location_name,
              ` ${(datum.lower as number).toFixed(4)} - ${(datum.upper as number).toFixed(4)} deaths per 100,000`,
              `Average: ${(datum.mean as number).toFixed(4)} deaths per 100,000`,
            ]}
            labelComponent={<VictoryTooltip flyoutComponent={<></>} labelComponent={<BarChartTooltip />} />}
            x="location_name"
            y="mean"
            sortKey="mean"
          />
      </VictoryChart>
      )}
    </main>
  );
}
