import { useCallback, useState } from 'react';

import { SexControl, YearControl }  from './controls';

import './ControlPanel.css';
import React from 'react';
import { SexEventHandler, YearEventHandler } from '../types/EventHandlers';
import { Sex } from '../types/Sexes';
import { IMetadataResponse } from '../types/api/IMetadataResponse';

interface IControlPanelProps {
  metadata?: IMetadataResponse;
}
export default function ControlPanel({metadata}: IControlPanelProps) {
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
      {!metadata && <span>Loading...</span>}
      {metadata && (<>
        <SexControl sexes={metadata.sex} value={sex} onChange={handelSexChange} />
        <YearControl years={metadata.year} value={year} onChange={handelYearChange} />
      </>)}
    </div>
  );
}
