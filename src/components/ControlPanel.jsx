import { useCallback, useState } from 'react';

import { SexControl, YearControl }  from './controls';

import './ControlPanel.css';

export default function ControlPanel() {
  const [sex, setSex] = useState('Females');
  const [year, setYear] = useState(2017);

  const handelSexChange = useCallback(
    (nextValue) => {
      setSex(nextValue);
    },
    [setSex],
  );

  const handelYearChange = useCallback(
    (nextValue) => {
      setYear(nextValue);
    },
    [setYear],
  );

  return (
    <div className="control-panel">
      <SexControl value={sex} onChange={handelSexChange} />
      <YearControl max={2017} min={1990} value={year} onChange={handelYearChange} />
    </div>
  );
}
