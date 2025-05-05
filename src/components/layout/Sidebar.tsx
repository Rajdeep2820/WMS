import React from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography 
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FactoryIcon from '@mui/icons-material/Factory';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BuildIcon from '@mui/icons-material/Build';
import InventoryIcon from '@mui/icons-material/Inventory';

const drawerWidth = 280;

const navigationItems = [
  { 
    title: 'Dashboard', 
    path: '/', 
    icon: <DashboardIcon /> 
  },
  { 
    title: 'Manufacturers', 
    path: '/manufacturers', 
    icon: <FactoryIcon /> 
  },
  { 
    title: 'Military Units', 
    path: '/military-units', 
    icon: <MilitaryTechIcon /> 
  },
  { 
    title: 'Weapons', 
    path: '/weapons', 
    icon: <GavelIcon /> 
  },
  { 
    title: 'Personnel', 
    path: '/soldiers', 
    icon: <PersonIcon /> 
  },
  { 
    title: 'Weapon Assignments', 
    path: '/weapon-assignments', 
    icon: <AssignmentIcon /> 
  },
  { 
    title: 'Storage Facilities', 
    path: '/storage-facilities', 
    icon: <HomeWorkIcon /> 
  },
  { 
    title: 'Maintenance', 
    path: '/weapon-maintenance', 
    icon: <BuildIcon /> 
  },
  { 
    title: 'Ammunition', 
    path: '/ammunition', 
    icon: <InventoryIcon /> 
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: (theme) => theme.palette.background.default,
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', height: 64 }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          Weaponry Management
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1, p: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: (theme) => theme.palette.action.selected,
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.action.hover,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Weaponry Management
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 