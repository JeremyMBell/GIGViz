import { Fragment, useCallback } from 'react';
import React from 'react';
import { Sex } from '../../types/Sexes';
import { SexEventHandler } from '../../types/EventHandlers';
import { ISexMetadata } from '../../types/api/ISexMetadata';

export interface ISexControlProps {
  value: Sex,
  onChange: SexEventHandler,
  sexes: Sex[];
}

export default function SexControl({ onChange, value, sexes }: ISexControlProps) {
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
        {sexes.length === 0 && <span>Loading sexes...</span>}
        {sexes.map((sex) => (
          <Fragment key={sex}>
            <input
              checked={sex === value}
              id={`sex-control-option-${sex}`}
              name="sex-control"
              type="radio"
              value={sex}
              onChange={handleChange}
            />
            <label htmlFor={`sex-control-option-${sex}`}>{sex}</label>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
