import { IControlSelections } from './IControlSelections';
import {Sex} from './Sexes';
export type YearEventHandler = (value: number) => void;
export type SexEventHandler = (value: Sex) => void;
export type ControlEventHandler = (value: IControlSelections) => void;