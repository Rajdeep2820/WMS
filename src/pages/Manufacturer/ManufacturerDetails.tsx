import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FactoryIcon from '@mui/icons-material/Factory';
import WeaponIcon from '@mui/icons-material/GpsFixed';
import AmmunitionIcon from '@mui/icons-material/ViewInAr';
import { PageHeader } from '../../components/common';
import { manufacturerApi } from '../../services/api';
import { Manufacturer } from '../../types';

const ManufacturerDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManufacturer = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await manufacturerApi.getById(parseInt(id, 10));
      console.log('Manufacturer details:', data);
      
      setManufacturer(data);
    } catch (err: any) {
      console.error('Error fetching manufacturer details:', err);
      setError('Failed to fetch manufacturer data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchManufacturer();
  }, [fetchManufacturer]);

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this manufacturer?')) {
      try {
        await manufacturerApi.delete(parseInt(id, 10));
        navigate('/manufacturers');
      } catch (err: any) {
        console.error('Error deleting manufacturer:', err);
        setError('Failed to delete manufacturer');
      }
    }
  };

  const getStatusColor = (status: string): "success" | "error" | "warning" | "default" => {
    switch(status) {
      case 'Active': return 'success';
      case 'Inactive': return 'error';
      case 'Suspended': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/manufacturers')}
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </Box>
    );
  }

  if (!manufacturer) {
    return (
      <Box>
        <Typography>Manufacturer not found</Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/manufacturers')}
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={`Manufacturer: ${manufacturer.Name}`}
        icon={<FactoryIcon />}
        showButton
        buttonText="Edit"
        buttonIcon={<EditIcon />}
        onButtonClick={() => navigate(`/manufacturers/edit/${id}`)}
      />
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              {manufacturer.Name} - {manufacturer.Country}
            </Typography>
            <Chip 
              label={manufacturer.Status} 
              color={getStatusColor(manufacturer.Status)}
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined">
                <CardHeader title="Basic Information" />
                <CardContent>
                  <Typography variant="subtitle1" color="textSecondary">Country</Typography>
                  <Typography variant="body1" paragraph>{manufacturer.Country}</Typography>
                  
                  <Typography variant="subtitle1" color="textSecondary">Contact Information</Typography>
                  <Typography variant="body1" paragraph>{manufacturer.Contact_Info}</Typography>
                  
                  <Typography variant="subtitle1" color="textSecondary">Status</Typography>
                  <Chip 
                    label={manufacturer.Status} 
                    color={getStatusColor(manufacturer.Status)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined">
                <CardHeader 
                  title="Products" 
                  subheader="Weapons and Ammunition manufactured"
                />
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      border: '1px solid #eee',
                      borderRadius: 1,
                      padding: 2,
                      width: '50%'
                    }}>
                      <WeaponIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6">{manufacturer.Weapon_Count || 0}</Typography>
                      <Typography variant="body2" color="textSecondary">Weapons</Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      border: '1px solid #eee',
                      borderRadius: 1,
                      padding: 2,
                      width: '50%'
                    }}>
                      <AmmunitionIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6">{manufacturer.Ammunition_Count || 0}</Typography>
                      <Typography variant="body2" color="textSecondary">Ammunition</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/manufacturers')}
              >
                Back to List
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ManufacturerDetails; 