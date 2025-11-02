import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Switch, 
  Box,
  alpha,
  Button,
  Autocomplete,
  TextField,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon, Brightness4, Brightness7, Settings, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { searchCitiesByName } from '../../services/weatherService';



const Header = ({ darkMode, toggleDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // Add the searched city to localStorage for the Dashboard to pick up
      const searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];
      if (!searchedCities.includes(searchTerm.trim())) {
        searchedCities.push(searchTerm.trim());
        localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
      }
      
      // Clear the search input and navigate to dashboard to show the results
      setSearchTerm('');
      navigate('/');
      
      // Force a refresh of the page to reload weather data
      window.location.reload();
    }
  };

  // Debounced city search suggestions
  useEffect(() => {
    const q = searchTerm.trim();
    if (q.length < 2) { setOptions([]); return; }
    let active = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      const results = await searchCitiesByName(q, 7);
      if (active) {
        setOptions(results);
        setLoading(false);
      }
    }, 300);
    return () => { active = false; clearTimeout(timer); };
  }, [searchTerm]);

  return (
    <AppBar position="static">
      <Toolbar sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Weather Analytics Dashboard
        </Typography>
        
        <Box sx={{ 
          position: 'relative',
          flexGrow: 1, 
          minWidth: { xs: '100%', sm: 'auto' }, 
          my: { xs: 1, sm: 0 },
          mx: { xs: 0, sm: 2 }
        }}>
          <Autocomplete
            freeSolo
            options={options.map((o) => `${o.name}${o.state ? ', ' + o.state : ''}${o.country ? ', ' + o.country : ''}`)}
            loading={loading}
            inputValue={searchTerm}
            onInputChange={(_, value) => setSearchTerm(value)}
            onChange={(_, value) => {
              if (!value) return;
              const searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || [];
              const cityName = typeof value === 'string' ? value : '';
              if (cityName && !searchedCities.includes(cityName)) {
                searchedCities.push(cityName);
                localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
              }
              setSearchTerm('');
              navigate('/');
              window.location.reload();
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search city..."
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha('#ffffff', 0.15),
                    '&:hover': {
                      backgroundColor: alpha('#ffffff', 0.25),
                    },
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: alpha('#ffffff', 0.3),
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: alpha('#ffffff', 0.5),
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'inherit',
                    width: '100%',
                    [params.theme?.breakpoints?.up('md') || '@media (min-width:900px)']: {
                      width: '20ch',
                    },
                  }
                }}
                InputProps={{
                  ...params.InputProps,
                  'aria-label': 'search',
                  startAdornment: <SearchIcon sx={{ color: 'inherit', mr: 1, ml: 1 }} />,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            color="inherit" 
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{ mr: 1 }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            startIcon={<Settings />}
            onClick={() => navigate('/settings')}
            sx={{ mr: 1 }}
          >
            Settings
          </Button>
          <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            color="default"
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;