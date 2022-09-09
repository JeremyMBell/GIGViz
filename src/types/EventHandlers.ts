import { IControlSelections } from './IControlSelections';
import {Sex} from './Sexes';
export type NumEventHandler = (value: number) => void;
export type BoolEventHandler = (value: boolean) => void;
export type SexEventHandler = (value: Sex) => void;
export type ControlEventHandler = (value: IControlSelections) => void;