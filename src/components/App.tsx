import React, { useReducer, useState } from 'react';
import { useEffect } from 'react';

import * as api from '../api';
import { IMetadataResponse } from '../types/api/IMetadataResponse';
import ControlPanel from './ControlPanel';
import Viz from './Viz';

export default function App() {
  const [metadata, setMetadata] = useState<IMetadataResponse>();
  const [citation, setCitation] = useState<string>();
  useEffect(() => {
    api.fetchMetadata().then(setMetadata);
    api.fetchCitation().then(setCitation);
  }, []);

  return (
    <div className="App">
      <ControlPanel metadata={metadata} />
      <Viz />
      {citation && <pre>{citation}</pre>}
    </div>
  );
}
