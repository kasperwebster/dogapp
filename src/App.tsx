import { useState, useEffect, useRef } from 'react'
import { 
  Box, 
  Drawer, 
  IconButton, 
  useMediaQuery, 
  ThemeProvider,
  CssBaseline,
  Tab,
  Tabs,
  Typography,
  Container,
  Paper,
  Button,
  Link,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Map from './components/Map'
import ReportForm from './components/ReportForm'
import ReportsList from './components/ReportsList'
import ReportMetrics from './components/ReportMetrics'
import AdminDashboard from './components/AdminDashboard'
import AuthPage from './components/AuthPage'
import { Incident, ReportFormData } from './types'
import './App.css'
import { useTheme } from '@mui/material/styles'
import { Close, AccountCircle } from '@mui/icons-material'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { incidentService } from './services/api'

const STORAGE_KEY = 'dogapp_incidents';

// Generate a simple unique ID without external dependencies
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Main App component wrapped with AuthProvider
function AppWithAuth() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// App content with authentication context
function AppContent() {
  const theme = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined)
  const [activeTab, setActiveTab] = useState(0)
  const [showAuthPage, setShowAuthPage] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const reportSectionRef = useRef<HTMLDivElement>(null)
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Load incidents from API on component mount
  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const data = await incidentService.getIncidents();
      setIncidents(data);
      console.log('Loaded incidents from API:', data.length);
    } catch (error) {
      console.error('Error loading incidents from API:', error);
      // Fallback to localStorage if API fails
      try {
        const savedIncidents = localStorage.getItem('dogapp_incidents');
        if (savedIncidents) {
          const parsedIncidents = JSON.parse(savedIncidents);
          if (Array.isArray(parsedIncidents)) {
            setIncidents(parsedIncidents);
            console.log('Loaded incidents from localStorage:', parsedIncidents.length);
          }
        }
      } catch (localError) {
        console.error('Error loading incidents from localStorage:', localError);
      }
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleMapClick = (e: { latlng: { lat: number; lng: number } }) => {
    const { lat, lng } = e.latlng
    setSelectedLocation(`${lat}, ${lng}`)
    if (isMobile) {
      setIsDrawerOpen(true)
      setActiveTab(1)
    }
    setMapCenter([lat, lng])
  }

  const handleReportSubmit = async (data: ReportFormData) => {
    try {
      // If authenticated, use the API
      if (isAuthenticated) {
        const incidentData = {
          title: data.description.substring(0, 50) + (data.description.length > 50 ? '...' : ''),
          description: data.description,
          location: {
            address: data.location,
            lat: mapCenter?.[0] || 0,
            lng: mapCenter?.[1] || 0,
          },
          dogBreed: data.dogName || 'Unknown',
          severity: 'medium',
          date: new Date(data.date + 'T' + data.time),
        };

        const newIncident = await incidentService.createIncident(incidentData);
        
        // Update local state with the new incident
        setIncidents([newIncident, ...incidents]);
      } else {
        // Fallback to localStorage if not authenticated
        const now = new Date();
        const newIncident: Incident = {
          id: generateId(),
          latitude: mapCenter?.[0] || 0,
          longitude: mapCenter?.[1] || 0,
          date: data.date,
          time: data.time,
          description: data.description,
          location: data.location,
          reportedBy: data.reporterName || 'Anonymous',
          dogName: data.dogName || undefined,
          images: [],
          verified: false,
          helpfulCount: 0,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        };

        // Create a new array with the new incident at the beginning
        const updatedIncidents = [newIncident, ...incidents];
        
        // Update state with the new array
        setIncidents(updatedIncidents);
        
        // Immediately save to localStorage
        localStorage.setItem('dogapp_incidents', JSON.stringify(updatedIncidents));
      }
      
      setIsDrawerOpen(false);
      setSelectedLocation('');
      setActiveTab(0);
      setMapCenter(undefined);
      
      console.log('Added new incident');
    } catch (error) {
      console.error('Error creating new incident:', error);
    }
  }

  const handleLocationClick = (lat: number, lng: number) => {
    setMapCenter([lat, lng])
    if (isMobile) {
      setIsDrawerOpen(false)
    }
  }

  const handleMarkHelpful = async (id: string) => {
    try {
      if (isAuthenticated) {
        // Use API if authenticated
        const updatedIncident = await incidentService.markHelpful(id);
        
        // Update local state
        setIncidents(incidents.map(incident => 
          incident.id === id ? { ...incident, helpfulCount: updatedIncident.helpfulCount } : incident
        ));
      } else {
        // Fallback to localStorage
        const updatedIncidents = incidents.map(incident => {
          if (incident.id === id) {
            return {
              ...incident,
              helpfulCount: (incident.helpfulCount || 0) + 1,
              updatedAt: new Date().toISOString()
            };
          }
          return incident;
        });
        
        setIncidents(updatedIncidents);
        localStorage.setItem('dogapp_incidents', JSON.stringify(updatedIncidents));
      }
      
      console.log(`Marked incident ${id} as helpful`);
    } catch (error) {
      console.error('Error marking incident as helpful:', error);
    }
  }

  const handleReportClick = () => {
    if (!isAuthenticated) {
      setShowAuthPage(true);
      return;
    }
    
    if (isMobile) {
      setIsDrawerOpen(true)
      setActiveTab(1)
    } else {
      setActiveTab(1)
    }
    
    // Scroll to the report section
    if (reportSectionRef.current) {
      reportSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAdminDashboard = () => {
    setShowAdminDashboard(true);
    handleUserMenuClose();
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    setShowAdminDashboard(false);
  };

  // If showing auth page
  if (showAuthPage) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Psyjaciele
              </Typography>
              <Button color="inherit" onClick={() => setShowAuthPage(false)}>
                Back to Map
              </Button>
            </Toolbar>
          </AppBar>
          <AuthPage />
        </Box>
      </ThemeProvider>
    );
  }

  // If showing admin dashboard
  if (showAdminDashboard && isAdmin) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Psyjaciele Admin
              </Typography>
              <Button color="inherit" onClick={() => setShowAdminDashboard(false)}>
                Back to Map
              </Button>
            </Toolbar>
          </AppBar>
          <AdminDashboard />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* App Bar */}
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Psyjaciele
            </Typography>
            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleUserMenuClick}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {user?.username?.charAt(0).toUpperCase() || <AccountCircle />}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                >
                  {isAdmin && (
                    <MenuItem onClick={handleAdminDashboard}>Admin Dashboard</MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" onClick={() => setShowAuthPage(true)}>
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box 
          sx={{ 
            py: { xs: 3, sm: 4, md: 6 },
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at top right, rgba(6,102,235,0.05) 0%, rgba(6,102,235,0) 70%)',
              pointerEvents: 'none'
            }
          }}
        >
          <Container maxWidth="md">
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                background: 'linear-gradient(45deg, #0666EB, #00D632)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              Psyjaciele
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: { xs: 3, sm: 4 },
                maxWidth: '800px',
                mx: 'auto',
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                px: { xs: 2, sm: 0 }
              }}
            >
              Help keep our furry friends safe in Warsaw. Report and track incidents of dog poisoning
              to protect our community's pets. Together we can create a safer environment for our
              four-legged companions.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<WarningAmberIcon />}
              onClick={handleReportClick}
              sx={{ 
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                borderRadius: 8,
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              Report an Incident
            </Button>
          </Container>
        </Box>

        {/* Metrics Section */}
        <Container maxWidth="xl" sx={{ 
          mt: { xs: 2, sm: 3, md: 4 }, 
          mb: 5, 
          px: { xs: 2, md: 4 } 
        }}>
          <ReportMetrics incidents={incidents} />
        </Container>

        {/* Main Content */}
        <Container 
          ref={reportSectionRef}
          maxWidth="xl" 
          sx={{ 
            flex: 1,
            py: 4,
            display: 'flex',
            gap: 3
          }}
        >
          {/* Map Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              flex: 1,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              minHeight: { xs: '400px', md: '700px' }
            }}
          >
            <Map 
              incidents={incidents} 
              onMapClick={handleMapClick}
              center={mapCenter}
            />
          </Paper>

          {/* Reports Section */}
          <Paper
            elevation={0}
            sx={{
              width: { xs: '100%', md: '500px' },
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider', 
              bgcolor: 'background.paper'
            }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    py: 2,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      color: 'primary.main',
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  }
                }}
              >
                <Tab label="Recent Reports" />
                <Tab label="Report Incident" />
              </Tabs>
            </Box>

            <Box sx={{ 
              display: activeTab === 0 ? 'flex' : 'none', 
              flex: 1,
              bgcolor: 'background.paper'
            }}>
              <ReportsList 
                incidents={incidents} 
                onLocationClick={handleLocationClick}
                onMarkHelpful={handleMarkHelpful}
              />
            </Box>
            
            <Box sx={{ 
              display: activeTab === 1 ? 'flex' : 'none', 
              flex: 1,
              bgcolor: 'background.paper'
            }}>
              <ReportForm onSubmit={handleReportSubmit} initialLocation={selectedLocation} />
            </Box>
          </Paper>

          {/* Mobile Drawer */}
          {isMobile && (
            <Drawer
              anchor="bottom"
              open={isDrawerOpen}
              onClose={handleDrawerToggle}
              sx={{
                '& .MuiDrawer-paper': {
                  height: 'calc(100% - 56px)',
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  border: 1,
                  borderColor: 'divider',
                  boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.05)',
                  overflow: 'hidden'
                },
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2, 
                borderBottom: 1, 
                borderColor: 'divider' 
              }}>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange} 
                  variant="fullWidth"
                  sx={{ flex: 1 }}
                >
                  <Tab label="Recent Reports" />
                  <Tab label="Report Incident" />
                </Tabs>
                <IconButton onClick={handleDrawerToggle} sx={{ ml: 1 }}>
                  <Close />
                </IconButton>
              </Box>
              <Box sx={{ overflow: 'auto', height: '100%' }}>
                {activeTab === 0 && (
                  <ReportsList 
                    incidents={incidents} 
                    onLocationClick={handleLocationClick}
                    onMarkHelpful={handleMarkHelpful}
                  />
                )}
                {activeTab === 1 && (
                  <ReportForm onSubmit={handleReportSubmit} initialLocation={selectedLocation} />
                )}
              </Box>
            </Drawer>
          )}
        </Container>

        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            py: 3, 
            textAlign: 'center', 
            borderTop: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Powered by <Link href="https://socialwifi.com" target="_blank" rel="noopener">Social WiFi</Link>
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AppWithAuth;
