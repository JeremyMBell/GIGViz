import { Sex } from "../Sexes";

export interface IDataFetchResponse {
    location_id: number;
    location_name: string;
    sex_id: number;
    sex_name: Sex;
    year_id: number;
    year_name: string;
    mean: number;
    upper: number;
    lower: number;
}