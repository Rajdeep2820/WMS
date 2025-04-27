import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import FactoryIcon from '@mui/icons-material/Factory';
import GroupsIcon from '@mui/icons-material/Groups';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BuildIcon from '@mui/icons-material/Build';
import InventoryIcon from '@mui/icons-material/Inventory';

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  height: 64,
}));

const StyledListItem = styled(ListItem)<{ active?: number }>(({ theme, active }) => ({
  padding: 0,
  marginBottom: theme.spacing(0.5),
  '& .MuiListItemButton-root': {
    borderRadius: theme.shape.borderRadius,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: active ? theme.palette.primary.dark : 'transparent',
    '&:hover': {
      backgroundColor: active 
        ? theme.palette.primary.dark 
        : theme.palette.primary.light,
    },
  },
  '& .MuiListItemIcon-root': {
    color: theme.palette.primary.contrastText,
    minWidth: 40,
  },
}));

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavigationItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { title: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { title: 'Manufacturers', path: '/manufacturers', icon: <FactoryIcon /> },
  { title: 'Military Units', path: '/military-units', icon: <GroupsIcon /> },
  { title: 'Weapons', path: '/weapons', icon: <GavelIcon /> },
  { title: 'Soldiers', path: '/soldiers', icon: <PersonIcon /> },
  { title: 'Weapon Assignments', path: '/weapon-assignments', icon: <AssignmentIcon /> },
  { title: 'Storage Facilities', path: '/storage-facilities', icon: <HomeWorkIcon /> },
  { title: 'Maintenance', path: '/maintenance', icon: <BuildIcon /> },
  { title: 'Ammunition', path: '/ammunition', icon: <InventoryIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const theme = useTheme();

  const content = (
    <>
      <LogoContainer>
        <Typography variant="h5" fontWeight="bold">
          WMS
        </Typography>
        <Typography variant="subtitle1" sx={{ ml: 1 }}>
          Weaponry System
        </Typography>
      </LogoContainer>
      
      <Divider sx={{ backgroundColor: theme.palette.primary.light }} />
      
      <List sx={{ mt: 2 }}>
        {navigationItems.map((item) => (
          <StyledListItem 
            key={item.path} 
            active={location.pathname === item.path ? 1 : 0}
            disablePadding
          >
            <ListItemButton 
              component={Link} 
              to={item.path}
              onClick={onClose}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </StyledListItem>
        ))}
      </List>
    </>
  );

  return (
    <StyledDrawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
    >
      {content}
    </StyledDrawer>
  );
};

export default Sidebar; 