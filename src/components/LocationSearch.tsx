import { useState, useEffect } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  CircularProgress,
  Paper
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PinDropIcon from '@mui/icons-material/PinDrop';

interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationSearchProps {
  value: string;
  onChange: (location: string, lat?: number, lng?: number) => void;
  pinLocation?: string;
}

const LocationSearch = ({ value, onChange, pinLocation }: LocationSearchProps) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pinLocation) {
      setInputValue(pinLocation);
    }
  }, [pinLocation]);

  const searchLocations = async (search: string) => {
    if (search.length < 3) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&countrycodes=pl&limit=5`
      );
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setOptions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue && !pinLocation) {
        searchLocations(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, pinLocation]);

  return (
    <Autocomplete<LocationResult | string>
      freeSolo={false as any}
      value={value}
      onChange={(_event, newValue: string | LocationResult | null) => {
        if (typeof newValue === 'string') {
          onChange(newValue);
        } else if (newValue) {
          onChange(newValue.display_name, Number(newValue.lat), Number(newValue.lon));
        } else {
          onChange('');
        }
      }}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option.display_name;
      }}
      PaperComponent={({ children }) => (
        <Paper 
          elevation={8}
          sx={{ 
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            mt: 1
          }}
        >
          {children}
        </Paper>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Location"
          required
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option, _state) => {
        if (typeof option === 'string') {
          return (
            <Box
              component="li"
              {...props}
              sx={{
                py: 1.5,
                px: 2,
                borderBottom: 1,
                borderColor: 'divider',
                '&:last-child': {
                  borderBottom: 0
                },
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                {pinLocation ? (
                  <PinDropIcon color="primary" />
                ) : (
                  <LocationOnIcon color="primary" />
                )}
                <Typography 
                  variant="body2" 
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500
                  }}
                >
                  {option}
                </Typography>
              </Box>
            </Box>
          );
        }
        
        return (
          <Box
            component="li"
            {...props}
            sx={{
              py: 1.5,
              px: 2,
              borderBottom: 1,
              borderColor: 'divider',
              '&:last-child': {
                borderBottom: 0
              },
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              {pinLocation ? (
                <PinDropIcon color="primary" />
              ) : (
                <LocationOnIcon color="primary" />
              )}
              <Typography 
                variant="body2" 
                sx={{
                  color: 'text.primary',
                  fontWeight: 500
                }}
              >
                {option.display_name}
              </Typography>
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default LocationSearch; 