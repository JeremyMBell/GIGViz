import { Sex } from "../Sexes";

export interface ISexMetadata {
    sex_id: number;
    sex_name: Sex;
    sex_short_name: string;
    sort: number;
}