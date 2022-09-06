import { useCallback } from 'react';

import './YearControl.css';
import React from 'react';
import { YearEventHandler } from '../../types/EventHandlers';


export interface IYearControlProps {
  max: number,
  min: number,
  step?: number,
  value: number,
  onChange: YearEventHandler,
}

export default function YearControl({ max, min, onChange, step = 1, value }: IYearControlProps) {
  const handelChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      onChange(parseInt(event.target.value));
    },
    [onChange],
  );

  return (
    <div className="control">
      <label className="control__label" htmlFor="year-control-input">
        Year
      </label>
      <input
        className="control-year__input"
        id="year-control-input"
        max={max}
        min={min}
        step={step}
        type="range"
        value={value}
        onChange={handelChange}
      />
      <span className="control-year__value">{value}</span>
    </div>
  );
}