import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Button,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { setTemperatureUnit, initTemperatureUnit } from '../../services/weatherService';

const Settings = () => {
  const [unit, setUnit] = useState('metric');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    // Initialize temperature unit from localStorage
    const savedUnit = initTemperatureUnit();
    setUnit(savedUnit);
  }, []);

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handleSaveSettings = () => {
    setTemperatureUnit(unit);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Temperature Unit</FormLabel>
            <RadioGroup
              aria-label="temperature-unit"
              name="temperature-unit"
              value={unit}
              onChange={handleUnitChange}
            >
              <FormControlLabel value="metric" control={<Radio />} label="Celsius (°C)" />
              <FormControlLabel value="imperial" control={<Radio />} label="Fahrenheit (°F)" />
            </RadioGroup>
          </FormControl>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;