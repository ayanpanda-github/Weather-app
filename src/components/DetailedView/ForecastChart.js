import React from 'react';
import { Box, Typography } from '@mui/material';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

const ForecastChart = ({ forecast }) => {
  if (!forecast || !forecast.list) return null;

  // Process forecast data for the chart
  const processData = () => {
    const dailyData = [];
    const dailyMap = {};
    
    // Group forecast data by day
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString();
      
      if (!dailyMap[day]) {
        dailyMap[day] = {
          date: day,
          min: item.main.temp_min,
          max: item.main.temp_max,
          temps: [item.main.temp],
          humidity: [item.main.humidity],
          wind: [item.wind.speed]
        };
      } else {
        dailyMap[day].min = Math.min(dailyMap[day].min, item.main.temp_min);
        dailyMap[day].max = Math.max(dailyMap[day].max, item.main.temp_max);
        dailyMap[day].temps.push(item.main.temp);
        dailyMap[day].humidity.push(item.main.humidity);
        dailyMap[day].wind.push(item.wind.speed);
      }
    });
    
    // Calculate averages and format data for chart
    Object.keys(dailyMap).forEach(day => {
      const data = dailyMap[day];
      dailyData.push({
        date: day,
        min: Math.round(data.min),
        max: Math.round(data.max),
        avg: Math.round(data.temps.reduce((sum, temp) => sum + temp, 0) / data.temps.length),
        humidity: Math.round(data.humidity.reduce((sum, h) => sum + h, 0) / data.humidity.length),
        wind: Math.round(data.wind.reduce((sum, w) => sum + w, 0) / data.wind.length * 10) / 10
      });
    });
    
    return dailyData.slice(0, 5); // Limit to 5 days
  };

  const chartData = processData();

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Typography variant="h6" gutterBottom>
        5-Day Temperature Forecast
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="temp" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="humidity" orientation="right" label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line 
            yAxisId="temp"
            type="monotone" 
            dataKey="max" 
            stroke="#ff7300" 
            name="Max Temp" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            yAxisId="temp"
            type="monotone" 
            dataKey="min" 
            stroke="#0088FE" 
            name="Min Temp" 
          />
          <Line 
            yAxisId="temp"
            type="monotone" 
            dataKey="avg" 
            stroke="#00C49F" 
            name="Avg Temp" 
          />
          <Line 
            yAxisId="humidity"
            type="monotone" 
            dataKey="humidity" 
            stroke="#8884d8" 
            name="Humidity" 
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ForecastChart;