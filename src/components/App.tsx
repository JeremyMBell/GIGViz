import React, { useReducer, useState } from 'react';
import { useEffect } from 'react';

import * as api from '../api';
import { DataFilters, dataReducer, fetchDataWithControls, hashControls } from '../data-facade';
import { calculateLocations, calculateSexes, calculateYears, fetchMetadata } from '../metadata-facade';
import { IControlSelections } from '../types/IControlSelections';
import ControlPanel from './ControlPanel';
import BarChartViz from './viz/BarChartViz';
import './App.css';
import { DeltaViz } from './viz/DeltaViz';
import { IDataFetchResponse } from '../types/api/IDataFetchResponse';
import { flagHref } from './viz/FlagLabel';

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
      <h3>Opioid Deaths over the Years</h3>
      <p>
        The Institute for Health Metrics and Evaluation (IHME) has collected data from 1990 to 2017 regarding opioid deaths.
        Below, indicates the impact the opioid crisis has had on the international community.
      </p>
      <p>
        In 2017, the <strong><img src={flagHref("USA")} className='flag' /> United States of America </strong>
        hit the peak number of deaths among both sexes at 14.57 deaths per 100,000. The USA had a significant gap of opioid deaths between the sexes in 2017.
        Males in the country died at a rate of 19.55 per 100,000 while females died at a rate of 9.75 per 100,000.

        However, <strong><img src={flagHref("South Africa")} className='flag' /> South Africa</strong> was able to significantly
        reduce their opioid deaths from 7.25 deaths per 100,000 in 1997 to 0.56 deaths per 100,000 in 2014.
      </p>
      <p>
        Below, you may be able to view the death rates for the most impacted countries.
        On the left, you will see the worst death rates for the current year.
        On the right, you will see the changes between years, with indicators showing the least and most deadly years for each country.
        You may step through each year via the playback button in the controls.
      </p>
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
