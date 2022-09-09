import { useCallback, useEffect, useReducer, useState } from 'react';

import { SexControl, YearControl }  from './controls';

import './ControlPanel.css';
import React from 'react';
import { ControlEventHandler, SexEventHandler, NumEventHandler, BoolEventHandler } from '../types/EventHandlers';
import { Sex } from '../types/Sexes';
import { IMetadataResponse } from '../types/api/IMetadataResponse';
import { IControlSelections } from '../types/IControlSelections';
import { NumControl } from './controls/NumControl';
import { AnimationControl } from './controls/AnimationControl';

interface IControlPanelProps {
  metadata?: IMetadataResponse;
  onControlChange: ControlEventHandler;
}

function controlSelectionReducer(state: IControlSelections, action: {type: string, payload: IControlSelections}): IControlSelections {
  switch(action.type) {
    case 'set':
      return action.payload;
  }
  return state;
}

export default function ControlPanel({metadata, onControlChange}: IControlPanelProps) {
  const [selections, dispatchControlSelection] = useReducer(controlSelectionReducer, {sex: Sex.Both, year: 1990, numCountries: 10});
  const handleControlChange = useCallback((payload: IControlSelections) => {
    dispatchControlSelection({
      type: 'set',
      payload,
    });
    onControlChange(payload);
  }, [selections, onControlChange]);

  const handleSexChange = useCallback<SexEventHandler>(
    (sex) => handleControlChange({...selections, sex}),
    [selections],
  );

  const handleYearChange = useCallback<NumEventHandler>(
    (year) => handleControlChange({...selections, year}),
    [selections],
  );

  const handleNumChange = useCallback<NumEventHandler>(
    (numCountries) => handleControlChange({...selections, numCountries}),
    [selections],
  );

  const handleAnimationChange = useCallback<BoolEventHandler>(
    (animate) => handleControlChange({...selections, animate}),
    [selections],
  );

  useEffect(() => onControlChange(selections), [!metadata]);

  return (
    <div className="control-panel">
      {!metadata && <span>Loading...</span>}
      {metadata && (<>
        <SexControl sexes={metadata.sex} value={selections.sex} onChange={handleSexChange} />
        <YearControl years={metadata.year} value={selections.year} onChange={handleYearChange} animate={selections.animate}  />
        <NumControl value={selections.numCountries} onChange={handleNumChange} />
        <AnimationControl value={selections.animate} onChange={handleAnimationChange} />
      </>)}
    </div>
  );
}
