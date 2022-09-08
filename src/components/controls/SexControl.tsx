import { Fragment, useCallback } from 'react';
import React from 'react';
import { Sex } from '../../types/Sexes';
import { SexEventHandler } from '../../types/EventHandlers';
import { ISexMetadata } from '../../types/api/ISexMetadata';

export interface ISexControlProps {
  value: Sex,
  onChange: SexEventHandler,
  sexes: ISexMetadata[];
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
        {sexes.map((option) => (
          <Fragment key={option.sex_id}>
            <input
              checked={option.sex_name === value}
              id={`sex-control-option-${option.sex_id}`}
              name="sex-control"
              type="radio"
              value={option.sex_name}
              onChange={handleChange}
            />
            <label htmlFor={`sex-control-option-${option.sex_id}`}>{option.sex_name}</label>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
