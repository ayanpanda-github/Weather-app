import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  CardActionArea,
  Box,
  Chip,
  Stack,
  IconButton
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const WeatherCard = ({ city }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    // Check if this city is in favorites
    const favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    setIsFavorite(favorites.includes(city.name));
  }, [city.name]);

  const handleCardClick = () => {
    navigate(`/city/${city.id}`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(name => name !== city.name);
    } else {
      newFavorites = [...favorites, city.name];
    }
    
    localStorage.setItem('favoriteCities', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  // Get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={handleCardClick}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h5" component="div">
              {city.name}
            </Typography>
            <IconButton 
              color="primary" 
              onClick={toggleFavorite}
              sx={{ padding: 0 }}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Box sx={{ mr: 2 }}>
              <img 
                src={getWeatherIconUrl(city.weather[0].icon)} 
                alt={city.weather[0].description} 
                width="64" 
                height="64"
              />
            </Box>
            <Box>
              <Typography variant="h4">
                {Math.round(city.main.temp)}°C
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {city.weather[0].description}
              </Typography>
            </Box>
          </Box>
          
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Chip 
              label={`Humidity: ${city.main.humidity}%`} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              label={`Wind: ${Math.round(city.wind.speed)} m/s`} 
              size="small" 
              variant="outlined" 
            />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default WeatherCard;