import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <Navbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          backgroundColor: theme.palette.background.default,
          overflowY: 'auto',
          minHeight: '100vh',
          pt: { xs: 3, sm: 3 },
          mt: 8, // Adjust for the fixed AppBar height
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 