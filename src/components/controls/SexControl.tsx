import { Fragment, useCallback } from 'react';
import React from 'react';
import { Sex } from '../../types/Sexes';
import { SexEventHandler } from '../../types/EventHandlers';

const options = Object.values(Sex).map((sex) => ({
  value: sex,
  label: sex,
}));

export interface ISexControlProps {
  value: Sex,
  onChange: SexEventHandler,
}


export default function SexControl({ onChange, value }: ISexControlProps) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value as Sex);
    },
    [onChange],
  );

  return (
    <div className="control">
      <span className="control__label">Sex</span>
      <div className="selector-sex__options">
        {options.map((option) => (
          <Fragment key={option.value}>
            <input
              checked={option.value === value}
              id={`sex-control-option-${option.value}`}
              name="sex-control"
              type="radio"
              value={option.value}
              onChange={handleChange}
            />
            <label htmlFor={`sex-control-option-${option.value}`}>{option.label}</label>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
