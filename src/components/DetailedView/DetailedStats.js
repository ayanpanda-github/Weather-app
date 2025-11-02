import React from 'react';
import { Grid, Typography, Box, Paper } from '@mui/material';
import {
  Opacity,
  Air,
  Compress,
  Visibility as VisibilityIcon,
  WbSunny,
  WbTwilight
} from '@mui/icons-material';

const StatItem = ({ icon, label, value, unit }) => (
  <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      {icon}
      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
        {label}
      </Typography>
    </Box>
    <Typography variant="h6" component="div">
      {value} {unit}
    </Typography>
  </Paper>
);

const DetailedStats = ({ weather }) => {
  if (!weather) return null;

  // Convert sunrise and sunset timestamps to readable time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} sm={4} md={2}>
        <StatItem
          icon={<Opacity color="primary" />}
          label="Humidity"
          value={weather.main.humidity}
          unit="%"
        />
      </Grid>
      
      <Grid item xs={6} sm={4} md={2}>
        <StatItem
          icon={<Air color="primary" />}
          label="Wind Speed"
          value={Math.round(weather.wind.speed)}
          unit="m/s"
        />
      </Grid>
      
      <Grid item xs={6} sm={4} md={2}>
        <StatItem
          icon={<Compress color="primary" />}
          label="Pressure"
          value={weather.main.pressure}
          unit="hPa"
        />
      </Grid>
      
      <Grid item xs={6} sm={4} md={2}>
        <StatItem
          icon={<VisibilityIcon color="primary" />}
          label="Visibility"
          value={(weather.visibility / 1000).toFixed(1)}
          unit="km"
        />
      </Grid>
      
      <Grid item xs={6} sm={4} md={2}>
        <StatItem
          icon={<WbSunny color="primary" />}
          label="Sunrise"
          value={formatTime(weather.sys.sunrise)}
          unit=""
        />
      </Grid>
      
      <Grid item xs={6} sm={4} md={2}>
        <StatItem
          icon={<WbTwilight color="primary" />}
          label="Sunset"
          value={formatTime(weather.sys.sunset)}
          unit=""
        />
      </Grid>
    </Grid>
  );
};

export default DetailedStats;