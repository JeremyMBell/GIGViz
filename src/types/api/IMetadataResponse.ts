import { ILocationMetadata } from "./ILocationMetadata";
import { ISexMetadata } from "./ISexMetadata";
import { IYearMetadata } from "./IYearMetadata";

export interface IMetadataResponse {
    location: ILocationMetadata[];
    sex: ISexMetadata[];
    year: IYearMetadata[];
}