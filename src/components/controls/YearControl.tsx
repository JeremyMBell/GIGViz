import { useCallback, useEffect, useReducer, useState } from 'react';

import './YearControl.css';
import React from 'react';
import { NumEventHandler } from '../../types/EventHandlers';


export interface IYearControlProps {
  years: number[];
  step?: number;
  value: number;
  onChange: NumEventHandler;
  animate?: boolean;
}

export default function YearControl({ years, onChange, step = 1, value, animate }: IYearControlProps) {
  const handelChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      onChange(parseInt(event.target.value));
    },
    [onChange],
  );
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const min = Math.min(...years);
  const max = Math.max(...years);

  /**
   * Increments years on a timer
   * shouldAnimate indicates a rendering frame that we should update the years
   */
  useEffect(() => {
    if (animate && shouldAnimate && value < max) {
      setShouldAnimate(false);
      onChange(value + 1);
      setTimeout(() => setShouldAnimate(true), 1000);
    }
  }, [new Date(), value, animate, shouldAnimate]);

  return (
    <div className="control">
      <label className="control__label" htmlFor="year-control-input">
        Year
      </label>
      {years.length === 0 && <span>Loading years...</span>}
      {years.length > 0 && (
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
      )}
      <span className="control-year__value">{value}</span>
    </div>
  );
}