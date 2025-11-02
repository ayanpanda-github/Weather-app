import React, { useState, useEffect, useMemo } from 'react';
import { Container, Grid, Typography, Box, CircularProgress } from '@mui/material';
import { fetchWeatherData } from '../../services/weatherService';
import WeatherCard from './WeatherCard';

const Dashboard = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default cities to show if no favorites or searched cities
  const defaultCities = useMemo(() => ['London', 'New York', 'Tokyo', 'Sydney', 'Paris'], []);

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        
        // Get favorite cities and searched cities from localStorage or use defaults
        const favoriteCities = JSON.parse(localStorage.getItem('favoriteCities')) || [];
        const searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];
        
        // Always include default cities to ensure something displays
        const citiesToFetch = [...new Set([...favoriteCities, ...searchedCities, ...defaultCities])];
        
        console.log('Cities to fetch:', citiesToFetch); // Debug log
        
        const weatherResults = [];
        
        // Fetch cities one by one to avoid Promise.all failing if one request fails
        for (const city of citiesToFetch) {
          try {
            const data = await fetchWeatherData(city);
            if (data) {
              weatherResults.push(data);
            }
          } catch (cityError) {
            console.error(`Error fetching data for ${city}:`, cityError);
          }
        }
        
        console.log('Weather data fetched:', weatherResults.length); // Debug log
        setCities(weatherResults);
        setError(weatherResults.length === 0 ? 'No weather data available. Please try searching for a city.' : null);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to load weather data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
    
    // Set up interval for real-time updates (every 5 minutes)
    const interval = setInterval(loadWeatherData, 300000);
    
    return () => clearInterval(interval);
  }, [defaultCities]);

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: 4, 
        mb: 4, 
        px: { xs: 2, sm: 3 }
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Weather Dashboard
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {error}
        </Typography>
      ) : (
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            justifyContent: { xs: 'center', sm: 'flex-start' },
            alignItems: 'stretch'
          }}
        >
          {cities.map((city) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={city.id}
              sx={{ 
                display: 'flex',
                justifyContent: 'center',
                maxWidth: { xs: '400px', sm: 'none' },
                mx: { xs: 'auto', sm: 0 }
              }}
            >
              <WeatherCard city={city} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;