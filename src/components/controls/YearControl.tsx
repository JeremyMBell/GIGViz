import { useCallback, useEffect, useReducer } from 'react';

import './YearControl.css';
import React from 'react';
import { YearEventHandler } from '../../types/EventHandlers';
import { IYearMetadata } from '../../types/api/IYearMetadata';


export interface IYearControlProps {
  years: IYearMetadata[];
  step?: number,
  value: number,
  onChange: YearEventHandler,
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

export default function YearControl({ years, onChange, step = 1, value }: IYearControlProps) {
  const handelChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      onChange(parseInt(event.target.value));
    },
    [onChange],
  );

  const [[min, max], updateYears] = useReducer(calculateYears, defaultYears);

  useEffect(() => {
    updateYears(undefined); // reset the years
    years.forEach(updateYears);
  }, [years]);

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