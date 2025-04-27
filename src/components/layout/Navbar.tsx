import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  InputBase,
  useTheme,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '35ch',
    },
  },
}));

interface NavbarProps {
  onSidebarOpen: () => void;
}

const getPageTitle = (pathname: string): string => {
  if (pathname === '/') return 'Dashboard';
  
  // Remove the leading slash and capitalize
  const path = pathname.substring(1);
  const formatted = path.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return formatted;
};

const Navbar: React.FC<NavbarProps> = ({ onSidebarOpen }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const location = useLocation();
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
          mt: 1.5,
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={handleMenuClose}>
        <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
        Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
        Settings
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: '0px 1px 10px rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={onSidebarOpen}
            sx={{ mr: 2, display: { sm: 'flex' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            fontWeight="bold"
            color={theme.palette.primary.main}
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {getPageTitle(location.pathname)}
          </Typography>
          
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Notifications">
              <IconButton size="large" color="inherit">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>A</Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </>
  );
};

export default Navbar; 