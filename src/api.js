import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vizhub.healthdata.org/data-viz-challenge-api/api/',
});

export async function fetchLocationMetadata() {
  const { data } = await api.get('metadata/location');
  return data;
}

export async function fetchSexMetadata() {
  const { data } = await api.get('metadata/sex');
  return data;
}

export async function fetchYearMetadata() {
  const { data } = await api.get('metadata/year');
  return data;
}

export async function fetchMetadata() {
  const [location, sex, year] = await Promise.all([
    fetchLocationMetadata(),
    fetchSexMetadata(),
    fetchYearMetadata(),
  ]);

  return {
    location,
    sex,
    year,
  };
}

export async function fetchCitation() {
  const { data } = await api.get('citation');
  return data;
}

/**
 * Fetch data
 * @param {object} params Optional params to filter dataset
 * @param {string|string[]} [params.location_name] Optional string or array of location names
 * @param {string|string[]} [params.sex_name] Optional string or array of sex names
 * @param {string|string[]} [params.year_name] Optional string or array of year names
 * @param {number|number[]} [params.location_id] Optional string or array of location ids
 * @param {number|number[]} [params.sex_id] Optional string or array of sex ids
 * @param {number|number[]} [params.year_id] Optional string or array of year ids
 * @return {Object[]} An array with the results of the query
 * @example
 *   fetchData({
 *     location_name: ['Belize', 'Venezuela'],
 *     year_name: [1990, 2015],
 *     sex_name: 'Females'
 *   })
 */
export async function fetchData(params = {}) {
  const { data } = await api.get('data', {
    params,
  });
  return data;
}
