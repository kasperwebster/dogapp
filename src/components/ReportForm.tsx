import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  alpha,
  Paper,
  Container,
  Divider
} from '@mui/material';
import { PhotoCamera, Close, Send } from '@mui/icons-material';
import { ReportFormData } from '../types';
import LocationSearch from './LocationSearch';

interface ReportFormProps {
  onSubmit: (data: ReportFormData) => void;
  initialLocation?: string;
}

const ReportForm = ({ onSubmit, initialLocation = '' }: ReportFormProps) => {
  const [formData, setFormData] = useState<ReportFormData>({
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    description: '',
    reporterName: '',
    dogName: '',
    images: []
  });

  const [coordinates, setCoordinates] = useState<{ lat?: number; lng?: number }>({});

  useEffect(() => {
    if (initialLocation) {
      setFormData(prev => ({ ...prev, location: initialLocation }));
    }
  }, [initialLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      location: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5),
      description: '',
      reporterName: '',
      dogName: '',
      images: []
    });
    setCoordinates({});
  };

  const handleLocationChange = (location: string, lat?: number, lng?: number) => {
    setFormData(prev => ({ ...prev, location }));
    if (lat && lng) {
      setCoordinates({ lat, lng });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, images: Array.from(e.target.files || []) }));
    }
  };

  const clearImages = () => {
    setFormData(prev => ({ ...prev, images: [] }));
  };

  return (
    <Box 
      sx={{ 
        height: '100%',
        bgcolor: 'background.default',
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ 
        p: 3, 
        width: '100%', 
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4,
            fontWeight: 600,
            color: 'text.primary',
            textAlign: 'center'
          }}
        >
          Report an Incident
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: '100%',
            alignItems: 'center'
          }}
        >
          <Box sx={{ 
            width: '100%',
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              borderRadius: 2
            }
          }}>
            <LocationSearch
              value={formData.location}
              onChange={handleLocationChange}
              pinLocation={initialLocation}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <TextField
              required
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  borderRadius: 2
                }
              }}
            />
            <TextField
              required
              type="time"
              label="Time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  borderRadius: 2
                }
              }}
            />
          </Box>

          <TextField
            required
            multiline
            rows={4}
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Please provide details about the incident..."
            fullWidth
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
                borderRadius: 2
              }
            }}
          />

          <Divider sx={{ width: '100%', my: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Optional Information
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <TextField
              label="Your Name"
              value={formData.reporterName}
              onChange={(e) => setFormData(prev => ({ ...prev, reporterName: e.target.value }))}
              placeholder="Optional"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  borderRadius: 2
                }
              }}
            />
            <TextField
              label="Dog's Name"
              value={formData.dogName}
              onChange={(e) => setFormData(prev => ({ ...prev, dogName: e.target.value }))}
              placeholder="Optional"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  borderRadius: 2
                }
              }}
            />
          </Box>

          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 6,
              borderWidth: 2,
              borderStyle: 'dashed',
              color: 'primary.main',
              borderColor: 'primary.main',
              bgcolor: alpha('#0666EB', 0.05),
              '&:hover': {
                borderWidth: 2,
                borderStyle: 'dashed',
                bgcolor: alpha('#0666EB', 0.1)
              }
            }}
          >
            Upload Images
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          {formData.images.length > 0 && (
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '100%',
              justifyContent: 'center'
            }}>
              <Typography variant="body2" color="text.secondary">
                {formData.images.length} {formData.images.length === 1 ? 'image' : 'images'} selected
              </Typography>
              <IconButton 
                size="small" 
                onClick={clearImages}
                sx={{ color: 'text.secondary' }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={<Send />}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 6,
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            Submit Report
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportForm; 