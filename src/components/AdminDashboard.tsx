import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { incidentService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await incidentService.getAllIncidents();
      setIncidents(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading(true);
    try {
      await incidentService.updateIncidentStatus(id, status);
      // Update the local state
      setIncidents(
        incidents.map((incident) =>
          incident._id === id ? { ...incident, status } : incident
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${status} incident`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (incident: any) => {
    setSelectedIncident(incident);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedIncident) return;
    
    setActionLoading(true);
    try {
      await incidentService.deleteIncident(selectedIncident._id);
      // Remove from local state
      setIncidents(incidents.filter((i) => i._id !== selectedIncident._id));
      setDeleteDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete incident');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const filteredIncidents = () => {
    if (tabValue === 0) return incidents;
    const statusMap = ['pending', 'approved', 'rejected'];
    return incidents.filter((incident) => incident.status === statusMap[tabValue - 1]);
  };

  if (!isAdmin) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">You do not have permission to access this page.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="incident status tabs">
          <Tab label="All" />
          <Tab label="Pending" />
          <Tab label="Approved" />
          <Tab label="Rejected" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {renderIncidentsTable()}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderIncidentsTable()}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderIncidentsTable()}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          {renderIncidentsTable()}
        </TabPanel>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this incident? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  function renderIncidentsTable() {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (filteredIncidents().length === 0) {
      return <Typography sx={{ p: 3 }}>No incidents found.</Typography>;
    }

    return (
      <TableContainer>
        <Table aria-label="incidents table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIncidents().map((incident) => (
              <TableRow key={incident._id}>
                <TableCell>{incident.title}</TableCell>
                <TableCell>{incident.location.address}</TableCell>
                <TableCell>
                  {format(new Date(incident.date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Chip
                    label={incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    color={getStatusColor(incident.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {incident.status === 'pending' && (
                      <>
                        <IconButton
                          color="success"
                          onClick={() => handleStatusChange(incident._id, 'approved')}
                          disabled={actionLoading}
                          size="small"
                        >
                          <ApproveIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleStatusChange(incident._id, 'rejected')}
                          disabled={actionLoading}
                          size="small"
                        >
                          <RejectIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton
                      color="primary"
                      size="small"
                      // View details functionality would go here
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(incident)}
                      disabled={actionLoading}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
};

export default AdminDashboard; 