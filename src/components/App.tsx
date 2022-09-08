import React, { useReducer, useState } from 'react';
import { useEffect } from 'react';

import * as api from '../api';
import { IMetadataResponse } from '../types/api/IMetadataResponse';
import { IControlSelections } from '../types/IControlSelections';
import ControlPanel from './ControlPanel';
import Viz from './Viz';

export default function App() {
  const [metadata, setMetadata] = useState<IMetadataResponse>();
  const [citation, setCitation] = useState<string>();
  const [controlSelection, setControlSelection] = useState<IControlSelections>();
  useEffect(() => {
    api.fetchMetadata().then(setMetadata);
    api.fetchCitation().then(setCitation);
  }, []);

  return (
    <div className="App">
      <ControlPanel metadata={metadata} onControlChange={setControlSelection} />
      {controlSelection && metadata && (
        <Viz
          controlSelection={controlSelection}
          locations={metadata.location}
        />
      )}
      {citation && <pre>{citation}</pre>}
    </div>
  );
}
