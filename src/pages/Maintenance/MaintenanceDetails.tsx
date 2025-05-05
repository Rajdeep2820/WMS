import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BuildIcon from '@mui/icons-material/Build';
import { PageHeader } from '../../components/common';
import { weaponMaintenanceApi } from '../../services/api';
import { WeaponMaintenance } from '../../types';

const MaintenanceDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [maintenance, setMaintenance] = useState<WeaponMaintenance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenance = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching maintenance with ID: ${id}`);
      
      const data = await weaponMaintenanceApi.getById(parseInt(id, 10));
      console.log('Maintenance details:', data);
      
      setMaintenance(data);
    } catch (err) {
      console.error('Error fetching maintenance details:', err);
      setError('Failed to fetch maintenance data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMaintenance();
  }, [fetchMaintenance]);

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await weaponMaintenanceApi.delete(parseInt(id, 10));
        navigate('/weapon-maintenance');
      } catch (err) {
        console.error('Error deleting maintenance record:', err);
        setError('Failed to delete maintenance record');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Scheduled': return 'info';
      case 'In Progress': return 'warning';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
          onClick={() => navigate('/weapon-maintenance')}
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </Box>
    );
  }

  if (!maintenance) {
    return (
      <Box>
        <Typography>Maintenance record not found</Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/weapon-maintenance')}
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
        title={`Maintenance: ${maintenance.Weapon_Name || 'Unknown Weapon'}`}
        icon={<BuildIcon />}
        showButton
        buttonText="Edit"
        buttonIcon={<EditIcon />}
        onButtonClick={() => navigate(`/weapon-maintenance/${id}/edit`)}
      />
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box width="100%">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                {maintenance.Type} - {maintenance.Weapon_Serial ? `#${maintenance.Weapon_Serial}` : 'No Serial'}
              </Typography>
              <Chip 
                label={maintenance.Status} 
                color={getStatusColor(maintenance.Status) as any}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            <Divider sx={{ mb: 3 }} />
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
              <Typography variant="subtitle1" color="textSecondary">Weapon</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{maintenance.Weapon_Name || 'N/A'}</Typography>
              
              <Typography variant="subtitle1" color="textSecondary">Serial Number</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{maintenance.Weapon_Serial || 'N/A'}</Typography>
              
              <Typography variant="subtitle1" color="textSecondary">Maintenance Type</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{maintenance.Type}</Typography>
              
              <Typography variant="subtitle1" color="textSecondary">Technician</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{maintenance.Technician || 'N/A'}</Typography>
            </Box>
            
            <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
              <Typography variant="subtitle1" color="textSecondary">Start Date</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(maintenance.Start_Date)}</Typography>
              
              <Typography variant="subtitle1" color="textSecondary">End Date</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(maintenance.End_Date)}</Typography>
              
              <Typography variant="subtitle1" color="textSecondary">Cost</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatCurrency(maintenance.Cost)}</Typography>
              
              <Typography variant="subtitle1" color="textSecondary">Status</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <Chip 
                  label={maintenance.Status} 
                  color={getStatusColor(maintenance.Status) as any}
                  size="small"
                />
              </Typography>
            </Box>
          </Box>
          
          {maintenance.Notes && (
            <Box width="100%">
              <Typography variant="subtitle1" color="textSecondary">Notes</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{maintenance.Notes}</Typography>
            </Box>
          )}
          
          <Box width="100%">
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/weapon-maintenance')}
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

export default MaintenanceDetails; 