import { Box, Paper, Typography, Grid } from '@mui/material';
import { Incident } from '../types';
import { BarChart, Timeline, CalendarMonth } from '@mui/icons-material';

interface ReportMetricsProps {
  incidents: Incident[];
}

const ReportMetrics = ({ incidents }: ReportMetricsProps) => {
  // Calculate metrics
  const totalReports = incidents.length;
  
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  const last7DaysReports = incidents.filter(incident => {
    const incidentDate = new Date(incident.createdAt);
    return incidentDate >= sevenDaysAgo;
  }).length;
  
  const last30DaysReports = incidents.filter(incident => {
    const incidentDate = new Date(incident.createdAt);
    return incidentDate >= thirtyDaysAgo;
  }).length;

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
              }
            }}
          >
            <BarChart sx={{ fontSize: 48, color: 'primary.main', mb: 1.5 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
              {totalReports}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Total Reports
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
              }
            }}
          >
            <Timeline sx={{ fontSize: 48, color: '#4caf50', mb: 1.5 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#4caf50', mb: 1 }}>
              {last7DaysReports}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Last 7 Days
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
              }
            }}
          >
            <CalendarMonth sx={{ fontSize: 48, color: '#ff9800', mb: 1.5 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#ff9800', mb: 1 }}>
              {last30DaysReports}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Last 30 Days
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportMetrics; 