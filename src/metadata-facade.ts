import { Dispatch } from "react";
import { fetchLocationMetadata, fetchSexMetadata, fetchYearMetadata } from "./api";
import { ILocationMetadata } from "./types/api/ILocationMetadata";
import { ISexMetadata } from "./types/api/ISexMetadata";
import { IYearMetadata } from "./types/api/IYearMetadata";
import { Sex } from "./types/Sexes";

export function calculateYears(_: number[], years: IYearMetadata[]): number[] {
  return years.map((year) => year.year_id).sort();
}

export function calculateSexes(_: Sex[], sexes: ISexMetadata[]): Sex[] {
    return sexes.map((sex) => sex.sex_name).sort();
}

export function calculateLocations(_: string[], locations: ILocationMetadata[]): string[] {
    return locations.map((location) => location.location_name).sort();
}

export async function fetchMetadata(
    dispatchYears: Dispatch<IYearMetadata[]>,
    dispatchSexes: Dispatch<ISexMetadata[]>,
    dispatchLocation: Dispatch<ILocationMetadata[]>
) {
    return Promise.all([
        fetchYearMetadata().then(dispatchYears),
        fetchSexMetadata().then(dispatchSexes),
        fetchLocationMetadata().then(dispatchLocation),
    ]);
}