import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  Tabs, 
  Tab,
  CircularProgress,
  Divider
} from '@mui/material';
import { fetchWeatherById, fetchForecastById } from '../../services/weatherService';
import ForecastChart from './ForecastChart';
import HourlyForecast from './HourlyForecast';
import DetailedStats from './DetailedStats';

const DetailedView = () => {
  const { cityId } = useParams();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        
        // Fetch current weather and forecast data
        const [weatherData, forecastData] = await Promise.all([
          fetchWeatherById(cityId),
          fetchForecastById(cityId)
        ]);
        
        if (!weatherData || !forecastData) {
          throw new Error('Failed to fetch weather data');
        }
        
        setCurrentWeather(weatherData);
        setForecast(forecastData);
        setError(null);
      } catch (err) {
        console.error('Error fetching detailed weather data:', err);
        setError('Failed to load weather data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
    
    // Set up interval for real-time updates (every 60 seconds)
    const interval = setInterval(() => {
      loadWeatherData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [cityId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading && !currentWeather) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  if (!currentWeather || !forecast) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">No weather data available</Typography>
      </Box>
    );
  }

  // Get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          <Box sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}>
            <img
              src={getWeatherIconUrl(currentWeather.weather[0].icon)}
              alt={currentWeather.weather[0].description}
              width={80}
              height={80}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.6rem', sm: '2.125rem' } }}>
              {currentWeather.name}
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2.2rem', sm: '3rem' } }}>
              {Math.round(currentWeather.main.temp)}°C
            </Typography>
            <Typography variant="subtitle1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              {currentWeather.weather[0].description}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <DetailedStats weather={currentWeather} />
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="forecast tabs">
            <Tab label="5-Day Forecast" />
            <Tab label="Hourly Forecast" />
          </Tabs>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          {tabValue === 0 && <ForecastChart forecast={forecast} />}
          {tabValue === 1 && <HourlyForecast forecast={forecast} />}
        </Box>
      </Paper>
    </Container>
  );
};

export default DetailedView;