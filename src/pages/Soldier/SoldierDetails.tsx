import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Stack
} from '@mui/material';
import { Edit, ArrowBack } from '@mui/icons-material';
import { soldierApi, militaryUnitApi } from '../../services/api';
import { Soldier, MilitaryUnit } from '../../types';
import { PageHeader } from '../../components/common';

const SoldierDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [soldier, setSoldier] = useState<Soldier | null>(null);
  const [unit, setUnit] = useState<MilitaryUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchSoldier(parseInt(id, 10));
    }
  }, [id]);

  const fetchSoldier = async (soldierId: number) => {
    try {
      setLoading(true);
      const data = await soldierApi.getById(soldierId);
      setSoldier(data);
      
      if (data.Unit_ID) {
        try {
          const unitData = await militaryUnitApi.getById(data.Unit_ID);
          setUnit(unitData);
        } catch (unitErr) {
          console.error('Error fetching unit details:', unitErr);
        }
      }
    } catch (err) {
      console.error('Error fetching soldier details:', err);
      setError('Failed to fetch personnel details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'error';
      case 'On Leave':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !soldier) {
    return (
      <Box>
        <PageHeader title="Personnel Details" showButton={false} />
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">
            {error || 'Personnel not found'}
          </Typography>
          <Button 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/soldiers')}
            sx={{ mt: 2 }}
          >
            Back to Personnel List
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="Personnel Details" 
        buttonText="Edit"
        buttonIcon={<Edit />}
        onButtonClick={() => navigate(`/soldiers/${id}/edit`)}
      />
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">
            {`${soldier.Rank} ${soldier.First_Name} ${soldier.Last_Name}`}
          </Typography>
          <Chip 
            label={soldier.Status} 
            color={getStatusColor(soldier.Status) as any}
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Personnel ID
                </Typography>
                <Typography variant="body1">
                  {soldier.Soldier_ID}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Serial Number
                </Typography>
                <Typography variant="body1">
                  {soldier.Serial_Number}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Specialization
                </Typography>
                <Typography variant="body1">
                  {soldier.Specialization || 'N/A'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Date of Birth
                </Typography>
                <Typography variant="body1">
                  {formatDate(soldier.Date_of_Birth)}
                </Typography>
              </Box>
            </Stack>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Join Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(soldier.Join_Date)}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Unit
                </Typography>
                <Typography variant="body1">
                  {unit ? unit.Name : 'Not assigned'}
                </Typography>
              </Box>
              
              {unit && (
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Unit Location
                  </Typography>
                  <Typography variant="body1">
                    {unit.Location || 'N/A'}
                  </Typography>
                </Box>
              )}
              
              {unit && (
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Commanding Officer
                  </Typography>
                  <Typography variant="body1">
                    {unit.Commanding_Officer || 'N/A'}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
      </Paper>
      
      <Box display="flex" justifyContent="flex-start" mt={2}>
        <Button 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/soldiers')}
          variant="outlined"
        >
          Back to Personnel List
        </Button>
      </Box>
    </Box>
  );
};

export default SoldierDetails; 