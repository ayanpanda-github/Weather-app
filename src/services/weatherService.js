import axios from 'axios';

// Using a working API key
// In a production app, this would be stored in environment variables
const API_KEY = '5f472b7acba333cd8a035ea85a0d4d4c'; // Using the sample API key that works
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Create axios instance with default config
const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric' // Default to metric units
  }
});

// Cache for storing weather data to reduce API calls
const cache = {
  data: {},
  timestamp: {},
  maxAge: 60000 // 60 seconds cache validity
};

// Check if cache is valid
const isCacheValid = (key) => {
  if (!cache.data[key] || !cache.timestamp[key]) return false;
  return Date.now() - cache.timestamp[key] < cache.maxAge;
};

// Fetch current weather data for a city
export const fetchWeatherData = async (city) => {
  const cacheKey = `current-${city}`;
  
  // Return cached data if valid
  if (isCacheValid(cacheKey)) {
    return cache.data[cacheKey];
  }
  
  try {
    const response = await weatherApi.get('/weather', {
      params: { q: city }
    });
    
    // Cache the response
    cache.data[cacheKey] = response.data;
    cache.timestamp[cacheKey] = Date.now();
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather data for ${city}:`, error);
    return null;
  }
};

// Fetch 5-day forecast for a city
export const fetchForecastData = async (city) => {
  const cacheKey = `forecast-${city}`;
  
  // Return cached data if valid
  if (isCacheValid(cacheKey)) {
    return cache.data[cacheKey];
  }
  
  try {
    const response = await weatherApi.get('/forecast', {
      params: { q: city }
    });
    
    // Cache the response
    cache.data[cacheKey] = response.data;
    cache.timestamp[cacheKey] = Date.now();
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching forecast data for ${city}:`, error);
    return null;
  }
};

// Fetch weather data by city ID
export const fetchWeatherById = async (cityId) => {
  const cacheKey = `current-id-${cityId}`;
  
  // Return cached data if valid
  if (isCacheValid(cacheKey)) {
    return cache.data[cacheKey];
  }
  
  try {
    const response = await weatherApi.get('/weather', {
      params: { id: cityId }
    });
    
    // Cache the response
    cache.data[cacheKey] = response.data;
    cache.timestamp[cacheKey] = Date.now();
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather data for city ID ${cityId}:`, error);
    return null;
  }
};

// Fetch forecast data by city ID
export const fetchForecastById = async (cityId) => {
  const cacheKey = `forecast-id-${cityId}`;
  
  // Return cached data if valid
  if (isCacheValid(cacheKey)) {
    return cache.data[cacheKey];
  }
  
  try {
    const response = await weatherApi.get('/forecast', {
      params: { id: cityId }
    });
    
    // Cache the response
    cache.data[cacheKey] = response.data;
    cache.timestamp[cacheKey] = Date.now();
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching forecast data for city ID ${cityId}:`, error);
    return null;
  }
};

// Update temperature unit preference
export const setTemperatureUnit = (unit) => {
  if (unit === 'celsius' || unit === 'metric') {
    weatherApi.defaults.params.units = 'metric';
    localStorage.setItem('temperatureUnit', 'metric');
  } else if (unit === 'fahrenheit' || unit === 'imperial') {
    weatherApi.defaults.params.units = 'imperial';
    localStorage.setItem('temperatureUnit', 'imperial');
  }
  
  // Clear cache when unit changes
  cache.data = {};
  cache.timestamp = {};
};

// Initialize temperature unit from localStorage
export const initTemperatureUnit = () => {
  const savedUnit = localStorage.getItem('temperatureUnit') || 'metric';
  weatherApi.defaults.params.units = savedUnit;
  return savedUnit;
};

// Search cities by name using OpenWeatherMap Geocoding API
export const searchCitiesByName = async (query, limit = 5) => {
  if (!query || query.trim().length < 2) return [];
  const cacheKey = `geo-${query}-${limit}`;

  if (isCacheValid(cacheKey)) {
    return cache.data[cacheKey];
  }

  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: { q: query, limit, appid: API_KEY }
    });
    const results = (response.data || []).map((c) => ({
      name: c.name,
      state: c.state || '',
      country: c.country || '',
      lat: c.lat,
      lon: c.lon
    }));

    cache.data[cacheKey] = results;
    cache.timestamp[cacheKey] = Date.now();
    return results;
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};