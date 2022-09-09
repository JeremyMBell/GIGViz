import { Sex } from "./Sexes";

export interface IControlSelections {
    sex: Sex;
    year: number;
    numCountries: number;
    animate?: boolean;
}