import { useCallback, useState } from 'react';

import { SexControl, YearControl }  from './controls';

import './ControlPanel.css';
import React from 'react';
import { SexEventHandler, YearEventHandler } from '../types/EventHandlers';
import { Sex } from '../types/Sexes';

export default function ControlPanel() {
  const [sex, setSex] = useState<Sex>(Sex.Female);
  const [year, setYear] = useState<number>(2017);

  const handelSexChange = useCallback<SexEventHandler>(
    (nextValue) => {
      setSex(nextValue);
    },
    [setSex],
  );

  const handelYearChange = useCallback<YearEventHandler>(
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
