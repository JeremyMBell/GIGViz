import React, { useEffect, useReducer, useState } from 'react';
import { VictoryAxis, VictoryCandlestick, VictoryChart, VictoryLabel, VictoryLegend, VictoryTheme, VictoryTooltip } from 'victory';
import { DataFilters, deltaDataGenerator, IDataState } from '../../data-facade';
import './DeltaViz.css';
import { IControlSelections } from '../../types/IControlSelections';
import { FlagLabel } from './FlagLabel';
import { IYearDelta } from '../../types/IYearDelta';
import { BarChartTooltip } from './BarChartTooltip';

interface IDeltaVizProps {
    data: IDataState;
    controls: IControlSelections;
    staticTicks?: number[];
}

type MinMaxPerLocation = Record<string, [number, number]>;
type MinMaxYearPerLocation = Record<string, [number, number]>;

/**
 * Visualization that displays a candlestick for each country, and how it changes between years.
 * Candlestick max indicates max-value through all years
 * Candlestick min indicates min-value through all years
 * Candlestick box indicates start and end points (red means an increase in the year)
 * @param data - raw data from the server
 * @param controls - selections made in the control panel
 * @param staticTicks - (optional) list of numeric values to label on the y-axis. default: dynamic ticks
 */
export const DeltaViz: React.FC<IDeltaVizProps> = ({data, controls, staticTicks}) => {
    const [deltaData, dispatchDeltaData] = useReducer(deltaDataGenerator, []);
    const [filteredDeltaData, dispatchFilter] = useReducer(DataFilters.maxData<IYearDelta>(controls.numCountries), []);
    const [[minMaxPerLocation, minMaxYearPerLocation], setMinMaxPerLocation] = useState<[MinMaxPerLocation, MinMaxYearPerLocation]>([{}, {}]);

    useEffect(() => {
        dispatchDeltaData(data);
    }, [data]);

    useEffect(() => {
        /**
         * For the candlestick chart, we need a total min/max for the years.
         * So, we iterate over the years and get a min/max for each location.
         * We'll also mark the year because it's interesting for our tooltip.
         */
        setMinMaxPerLocation(
            deltaData.reduce(([newMinMax, newMinMaxYear]: [MinMaxPerLocation, MinMaxYearPerLocation], delta) => {
                if (delta.sex !== controls.sex) {
                    return [newMinMax, newMinMaxYear];
                }
                const currentValue = newMinMax[delta.location];
                const currentYearValue = newMinMaxYear[delta.location];
                // if it's in the map, commence compares!
                if (currentValue && currentYearValue) {
                    const [min, max] = currentValue;
                    // first item in tuple is a min
                    currentValue[0] = Math.min(min, delta.open, delta.close);
                    // second item in tuple is a max
                    currentValue[1] = Math.max(max, delta.open, delta.close);
                    // if the min adjusted, adjust the year to match when the max happened
                    if (min !== currentValue[0]) {
                        currentYearValue[0] = delta.open < delta.close ? delta.startYear : delta.endYear;
                    }
                    // if the max adjusted, adjust the year to match when the max happened
                    if (max !== currentValue[1]) {
                        currentYearValue[1] = delta.open < delta.close ? delta.endYear : delta.startYear;
                    }
                // if it's not in the map, then add an initial min/max value,
                // depending how delta.open compares to delta.close
                } else if (delta.open < delta.close) {
                    newMinMax[delta.location] = [delta.open, delta.close];
                    newMinMaxYear[delta.location] = [delta.startYear, delta.endYear];
                } else {
                    newMinMax[delta.location] = [delta.close, delta.open];
                    newMinMaxYear[delta.location] = [delta.endYear, delta.startYear];
                }
                return [newMinMax, newMinMaxYear];
            }, [{}, {}]),
        );
    }, [deltaData, controls.sex]);

    useEffect(() => {
        dispatchFilter({
            // on top of the filtering reducer, only include data that is selected
            data: deltaData.filter((delta) => delta.endYear === controls.year && delta.sex === controls.sex),
            compareKey: 'close'
        });
    }, [deltaData, controls]);

    const getMinMax = (datum: IYearDelta) => minMaxPerLocation[datum.location] || [];
    const getMinMaxYear = (datum: IYearDelta) => minMaxYearPerLocation[datum.location] || [];
    const chartTitle = [`${controls.year -1}-${controls.year} Change in Opioid Deaths`, `Among ${controls.sex}`];
    const titleFontSize = 16;
    const chartWidth = 600;
    const chartHeight = 350;
    const positive = '#ed6853';
    const negative = '#ffffff';
    const rightGutter = 200;
    
    return (
        <main className="DeltaViz">
            <VictoryChart
                width={chartWidth}
                height={chartHeight}
                domainPadding={{x: [20, rightGutter], y: [20,0 ]}}
                theme={VictoryTheme.material}
            >
                <VictoryLabel
                    text={chartTitle}
                    x={chartWidth/2}
                    y={chartTitle.length * titleFontSize}
                    textAnchor='middle'
                    style={{fontSize: titleFontSize}} />
                {filteredDeltaData.length === 0 && (
                    <VictoryLabel
                        text={`No data for range ${controls.year - 1}-${controls.year}`}
                        x={chartWidth/2}
                        y={chartHeight/2}
                        textAnchor="middle"
                    />
                )}
                <VictoryAxis 
                    tickLabelComponent={<FlagLabel flagSize={200/controls.numCountries} />}
                />
                <VictoryAxis
                    tickValues={staticTicks}
                    label="Deaths per 100,000"
                    axisLabelComponent={<VictoryLabel dy={-20} />}
                    dependentAxis
                />
                <VictoryLegend
                    title="Legend"
                    centerTitle
                    data={[
                        {name: 'Increase in Deaths', symbol: {fill: positive, type: 'square'}},
                        {name: 'Decrease in Deaths', symbol: {fill: negative, type: 'square'}}
                    ]}
                    x={chartWidth - rightGutter}
                    y={chartHeight/2}
                    style={{
                        border: {stroke: 'black'},
                        data: {stroke: 'black'},
                        parent: {fill: 'white'}
                    }}
                />
                {filteredDeltaData.length > 0 && (
                    <VictoryCandlestick
                        data={filteredDeltaData}
                        low={(datum) => getMinMax(datum as unknown as IYearDelta)[0]}
                        high={(datum) => getMinMax(datum as unknown as IYearDelta)[1]}
                        candleColors={{positive, negative}}
                        labels={({datum}) => {
                            const [low, high] = getMinMax(datum);
                            const [lowYear, highYear] = getMinMaxYear(datum);
                            
                            return [
                                datum.location,
                                `${datum.startYear} deaths per 100,000: ${datum.open.toFixed(4)}`,
                                `${datum.endYear} deaths per 100,000: ${datum.close.toFixed(4)}`,
                                `${datum.startYear}-${datum.endYear} change: ${datum.delta > 0 ? '+' : ''}${datum.delta.toFixed(4)}`,
                                `---`,
                                `Year with LEAST deaths: ${lowYear}`,
                                `${low.toFixed(4)} deaths per 100,000`,
                                `---`,
                                `Year with MOST deaths: ${highYear}`,
                                `${high.toFixed(4)} deaths per 100,000`,
                            ];
                        }}
                        labelComponent={
                            <VictoryTooltip
                                flyoutComponent={<></>} // flyout gets in the way
                                flyoutWidth={1}
                                labelComponent={<BarChartTooltip />}
                            />}
                    />)}
            </VictoryChart>
        </main>
    );
};