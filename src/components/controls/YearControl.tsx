import { useCallback, useEffect, useReducer, useState } from 'react';

import './YearControl.css';
import React from 'react';
import { NumEventHandler } from '../../types/EventHandlers';
import { IYearMetadata } from '../../types/api/IYearMetadata';


export interface IYearControlProps {
  years: IYearMetadata[];
  step?: number;
  value: number;
  onChange: NumEventHandler;
  animate?: boolean;
}

type YearRange = [number, number];
const defaultYears: YearRange = [Infinity, -Infinity];

function calculateYears([min, max]: YearRange, year: IYearMetadata | undefined): YearRange {
  if (year) {
    return [Math.min(min, year.year_id), Math.max(max, year.year_id)];
  } else {
    return defaultYears;
  }
}

export default function YearControl({ years, onChange, step = 1, value, animate }: IYearControlProps) {
  const handelChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      onChange(parseInt(event.target.value));
    },
    [onChange],
  );

  const [[min, max], updateYears] = useReducer(calculateYears, defaultYears);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  /**
   * Populates year slider
   */
  useEffect(() => {
    updateYears(undefined); // reset the years
    years.forEach(updateYears);
  }, [years]);

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