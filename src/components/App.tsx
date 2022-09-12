import React, { useReducer, useState } from 'react';
import { useEffect } from 'react';

import * as api from '../api';
import { DataFilters, dataReducer, fetchDataWithControls, hashControls } from '../data-facade';
import { calculateLocations, calculateSexes, calculateYears, fetchMetadata } from '../metadata-facade';
import { IControlSelections } from '../types/IControlSelections';
import ControlPanel from './ControlPanel';
import Viz from './Viz';
import './App.css';

export default function App() {
  const [years, dispatchYearMetadata] = useReducer(calculateYears, []);
  const [sexes, dispatchSexMetadata] = useReducer(calculateSexes, []);
  const [locations, dispatchLocationMetadata] = useReducer(calculateLocations, []);
  const [citation, setCitation] = useState<string>();
  const [controlSelection, setControlSelection] = useState<IControlSelections>();
  const [data, dispatchData] = useReducer(dataReducer, {values: {}});
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
  return (
    <div className="App">
      <ControlPanel
        years={years}
        sexes={sexes}
        onControlChange={setControlSelection} />
      {controlSelection && (
        <div className="visualizations">
          <Viz
            years={years}
            controlSelection={controlSelection}
            data={data}
            dataFilter={DataFilters.maxData(controlSelection.numCountries)}
            title="Countries with Most Opioid Deaths per capita"
            staticTicks
          />
          <Viz
            years={years}
            controlSelection={controlSelection}
            data={data}
            dataFilter={DataFilters.minData(controlSelection.numCountries)}
            title="Countries with Least Opioid Deaths per capita"
          />
        </div>
      )}
      {citation && <pre>{citation}</pre>}
    </div>
  );
}
