import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  Divider,
  Chip,
  Stack,
  Alert,
  AlertTitle,
  CircularProgress
} from '@mui/material';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { PageHeader } from '../../components/common';
import { StorageFacility, Weapon, Ammunition } from '../../types';
import { storageFacilityApi, weaponApi, ammunitionApi } from '../../services/api';

const StorageFacilityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [facility, setFacility] = useState<StorageFacility | null>(null);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [ammunition, setAmmunition] = useState<Ammunition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const facilityData = await storageFacilityApi.getById(parseInt(id, 10));
      setFacility(facilityData as StorageFacility);
      
      // Fetch weapons stored in this facility
      // For demo purposes, fetching all weapons
      const weaponsData = await weaponApi.getAll();
      
      // In a real application, you would have a proper way to link weapons to storage facilities
      // For now, we'll just show all weapons as an example
      // In production, replace this with proper filtering based on your data model
      setWeapons(weaponsData.slice(0, 3)); // Just showing first few weapons for demo
      
      // Fetch ammunition stored in this facility
      const ammoData = await ammunitionApi.getAll();
      setAmmunition(ammoData.filter(ammo => 
        // Check if ammunition has Facility_ID that matches current facility
        ammo.Facility_ID === parseInt(id, 10)
      ));
      
    } catch (err: any) {
      console.error('Error fetching storage facility details:', err);
      setError(err.message || 'Failed to fetch storage facility details');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [id]);
  
  const handleEdit = () => {
    navigate(`/storage-facilities/edit/${id}`);
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this storage facility?')) {
      try {
        await storageFacilityApi.delete(parseInt(id, 10));
        navigate('/storage-facilities');
      } catch (err: any) {
        console.error('Error deleting storage facility:', err);
        setError(err.message || 'Failed to delete storage facility');
      }
    }
  };
  
  const getStatusColor = (status: string): "success" | "error" | "warning" | "default" => {
    const colorMap: Record<string, "success" | "error" | "warning" | "default"> = {
      'Operational': 'success',
      'Under Maintenance': 'warning',
      'Full': 'warning',
      'Decommissioned': 'error'
    };
    
    return colorMap[status] || 'default';
  };
  
  const getSecurityLevelColor = (level: string): "success" | "error" | "warning" | "info" | "default" => {
    const colorMap: Record<string, "success" | "error" | "warning" | "info" | "default"> = {
      'Low': 'default',
      'Medium': 'info',
      'High': 'warning',
      'Maximum': 'error'
    };
    
    return colorMap[level] || 'default';
  };
  
  const getWeaponStatusColor = (status: string): "success" | "error" | "warning" | "default" => {
    if (status === 'Operational') return 'success';
    if (status === 'Under Maintenance') return 'warning';
    if (status === 'Damaged' || status === 'Out of Service') return 'error';
    return 'default';
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!facility && !loading) {
    return (
      <Box>
        <PageHeader
          title="Storage Facility Not Found"
          icon={<WarehouseIcon fontSize="large" />}
          showButton={false}
        />
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          The requested storage facility could not be found.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/storage-facilities')}
          sx={{ mt: 2 }}
        >
          Back to Storage Facilities
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      <PageHeader
        title={facility?.Name || 'Storage Facility Details'}
        icon={<WarehouseIcon fontSize="large" />}
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
                    Facility Name
                  </Typography>
                  <Typography variant="body1">{facility?.Name}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">{facility?.Location}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Capacity
                  </Typography>
                  <Typography variant="body1">{facility?.Capacity}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip 
                    label={facility?.Status} 
                    color={getStatusColor(facility?.Status || '')}
                    variant="outlined"
                    size="small"
                  />
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Security Level
                  </Typography>
                  <Chip 
                    label={facility?.Security_Level} 
                    color={getSecurityLevelColor(facility?.Security_Level || '')}
                    size="small"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Card variant="outlined">
            <CardHeader title="Contact Information" />
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact Info
                  </Typography>
                  <Typography variant="body1">{facility?.Contact}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Card variant="outlined">
          <CardHeader title="Stored Weapons" />
          <CardContent>
            {weapons.length > 0 ? (
              <Box>
                {weapons.map((weapon) => (
                  <Box 
                    key={weapon.Weapon_ID} 
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
                      <Typography variant="body1">{weapon.Name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Serial: {weapon.Serial_Number} | Type: {weapon.Type}
                      </Typography>
                    </Box>
                    <Chip 
                      label={weapon.Status} 
                      color={getWeaponStatusColor(weapon.Status)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No weapons stored in this facility.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Card variant="outlined">
          <CardHeader title="Stored Ammunition" />
          <CardContent>
            {ammunition.length > 0 ? (
              <Box>
                {ammunition.map((ammo) => (
                  <Box 
                    key={ammo.Ammunition_ID} 
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
                      <Typography variant="body1">{ammo.Name || ammo.Type}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Caliber: {ammo.Caliber} | Quantity: {ammo.Quantity}
                      </Typography>
                    </Box>
                    <Chip 
                      label={ammo.Status} 
                      color={ammo.Status === 'Available' ? 'success' : 
                             ammo.Status === 'Reserved' ? 'warning' : 'error'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No ammunition stored in this facility.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default StorageFacilityDetails; 