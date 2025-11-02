import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const HourlyForecast = ({ forecast }) => {
  if (!forecast || !forecast.list) return null;

  // Get the next 24 hours of forecast data (8 items with 3-hour intervals)
  const hourlyData = forecast.list.slice(0, 8);

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Hourly Forecast
      </Typography>
      <Grid container spacing={2}>
        {hourlyData.map((item, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {formatTime(item.dt)}
              </Typography>
              <Box sx={{ my: 1 }}>
                <img 
                  src={getWeatherIconUrl(item.weather[0].icon)} 
                  alt={item.weather[0].description} 
                  width="50" 
                  height="50"
                />
              </Box>
              <Typography variant="h6">
                {Math.round(item.main.temp)}°C
              </Typography>
              <Typography variant="body2">
                {item.weather[0].description}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Humidity: {item.main.humidity}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Wind: {Math.round(item.wind.speed)} m/s
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HourlyForecast;