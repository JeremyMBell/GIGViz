import React, { useEffect, useReducer } from 'react';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryTheme, VictoryTooltip } from 'victory';
import { FilterDataReducer, getData, IDataState } from '../../data-facade';
import { IDataFetchResponse } from '../../types/api/IDataFetchResponse';
import { IControlSelections } from '../../types/IControlSelections';
import './BarChartViz.css';
import { BarChartTooltip } from './BarChartTooltip';
import { FlagLabel } from './FlagLabel';

interface IVizProps {
  controlSelection: IControlSelections;
  data: IDataState;
  years: number[];
  dataFilter: FilterDataReducer<IDataFetchResponse>;
  staticTicks?: number[];
  title: string;
}

/**
 * Simple bar chart, with some incorporation of flags as labels for brevity
 * @param controlSelection -- controls that were selected in the ControlPanel component
 * @param data -- list of data that we have in memory
 * @param dataFilter -- a reducer for determining which data to display
 * @param staticTicks -- if provided, it's an array of ticks for the y axis, otherwise, will be dynamically calculated
 * @param title -- title of the graph (without the qualifying control information)
 */
export default function BarChartViz({controlSelection, data, dataFilter, staticTicks, title}: IVizProps) {
  const [filteredData, dispatchDataFilter] = useReducer(dataFilter, []);
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

  const chartTitle = [title, `for ${controlSelection.sex.toLowerCase()} in ${controlSelection.year}`];
  const titleFontSize = 12;
  const chartWidth = 600;
  return (
    <main className="BarChartViz">
      {dataToPlot && (
        <VictoryChart
          title={chartTitle.join(" ")}
          domainPadding={20}
          theme={VictoryTheme.material}
          width={chartWidth}
          height={350}>
          <VictoryLabel
            text={chartTitle}
            x={chartWidth/2}
            y={chartTitle.length * titleFontSize}
            textAnchor='middle'
            style={{fontSize: titleFontSize}} />
          <VictoryAxis
            dependentAxis
            label="Deaths per 100,000"
            tickValues={staticTicks}
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
