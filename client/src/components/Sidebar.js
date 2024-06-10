import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/CloudUpload';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../assets/logo.png';

const drawerWidth = 240;

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#263238',
          color: 'white',
        },
      }}
    >
      <Box display="flex" alignItems="center" padding="16px">
        <img src={logo} alt="Logo" width="30" height="30" style={{ marginRight: '8px' }} />
        <Typography variant="h6" color="inherit">Landscape AI</Typography>
      </Box>
      <List>
        <ListItem
          button
          component={RouterLink}
          to="/upload"
          selected={location.pathname === '/upload'}
          sx={{ '&.Mui-selected': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary="Create" />
        </ListItem>
        <ListItem
          button
          component={RouterLink}
          to="/my-images"
          selected={location.pathname === '/my-images'}
          sx={{ '&.Mui-selected': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <ImageIcon />
          </ListItemIcon>
          <ListItemText primary="My Images" />
        </ListItem>
        {/* <ListItem
          button
          component={RouterLink}
          to="/upload"
          selected={location.pathname === '/upload'}
          sx={{ '&.Mui-selected': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <UploadIcon />
          </ListItemIcon>
          <ListItemText primary="Upload" />
        </ListItem> */}
        <ListItem button onClick={onLogout}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
