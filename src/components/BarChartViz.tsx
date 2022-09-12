import React, { useEffect, useReducer, useState } from 'react';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryTheme, VictoryTooltip } from 'victory';
import { DataFilters, FilterDataReducer, getData, IDataState } from '../data-facade';
import { IDataFetchResponse } from '../types/api/IDataFetchResponse';
import { IControlSelections } from '../types/IControlSelections';
import './Viz.css';
import { BarChartTooltip } from './viz/BarChartTooltip';
import { FlagLabel } from './viz/FlagLabel';

interface IVizProps {
  controlSelection: IControlSelections;
  data: IDataState;
  years: number[];
  dataFilter: FilterDataReducer;
  staticTicks?: boolean;
  title: string;
}

/**
 * Simple bar chart, with some incorporation of flags as labels for brevity
 * @param controlSelection -- controls that were selected in the ControlPanel component
 * @param data -- list of data that we have in memory
 * @param dataFilter -- a reducer for determining which data to display
 * @param staticTicks -- true if the ticks will be precalculated, rather than calculated by its plot data
 * @param title -- title of the graph (without the qualifying control information)
 */
export default function BarChartViz({controlSelection, data, dataFilter, staticTicks, title}: IVizProps) {
  const [filteredData, dispatchDataFilter] = useReducer(dataFilter, []);
  const [ticks, setTicks] = useState<number[]>();
  const tickSpacing = 5;
  const dataToPlot = getData(data, controlSelection);
  const y = 'mean';

  /**
   * Filters data if data exists
   */
  useEffect(() => {
    if (dataToPlot) {
      dispatchDataFilter({
        compareKey: y,
        data: dataToPlot,
      });
    }
  }, [dataToPlot]);

  useEffect(() => {
    if (!staticTicks) {
      return;
    }
    const findYValue = (datum: IDataFetchResponse) => datum[y];
    const ys = Object.values(data.values)
      .flatMap((value) => value.map(findYValue));
    const minValue = Math.floor(Math.min(0, ...ys)/tickSpacing);
    const maxValue = Math.ceil(Math.max(...ys)/tickSpacing);
    const ticks = [];
    for (let i = minValue; i <= maxValue; i++) {
      ticks.push(i*tickSpacing);
    }
    setTicks(ticks);
  }, [data]);

  const chartTitle = [title, `for ${controlSelection.sex.toLowerCase()} in ${controlSelection.year}`];
  const titleFontSize = 12;
  const chartWidth = 400;
  return (
    <main className="BarChartViz">
      {dataToPlot && (
        <VictoryChart
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
            tickValues={staticTicks ? ticks : undefined}
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
            y={y}
          />
      </VictoryChart>
      )}
    </main>
  );
}
