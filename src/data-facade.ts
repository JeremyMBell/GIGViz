import { fetchData } from "./api";
import { IDataFetchResponse } from "./types/api/IDataFetchResponse";
import { ILocationMetadata } from "./types/api/ILocationMetadata";
import { IControlSelections } from "./types/IControlSelections";

export interface IDataReducerAction {
    controls: IControlSelections;
    payload: IDataFetchResponse[];
}

export type DataState<T extends string = string> = [T, Map<T, IDataFetchResponse[]>];

export function fetchDataWithControls(controls: IControlSelections, locations: ILocationMetadata[]): Promise<IDataFetchResponse[]> {
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

export interface IFilterDataAction {
    compareKey: keyof IDataFetchResponse;
    item: IDataFetchResponse;
}
type FilterDataReducer = (selections: IDataFetchResponse[], action: IFilterDataAction | undefined) => IDataFetchResponse[];
const maxData = (numMax: number): FilterDataReducer => (selectedMax, action) => {
    if (!action) {
        return [];
    }
    const compareValue = action.item[action.compareKey];
    let spliced = false;
    for (let i = 0; i < selectedMax.length; i++) {
        if (compareValue <= selectedMax[i][action.compareKey]) {
            selectedMax.splice(i, 0, action.item);
            spliced = true;
            break;
        }
    }
    if (!spliced) {
        selectedMax.push(action.item);
    }

    if (selectedMax.length >= numMax) {
        return selectedMax.slice(selectedMax.length - numMax);
    } else {
        return selectedMax.concat();
    }
};

export const DataFilters = {
    maxData,
};