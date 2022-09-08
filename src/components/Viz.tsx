import React, { useEffect, useReducer } from 'react';
import { dataReducer, fetchDataWithControls } from '../data-facade';
import { ILocationMetadata } from '../types/api/ILocationMetadata';
import { IControlSelections } from '../types/IControlSelections';
import './Viz.css';

interface IVizProps {
  controlSelection: IControlSelections;
  locations: ILocationMetadata[];
}
export default function Viz({controlSelection, locations}: IVizProps) {
  const [[dataKey, data], dispatchData] = useReducer(dataReducer, ['', new Map()]);
  useEffect(() => {
    fetchDataWithControls(controlSelection, locations)
      .then(payload => dispatchData({
        controls: controlSelection,
        payload,
      }));
  }, [controlSelection, locations]);
  return (
    <main className="viz">
      <p>Selected {controlSelection.sex} and {controlSelection.year}.</p>
      <p>Selected Data:</p>
      <pre>{JSON.stringify(data.get(dataKey), null, 4)}</pre>
    </main>
  );
}
