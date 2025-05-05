import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  Chip,
  Stack,
  Alert,
  AlertTitle,
  CircularProgress
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import HistoryIcon from '@mui/icons-material/History';
import { PageHeader } from '../../components/common';
import { Weapon, WeaponMaintenance } from '../../types';
import { weaponApi, weaponMaintenanceApi } from '../../services/api';

const WeaponDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState<WeaponMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const weaponData = await weaponApi.getById(parseInt(id, 10));
      setWeapon(weaponData as Weapon);
      
      // Fetch maintenance records for this weapon
      // In a real application, you would filter by weapon ID
      const maintenanceData = await weaponMaintenanceApi.getAll();
      setMaintenanceRecords(maintenanceData.filter(record => 
        record.Weapon_ID === parseInt(id, 10)
      ));
      
    } catch (err: any) {
      console.error('Error fetching weapon details:', err);
      setError(err.message || 'Failed to fetch weapon details');
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    fetchData();
  }, [id, fetchData]);
  
  const handleEdit = () => {
    navigate(`/weapons/edit/${id}`);
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this weapon?')) {
      try {
        await weaponApi.delete(parseInt(id, 10));
        navigate('/weapons');
      } catch (err: any) {
        console.error('Error deleting weapon:', err);
        setError(err.message || 'Failed to delete weapon');
      }
    }
  };
  
  const getStatusColor = (status: string): "success" | "error" | "warning" | "default" => {
    const colorMap: Record<string, "success" | "error" | "warning" | "default"> = {
      'Active': 'success',
      'Inactive': 'error',
      'Under Maintenance': 'warning'
    };
    
    return colorMap[status] || 'default';
  };
  
  const getMaintenanceStatusColor = (status: string): "success" | "error" | "warning" | "info" | "default" => {
    const colorMap: Record<string, "success" | "error" | "warning" | "info" | "default"> = {
      'Scheduled': 'info',
      'In Progress': 'warning',
      'Completed': 'success',
      'Cancelled': 'error'
    };
    
    return colorMap[status] || 'default';
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!weapon && !loading) {
    return (
      <Box>
        <PageHeader
          title="Weapon Not Found"
          icon={<GavelIcon fontSize="large" />}
          showButton={false}
        />
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          The requested weapon could not be found.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/weapons')}
          sx={{ mt: 2 }}
        >
          Back to Weapons
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      <PageHeader
        title={weapon?.Name || 'Weapon Details'}
        icon={<GavelIcon fontSize="large" />}
        showButton={false}
      />
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={fetchData}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          }
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={handleEdit}
        >
          Edit
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
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Card variant="outlined">
            <CardHeader title="Basic Information" />
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Weapon Name
                  </Typography>
                  <Typography variant="body1">{weapon?.Name}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1">{weapon?.Type}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Model
                  </Typography>
                  <Typography variant="body1">{weapon?.Model}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Serial Number
                  </Typography>
                  <Typography variant="body1">{weapon?.Serial_Number}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip 
                    label={weapon?.Status} 
                    color={getStatusColor(weapon?.Status || '')}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Card variant="outlined">
            <CardHeader title="Additional Information" />
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Manufacturer
                  </Typography>
                  <Typography variant="body1">{weapon?.Manufacturer_Name}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date Added
                  </Typography>
                  <Typography variant="body1">
                    {weapon && 'created_at' in weapon && weapon.created_at 
                      ? new Date(weapon.created_at as string).toLocaleDateString() 
                      : 'N/A'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {weapon && 'updated_at' in weapon && weapon.updated_at 
                      ? new Date(weapon.updated_at as string).toLocaleDateString() 
                      : 'N/A'}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Card variant="outlined">
          <CardHeader 
            title="Maintenance History" 
            action={
              <Button
                startIcon={<HistoryIcon />}
                onClick={() => navigate(`/weapons/${id}/maintenance/new`)}
              >
                Add Record
              </Button>
            }
          />
          <CardContent>
            {maintenanceRecords.length > 0 ? (
              <Box>
                {maintenanceRecords.map((record) => (
                  <Box 
                    key={record.Maintenance_ID} 
                    sx={{ 
                      p: 2, 
                      mb: 1, 
                      border: 1, 
                      borderColor: 'divider',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Box>
                      <Typography variant="body1">
                        {record.Type} - {record.Start_Date ? new Date(record.Start_Date).toLocaleDateString() : 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Technician: {record.Technician || 'N/A'} | Cost: ${record.Cost || '0'}
                      </Typography>
                      {record.Notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Notes: {record.Notes}
                        </Typography>
                      )}
                    </Box>
                    <Chip 
                      label={record.Status} 
                      color={getMaintenanceStatusColor(record.Status)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No maintenance records found for this weapon.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default WeaponDetails; 