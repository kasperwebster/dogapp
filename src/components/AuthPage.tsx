import React, { useState } from 'react';
import { Container, Box, Paper, Tabs, Tab } from '@mui/material';
import Login from './Login';
import Register from './Register';

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
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const AuthPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleForm = () => {
    setTabValue(tabValue === 0 ? 1 : 0);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="authentication tabs"
            variant="fullWidth"
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <Login onToggleForm={toggleForm} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Register onToggleForm={toggleForm} />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthPage; 