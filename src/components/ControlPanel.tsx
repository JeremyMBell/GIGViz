import { useCallback, useState } from 'react';

import { SexControl, YearControl }  from './controls';

import './ControlPanel.css';
import React from 'react';
import { ControlEventHandler, SexEventHandler, YearEventHandler } from '../types/EventHandlers';
import { Sex } from '../types/Sexes';
import { IMetadataResponse } from '../types/api/IMetadataResponse';
import { IControlSelections } from '../types/IControlSelections';

interface IControlPanelProps {
  metadata?: IMetadataResponse;
  onControlChange: ControlEventHandler;
}
export default function ControlPanel({metadata, onControlChange}: IControlPanelProps) {
  const [{sex, year}, setSelections] = useState<IControlSelections>({sex: Sex.Female, year: 2017});
  const handleControlChange = useCallback<ControlEventHandler>((nextValue) => {
    setSelections(nextValue);
    onControlChange(nextValue);
  }, [setSelections, onControlChange]);

  const handleSexChange = useCallback<SexEventHandler>(
    (nextValue) => handleControlChange({year, sex: nextValue}),
    [handleControlChange],
  );

  const handleYearChange = useCallback<YearEventHandler>(
    (nextValue) => handleControlChange({year: nextValue, sex}),
    [handleControlChange],
  );

  return (
    <div className="control-panel">
      {!metadata && <span>Loading...</span>}
      {metadata && (<>
        <SexControl sexes={metadata.sex} value={sex} onChange={handleSexChange} />
        <YearControl years={metadata.year} value={year} onChange={handleYearChange} />
      </>)}
    </div>
  );
}
