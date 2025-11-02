# Weather Analytics Dashboard

A responsive React application that lets users search cities, view current conditions, five‑day trends, and hourly forecasts. It emphasizes data freshness (≤60s), efficient API usage via caching, and a clean, mobile‑friendly UI.

## Highlights
- Real‑time feel: cache validity set to 60 seconds, periodic refresh in views.
- City search with suggestions: integrates OpenWeatherMap Geocoding and MUI Autocomplete.
- Favorites and settings persisted in `localStorage`.
- Unit toggle: Celsius/Fahrenheit and matching wind units (m/s vs mph) reflected across all views.

## Tech Overview
- React (functional components, hooks) for UI and state.
- Material UI for layout, theming, `AppBar`, `Grid`, `Card`, and Autocomplete.
- React Router for navigation between `Dashboard`, `DetailedView`, and `Settings`.
- Axios for HTTP requests to OpenWeatherMap APIs (weather, forecast, geocoding).
- Recharts for visualizing five‑day temperature trends.
- `localStorage` for persistency of favorites, searched cities, and temperature unit.

## Architecture and Data Flow

### Services
- `src/services/weatherService.js`
  - Axios instance configured with `baseURL` and `units` parameter.
  - In‑memory cache: `{ data, timestamp, maxAge: 60000 }` with `isCacheValid(key)` to ensure data ≤60 seconds old.
  - Weather: `fetchWeatherData(city)` and `fetchForecastData(city)` use cache keys like `current-<city>` and `forecast-<city>`.
  - By ID: `fetchWeatherById(id)`, `fetchForecastById(id)` for detailed view.
  - Units: `setTemperatureUnit(unit)` updates axios defaults, persists to `localStorage`, and clears cache; `initTemperatureUnit()` initializes app‑wide units from storage.
  - Geocoding: `searchCitiesByName(query, limit)` hits OpenWeatherMap `/geo/1.0/direct` and caches results.

### UI Pages and Components
- `src/components/common/Header.js`
  - AppBar with dark mode toggle, navigation, and search.
  - Autocomplete suggestions driven by `searchCitiesByName` with a 300ms debounce.
  - Selecting a suggestion or pressing Enter adds the city to `localStorage` (`searchedCities`) and routes to the dashboard.

- `src/components/Dashboard/Dashboard.js`
  - Aggregates cities from favorites, searched, and defaults.
  - Sequentially fetches current weather per city to avoid `Promise.all` failures on partial errors.
  - Refresh interval: 5 minutes; data served from 60s cache for quick UI updates.
  - Layout optimized for mobile: centered grid, constrained card width.

- `src/components/Dashboard/WeatherCard.js`
  - Displays city name, icon, temperature, description, humidity, and wind.
  - Favorites toggle persisted in `localStorage`.
  - Temperature and wind units adapt to the selected unit (`metric`/`imperial`).

- `src/components/DetailedView/DetailedView.js`
  - Fetches current weather and forecast by city ID.
  - Tabs: Five‑day chart (`ForecastChart`) and Hourly forecast (`HourlyForecast`).
  - Refresh interval: 60 seconds; uses cached data to keep UI responsive.

- `src/components/DetailedView/ForecastChart.js`
  - Groups 3‑hour forecast entries per day to compute min/max/avg temperature, humidity, and wind.
  - Renders with Recharts (`LineChart`, multiple series).

- `src/components/DetailedView/HourlyForecast.js`
  - Shows next 24 hours (8 × 3‑hour buckets) including icon, temp, description, humidity, wind.
  - Temperature and wind units reflect current settings.

- `src/components/Settings/Settings.js`
  - Unit selection: `Celsius (metric)` or `Fahrenheit (imperial)`.
  - `setTemperatureUnit` updates axios defaults and clears cache; success feedback via Snackbar.

## Persistence
- `localStorage` keys:
  - `favoriteCities`: array of favorited city names.
  - `searchedCities`: array of user‑added cities via search.
  - `temperatureUnit`: `metric` or `imperial`.

## Setup
1. Install dependencies: `npm install`
2. Start the app: `npm start` (dev server at `http://localhost:3000/`)
3. OpenWeatherMap API Key: currently configured in `src/services/weatherService.js` as `API_KEY` for demo. For production, move to environment variables and avoid committing secrets.

## Notes for Reviewers
- Data freshness is enforced by a 60s cache max‑age and view‑level refresh intervals (Dashboard: 5 minutes, Detailed: 60 seconds).
- Unit changes are reflected immediately in labels (°C/°F and m/s/mph) and future requests, with cache cleared on change.
- Search experience is fast and cached; suggestions are debounced to reduce API calls.
- UI is responsive and optimized for mobile cards and centered grid layout.

## Project Structure (Key paths)
- `src/App.js`: App theme, router, and header.
- `src/services/weatherService.js`: Axios, caching, unit management, geocoding, API calls.
- `src/components/common/Header.js`: AppBar, Autocomplete search.
- `src/components/Dashboard/*`: Dashboard and weather cards.
- `src/components/DetailedView/*`: Detailed view, charts, hourly forecast, stats.
- `src/components/Settings/Settings.js`: Unit selection and persistence.

## Future Enhancements (Non‑blocking)
- Move API key to `.env` and use build‑time injection.
- Replace hard reloads with in‑app data refresh after city add or unit change.
- Add unit tests for service caching and rendering.
