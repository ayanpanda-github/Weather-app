import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Switch, 
  Box,
  InputBase,
  alpha,
  styled,
  Button
} from '@mui/material';
import { Search as SearchIcon, Brightness4, Brightness7, Settings, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SearchInput = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = ({ darkMode, toggleDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
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
        
        <SearchInput sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 'auto' }, my: { xs: 1, sm: 0 } }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search city..."
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
          />
        </SearchInput>
        
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