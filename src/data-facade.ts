import { fetchData } from "./api";
import { IDataFetchResponse } from "./types/api/IDataFetchResponse";
import { ILocationMetadata } from "./types/api/ILocationMetadata";
import { IControlSelections } from "./types/IControlSelections";

export interface IDataReducerAction {
    controls: IControlSelections;
    payload: IDataFetchResponse;
}

export type DataState<T extends string = string> = [T, Map<T, IDataFetchResponse>];

export function fetchDataWithControls(controls: IControlSelections, locations: ILocationMetadata[]): Promise<IDataFetchResponse> {
    return fetchData({
        sex_name: controls.sex,
        year_id: controls.year,
        location_id: locations.map((location) => location.location_id),
    });
}

export function dataReducer([_, map]: DataState, action: IDataReducerAction): DataState {
    const hash = `${action.controls.sex};;${action.controls.year}`;
    return [hash, map.set(hash, action.payload)];
}