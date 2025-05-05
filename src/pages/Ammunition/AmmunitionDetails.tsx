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
import { PageHeader } from '../../components/common';
import { ammunitionApi } from '../../services/api';
import { Ammunition } from '../../types';

const AmmunitionDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [ammunition, setAmmunition] = useState<Ammunition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAmmunition = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching ammunition with ID: ${id}`);
      
      const data = await ammunitionApi.getById(parseInt(id, 10));
      console.log('Ammunition details:', data);
      
      setAmmunition(data);
    } catch (err) {
      console.error('Error fetching ammunition details:', err);
      setError('Failed to fetch ammunition data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAmmunition();
  }, [fetchAmmunition]);

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this ammunition?')) {
      try {
        await ammunitionApi.delete(parseInt(id, 10));
        navigate('/ammunition');
      } catch (err) {
        console.error('Error deleting ammunition:', err);
        setError('Failed to delete ammunition');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Available': return 'success';
      case 'Reserved': return 'info';
      case 'Depleted': return 'warning';
      case 'Expired': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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
          onClick={() => navigate('/ammunition')}
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </Box>
    );
  }

  if (!ammunition) {
    return (
      <Box>
        <Typography>Ammunition not found</Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/ammunition')}
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
        title={`Ammunition: ${ammunition.Name}`}
        icon={<ArrowBackIcon />}
        showButton
        buttonText="Edit"
        buttonIcon={<EditIcon />}
        onButtonClick={() => navigate(`/ammunition/${id}/edit`)}
      />
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box width="100%">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">{ammunition.Name}</Typography>
              <Chip 
                label={ammunition.Status} 
                color={getStatusColor(ammunition.Status) as any}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            <Divider sx={{ mb: 3 }} />
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
              <Typography variant="subtitle1" color="textSecondary">Type</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{ammunition.Type}</Typography>
              
              <Typography variant="subtitle1" color="textSecondary">Caliber</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{ammunition.Caliber || 'N/A'}</Typography>
              
              <Typography variant="subtitle1" color="textSecondary">Quantity</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{ammunition.Quantity}</Typography>
              
              <Typography variant="subtitle1" color="textSecondary">Batch Number</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{ammunition.Batch_Number || 'N/A'}</Typography>
            </Box>
            
            <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
              <Typography variant="subtitle1" color="textSecondary">Manufacturer</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{ammunition.Manufacturer_Name || 'N/A'}</Typography>
              
              <Typography variant="subtitle1" color="textSecondary">Storage Location</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{ammunition.Facility_Name || 'N/A'}</Typography>
              
              <Typography variant="subtitle1" color="textSecondary">Production Date</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(ammunition.Production_Date)}</Typography>
              
              <Typography variant="subtitle1" color="textSecondary">Expiration Date</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(ammunition.Expiration_Date)}</Typography>
            </Box>
          </Box>
          
          <Box width="100%">
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/ammunition')}
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

export default AmmunitionDetails; 