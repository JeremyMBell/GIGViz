import { useEffect } from 'react';

import * as api from '../api';
import ControlPanel from './ControlPanel';
import Viz from './Viz';

export default function App() {
  // Example of how you could fetch data
  useEffect(() => {
    async function fetchData() {
      const metadata = await api.fetchMetadata();
      const citation = await api.fetchCitation();
      const data = await api.fetchData({
        location_name: ['Belize', 'Venezuela'],
        year_name: [1990, 2015],
        sex_name: ['Males', 'Females'],
      });
      console.log({ metadata, citation, data });
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <ControlPanel />
      <Viz />
    </div>
  );
}
