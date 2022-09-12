import { Dispatch } from "react";
import { fetchData } from "./api";
import { IDataFetchResponse } from "./types/api/IDataFetchResponse";
import { IControlSelections } from "./types/IControlSelections";
import { IYearDelta } from "./types/IYearDelta";
import { Sex } from "./types/Sexes";

export interface IDataReducerAction {
    controls: IControlSelections;
    payload: IDataFetchResponse[];
    type: 'select-data' | 'store-data';
}

export interface IDataState {
    values: Record<string, IDataFetchResponse[]>;
}

/**
 * Fires off some fetches of data based on a set of controls
 * @param data - our in-memory log of the data we've already fetched -- used to prevent duplicate requests
 * @param controls - a set of controls that we're looking to fetch data for
 * @param locations - list of locations to query on
 * @param dispatchData - callback to send the results of the request to our `dataReducer`
 * @returns 
 */
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

/**
 * Stores data passed into the payload. Returns entire data in memory.
 */
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
 * Performs a calculation on the raw data from `dataReducer`
 * It couples two adjacent years so that we can show the differences between years.
 * This makes a vital assumption that there are no collisions in the data
 * Calculation takes O(2n) (n = size of action.values), assuming map operations are O(1)
 */
export const deltaDataGenerator = (state: IYearDelta[], action: IDataState): IYearDelta[] => {
    // Store every data into a map so that lookup will be easy for the calculation
    // Year -> Sex -> Location ID -> Value
    const map = new Map<number, Map<Sex, Map<number, IDataFetchResponse>>>();
    const newLocationMap = (value: IDataFetchResponse) => new Map([[value.location_id, value]]);
    const flatValues = Object.values(action.values).flat();
    flatValues.forEach((value: IDataFetchResponse) => {
        const year = value.year_id;
        const sex = value.sex_name;
        const sexMap = map.get(year);

        // if we got no map from fetching the year, create a new map with the correct initial value
        if (!sexMap) {
            map.set(
                year,
                new Map([[sex, newLocationMap(value)]]),
            );
            return;
        }
        const locationMap = sexMap.get(sex);
        // if we got no map from fetching the sex, create a new map with the correct initial value
        if (!locationMap) {
            sexMap.set(sex, newLocationMap(value));
        // otherwise, it is safe to set the value
        } else {
            locationMap.set(value.location_id, value);
        }
    });

    // now, we can perform the calculation
    return flatValues.reduce((arr: IYearDelta[], {location_id, location_name, year_id, sex_name, mean}: IDataFetchResponse) => {
        const nextYearMap = map.get(year_id + 1);
        // if the year after this one exists, and all the sub-maps too,
        // then we can create a delta and push it
        if (nextYearMap) {
            const sexMap = nextYearMap.get(sex_name);
            if (sexMap) {
                const datum = sexMap.get(location_id);
                if (datum) {
                    arr.push({
                        startYear: year_id,
                        endYear: year_id + 1,
                        open: mean,
                        close: datum.mean,
                        delta: datum.mean - mean,
                        sex: sex_name,
                        location: location_name,
                        x: location_name,
                    });
                }
            }
        }
        return arr;
    }, []);
}

/**
 * BELOW: Reducers that filter for our visualizations
 */
export interface IFilterDataAction<T> {
    compareKey: keyof T; // key for the datapoint that will be ploted
    data: T[];
}

export type FilterDataReducer<T> = (selections: T[], action: IFilterDataAction<T>) => T[];
/**
 * Returns a reducer that returns the maximum values on a compare key.
 * @param numMax - number of values to include
 * @returns a reducer that filters the dataset by maximum values of `action.compareKey`
 */
 const maxData = <T>(numMax: number): FilterDataReducer<T> => (oldMax, action) =>
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
const minData = <T>(numMin: number): FilterDataReducer<T> => (oldMin, action) =>
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