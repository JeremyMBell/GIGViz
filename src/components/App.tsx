import React, { useReducer, useState } from 'react';
import { useEffect } from 'react';

import * as api from '../api';
import { DataFilters, dataReducer, fetchDataWithControls, hashControls } from '../data-facade';
import { calculateLocations, calculateSexes, calculateYears, fetchMetadata } from '../metadata-facade';
import { IControlSelections } from '../types/IControlSelections';
import ControlPanel from './ControlPanel';
import BarChartViz from './BarChartViz';
import './App.css';
import { DeltaViz } from './viz/DeltaViz';
import { IDataFetchResponse } from '../types/api/IDataFetchResponse';

export default function App() {
  const [years, dispatchYearMetadata] = useReducer(calculateYears, []);
  const [sexes, dispatchSexMetadata] = useReducer(calculateSexes, []);
  const [locations, dispatchLocationMetadata] = useReducer(calculateLocations, []);
  const [citation, setCitation] = useState<string>();
  const [controlSelection, setControlSelection] = useState<IControlSelections>();
  const [data, dispatchData] = useReducer(dataReducer, {values: {}});
  const [ticks, setTicks] = useState<number[]>();
  useEffect(() => {
    fetchMetadata(dispatchYearMetadata, dispatchSexMetadata, dispatchLocationMetadata);
    api.fetchCitation().then(setCitation);
  }, []);
  useEffect(() => {
    if (!controlSelection) {
      return;
    }

    /**
     * Fetches data; if we need to for all years in parallel
     */
    Promise.all(years.map((year) =>
      fetchDataWithControls(
        data,
        {
          ...controlSelection,
          year,
        },
        locations,
        dispatchData
    )));
  }, [controlSelection && controlSelection.sex, locations, years]);
  
  useEffect(() => {
    const tickSpacing = 5;
    const findYValue = (datum: IDataFetchResponse) => datum.mean;
    const ys = Object.values(data.values).flat().map(findYValue);
    const minValue = Math.floor(Math.min(0, ...ys)/tickSpacing);
    const maxValue = Math.ceil(Math.max(...ys)/tickSpacing);
    const ticks = [];
    for (let i = minValue; i <= maxValue; i++) {
      ticks.push(i*tickSpacing);
    }
    setTicks(ticks);
  }, [data]);
  return (
    <div className="App">
      <ControlPanel
        years={years}
        sexes={sexes}
        onControlChange={setControlSelection} />
      {controlSelection && (
        <div className="visualizations">
          <BarChartViz
            years={years}
            controlSelection={controlSelection}
            data={data}
            dataFilter={DataFilters.maxData<IDataFetchResponse>(controlSelection.numCountries)}
            title="Countries with Most Opioid Deaths per capita"
            staticTicks={ticks}
          />
          <DeltaViz
            controls={controlSelection}
            data={data}
            staticTicks={ticks}
          />
        </div>
      )}
      {citation && <pre>{citation}</pre>}
    </div>
  );
}
