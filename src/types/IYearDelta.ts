import { Sex } from "./Sexes";

export interface IYearDelta {
    startYear: number;
    endYear: number;
    delta: number;
    open: number;
    close: number;
    sex: Sex;
    location: string;
    x: string;
}