import apiClient from '../api/apiClient';
import type { City } from '../types';

export const fetchCities = async (): Promise<City[]> => {
  const response = await apiClient.get('/cities');
  return response.data;
};
