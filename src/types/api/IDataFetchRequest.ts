import { Sex } from "../Sexes";
type OneOrMany<T> = T | T[];
export interface IDataFetchRequest {
    location_id?: OneOrMany<number>;
    location_name?: OneOrMany<string>;
    year_id?: OneOrMany<number>;
    year_name?: OneOrMany<string>;
    sex_id?: OneOrMany<number>;
    sex_name?: OneOrMany<Sex>;
}