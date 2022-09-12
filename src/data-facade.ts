import { Dispatch } from "react";
import { fetchData } from "./api";
import { IDataFetchResponse } from "./types/api/IDataFetchResponse";
import { ILocationMetadata } from "./types/api/ILocationMetadata";
import { IControlSelections } from "./types/IControlSelections";
import { Sex } from "./types/Sexes";

export interface IDataReducerAction {
    controls: IControlSelections;
    payload: IDataFetchResponse[];
    type: 'select-data' | 'store-data';
}

export interface IDataState {
    values: Record<string, IDataFetchResponse[]>;
}

export async function fetchDataWithControls(
    data: IDataState,
    controls: IControlSelections,
    locations: string[],
    dispatchData: Dispatch<IDataReducerAction>,
): Promise<void> {
    if (getData(data, controls)) {
        return;
    }
    const payload = await fetchData({
        sex_name: controls.sex,
        year_id: controls.year,
        location_name: locations,
    })
    dispatchData({
        controls,
        payload,
        type: 'store-data',
    });
}

export const hashControls = (controls: IControlSelections): string => `${controls.sex};;${controls.year}`;

export const getData = ({values}: IDataState, controls: IControlSelections) => values[hashControls(controls)];

export const dataReducer =({values}: IDataState, action: IDataReducerAction): IDataState => {
    const hashKey = hashControls(action.controls);
    return {
        values: {
            ...values,
            [hashKey]: action.payload,
        },
    };
};

/**
 * BELOW: Reducers that filter for our visualizations
 */
export interface IFilterDataAction {
    compareKey: keyof IDataFetchResponse; // key for the datapoint that will be ploted
    data: IDataFetchResponse[];
}

export type FilterDataReducer = (selections: IDataFetchResponse[], action: IFilterDataAction) => IDataFetchResponse[];
/**
 * Returns a reducer that returns the maximum values on a compare key.
 * @param numMax - number of values to include
 * @returns a reducer that filters the dataset by maximum values of `action.compareKey`
 */
 const maxData = (numMax: number): FilterDataReducer => (oldMax, action) =>
 // sort based on compare key -- using type-agnostic compare
 // sorts in descending order
 action.data.sort(({[action.compareKey]: a}, {[action.compareKey]: b}) =>
     // if a is greater than b, then move it towards the front of the array
     // Number(boolean) -- 1 if true, 0 if false, so a === b will return 0.
     (b < a) ? -1 : Number(a !== b))
 // grab the greatest `numMax` numbers
 .slice(0, numMax);
 /**
 * Returns a reducer that returns the minimum values on a compare key.
 * @param numMin - number of values to include
 * @returns a reducer that filters the dataset by maximum values of `action.compareKey`
 */
const minData = (numMin: number): FilterDataReducer => (oldMin, action) =>
    // sort based on compare key -- using type-agnostic compare
    // sorts in ascending order
    action.data.sort(({[action.compareKey]: a}, {[action.compareKey]: b}) =>
        // if a is less than b, then move it towards the front of the array
        // Number(boolean) -- 1 if true, 0 if false, so a === b will return 0.
        (a < b) ? -1 : Number(a !== b))
    // grab the greatest `numMax` numbers
    .slice(0, numMin);

export const DataFilters = {
    maxData,
    minData,
};