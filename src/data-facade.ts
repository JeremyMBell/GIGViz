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

export const hashControls = (controls: IControlSelections): string => `${controls.sex};;${controls.year}`;

export function dataReducer([_, map]: DataState, action: IDataReducerAction): DataState {
    const hash = hashControls(action.controls);
    return [hash, map.set(hash, action.payload)];
}

/**
 * BELOW: Reducers that filter for our visualizations
 */
export interface IFilterDataAction {
    compareKey: keyof IDataFetchResponse; // key for the datapoint that will be ploted
    item: IDataFetchResponse;
}

type FilterDataReducer = (selections: IDataFetchResponse[], action: IFilterDataAction | undefined) => IDataFetchResponse[];
/**
 * Returns a reducer that returns the maximum values on a compare key.
 * @param numMax - number of values to include
 * @returns a reducer that filters and sorts the data set by maximizing the compareKey
 */
const maxData = (numMax: number): FilterDataReducer => (selectedMax, action) => {
    if (!action) {
        return [];
    }
    const compareValue = action.item[action.compareKey];
    let spliced = false;

    // essentially an insertion sort rewritten for this reducer
    for (let i = 0; i < selectedMax.length; i++) {
        if (compareValue <= selectedMax[i][action.compareKey]) {
            selectedMax.splice(i, 0, action.item);
            spliced = true;
            break;
        }
    }

    // if the value wasn't added, then that means it's larger than the current selections
    if (!spliced) {
        selectedMax.push(action.item);
    }

    if (selectedMax.length >= numMax) { // chop off excess
        return selectedMax.slice(selectedMax.length - numMax);
    } else { // clone to prevent any mutation issues
        return selectedMax.concat();
    }
};

export const DataFilters = {
    maxData,
};