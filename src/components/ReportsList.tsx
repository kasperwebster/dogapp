import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Box,
  IconButton,
  Chip,
  alpha,
  Tooltip,
  Badge
} from '@mui/material';
import { LocationOn, Warning, Pets, Person, ThumbUp } from '@mui/icons-material';
import { Incident } from '../types';

interface ReportsListProps {
  incidents: Incident[];
  onLocationClick?: (lat: number, lng: number) => void;
  onMarkHelpful?: (id: string) => void;
}

const ReportsList = ({ incidents, onLocationClick, onMarkHelpful }: ReportsListProps) => {
  // Sort incidents by date and time, most recent first
  const sortedIncidents = [...incidents].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const formatDate = (date: string, time: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (date === today) {
      return `Today ${time}`;
    } else if (date === yesterday) {
      return `Yesterday ${time}`;
    } else {
      return `${date} ${time}`;
    }
  };

  return (
    <Box 
      sx={{ 
        height: '100%',
        bgcolor: 'background.default',
        overflowY: 'auto',
        width: '100%'
      }}
    >
      <Box sx={{ p: 2, width: '100%' }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3,
            fontWeight: 600,
            color: 'text.primary',
            textAlign: 'center'
          }}
        >
          Recent Reports
        </Typography>
        
        <List sx={{ width: '100%', p: 0, maxWidth: '100%' }}>
          {sortedIncidents.map((incident) => (
            <Paper
              key={incident.id}
              elevation={0}
              sx={{ 
                mb: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                width: '100%',
                '&:last-child': {
                  mb: 0
                }
              }}
            >
              <ListItem
                sx={{ 
                  px: 3, 
                  py: 2,
                  width: '100%',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' }
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Mark as helpful">
                      <IconButton 
                        onClick={() => onMarkHelpful?.(incident.id)}
                        sx={{ 
                          color: 'success.main',
                          mr: 1,
                          '&:hover': {
                            bgcolor: alpha('#4caf50', 0.1)
                          }
                        }}
                      >
                        <Badge 
                          badgeContent={incident.helpfulCount || 0} 
                          color="primary"
                          sx={{
                            '& .MuiBadge-badge': {
                              fontSize: '0.7rem',
                              height: '18px',
                              minWidth: '18px'
                            }
                          }}
                        >
                          <ThumbUp fontSize="small" />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                    <IconButton 
                      edge="end" 
                      onClick={() => onLocationClick?.(incident.latitude, incident.longitude)}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: alpha('#0666EB', 0.1)
                        }
                      }}
                    >
                      <LocationOn />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  sx={{ width: '100%', mr: { xs: 0, sm: 4 } }}
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                      <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                        {formatDate(incident.date, incident.time)}
                      </Typography>
                      <Chip
                        icon={<Warning sx={{ fontSize: 16 }} />}
                        label="Unverified"
                        size="small"
                        sx={{
                          bgcolor: alpha('#ff9800', 0.1),
                          color: '#ff9800',
                          borderRadius: 1,
                          '& .MuiChip-icon': {
                            color: '#ff9800'
                          }
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.5,
                          width: '100%'
                        }}
                      >
                        {incident.description}
                      </Typography>
                      {(incident.dogName || incident.reportedBy !== 'Anonymous') && (
                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {incident.dogName && (
                            <Chip
                              icon={<Pets sx={{ fontSize: 16 }} />}
                              label={incident.dogName}
                              size="small"
                              sx={{
                                bgcolor: alpha('#0666EB', 0.1),
                                color: 'primary.main',
                                borderRadius: 1,
                                fontSize: '0.75rem',
                                '& .MuiChip-icon': {
                                  color: 'primary.main'
                                }
                              }}
                            />
                          )}
                          {incident.reportedBy !== 'Anonymous' && (
                            <Chip
                              icon={<Person sx={{ fontSize: 16 }} />}
                              label={incident.reportedBy}
                              size="small"
                              sx={{
                                bgcolor: alpha('#4caf50', 0.1),
                                color: '#4caf50',
                                borderRadius: 1,
                                fontSize: '0.75rem',
                                '& .MuiChip-icon': {
                                  color: '#4caf50'
                                }
                              }}
                            />
                          )}
                        </Box>
                      )}
                    </>
                  }
                />
              </ListItem>
            </Paper>
          ))}
          {incidents.length === 0 && (
            <Paper
              elevation={0}
              sx={{ 
                textAlign: 'center',
                py: 6,
                px: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                borderStyle: 'dashed',
                width: '100%'
              }}
            >
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                No incidents reported yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click on the map to report a new incident
              </Typography>
            </Paper>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default ReportsList; 