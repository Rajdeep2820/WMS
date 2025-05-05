import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  InputAdornment,
  Divider,
  SelectChangeEvent,
  Select,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BuildIcon from '@mui/icons-material/Build';
import { PageHeader } from '../../components/common';
import { weaponMaintenanceApi, weaponApi } from '../../services/api';
import { WeaponMaintenance, Weapon } from '../../types';

interface FormErrors {
  [key: string]: string;
}

const MaintenanceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const [maintenance, setMaintenance] = useState<Partial<WeaponMaintenance>>({
    Weapon_ID: 0,
    Type: 'Regular',
    Start_Date: new Date().toISOString().split('T')[0],
    Status: 'Scheduled',
    Notes: ''
  });
  
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchWeapons = useCallback(async () => {
    try {
      setLoading(true);
      setApiError(null);
      console.log('Fetching weapons from API endpoint: /api/weapons');
      const data = await weaponApi.getAll();
      console.log('Weapons loaded:', data);
      
      if (Array.isArray(data)) {
        console.log(`Successfully loaded ${data.length} weapons`);
        setWeapons(data);
      } else {
        console.error('Invalid weapons data format:', data);
        setApiError('Received invalid weapons data format from server');
        setWeapons([]);
      }
    } catch (err) {
      console.error('Error fetching weapons:', err);
      setApiError(`Failed to load weapons. Please try again. Details: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setWeapons([]); // Set empty array to prevent undefined errors
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMaintenance = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await weaponMaintenanceApi.getById(parseInt(id, 10));
      console.log('Maintenance data loaded:', data);
      setMaintenance(data);
    } catch (err) {
      console.error('Error fetching maintenance details:', err);
      setApiError('Failed to load maintenance record');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWeapons();
    if (isEditMode) {
      fetchMaintenance();
    }
  }, [isEditMode, fetchWeapons, fetchMaintenance]);
  
  // Add debug information for weapons loading
  useEffect(() => {
    console.log('Weapons state updated. Count:', weapons.length);
    if (weapons.length > 0) {
      console.log('First weapon example:', weapons[0]);
    } else {
      console.log('No weapons loaded yet');
    }
  }, [weapons]);
  
  // Fix any undefined Weapon_ID issues when weapons are loaded
  useEffect(() => {
    if (!isEditMode && weapons.length > 0 && (!maintenance.Weapon_ID || maintenance.Weapon_ID === 0)) {
      // Find the first weapon with a valid ID
      const validWeapon = weapons.find(w => w.Weapon_ID !== undefined);
      if (validWeapon && validWeapon.Weapon_ID) {
        console.log('Setting default weapon ID to:', validWeapon.Weapon_ID);
        setMaintenance(prev => ({
          ...prev,
          Weapon_ID: validWeapon.Weapon_ID
        }));
      }
    }
  }, [weapons, isEditMode, maintenance.Weapon_ID]);

  const validateForm = (): boolean => {
    let formErrors: FormErrors = {};
    
    if (!maintenance.Weapon_ID) {
      formErrors.Weapon_ID = 'Weapon is required';
    }
    
    if (!maintenance.Type) {
      formErrors.Type = 'Maintenance type is required';
    }
    
    if (!maintenance.Start_Date) {
      formErrors.Start_Date = 'Start date is required';
    }
    
    if (!maintenance.Status) {
      formErrors.Status = 'Status is required';
    }
    
    // If end date is provided, it should be after start date
    if (maintenance.End_Date && maintenance.Start_Date && 
        new Date(maintenance.End_Date) < new Date(maintenance.Start_Date)) {
      formErrors.End_Date = 'End date must be after start date';
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setApiError(null);
      
      // Create a copy of maintenance data for submission
      const submissionData = { ...maintenance };
      
      // Format dates properly for MySQL - convert to 'YYYY-MM-DD' format
      if (submissionData.Start_Date) {
        const startDate = new Date(submissionData.Start_Date);
        if (!isNaN(startDate.getTime())) {
          submissionData.Start_Date = startDate.toISOString().split('T')[0];
        }
      }
      
      if (submissionData.End_Date) {
        const endDate = new Date(submissionData.End_Date);
        if (!isNaN(endDate.getTime())) {
          submissionData.End_Date = endDate.toISOString().split('T')[0];
        }
      }
      
      console.log('Submitting maintenance data:', submissionData);
      
      if (isEditMode && id) {
        await weaponMaintenanceApi.update(parseInt(id, 10), submissionData as WeaponMaintenance);
      } else {
        await weaponMaintenanceApi.create(submissionData as WeaponMaintenance);
      }
      
      navigate('/weapon-maintenance');
    } catch (err) {
      console.error('Error saving maintenance record:', err);
      setApiError('Failed to save maintenance record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields
    if (name === 'Cost' || name === 'Weapon_ID') {
      const numValue = value === '' ? undefined : parseFloat(value);
      setMaintenance(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setMaintenance(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    
    console.log(`SelectChange for ${name}: ${value}`);
    
    // Convert numeric fields
    if (name === 'Cost' || name === 'Weapon_ID') {
      // Handle empty string case
      if (value === '') {
        setMaintenance(prev => ({
          ...prev,
          [name]: undefined
        }));
      } else {
        // Convert to number
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          console.log(`${name} converted to number: ${numValue}`);
          setMaintenance(prev => ({
            ...prev,
            [name]: numValue
          }));
        } else {
          console.warn(`Failed to convert ${value} to a number`);
        }
      }
    } else {
      setMaintenance(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const maintenanceTypes = ['Regular', 'Repair', 'Upgrade', 'Inspection'];
  const statusOptions = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

  // Only show loading indicator when first loading weapons
  if (loading && !weapons.length) {
    return (
      <Box>
        <PageHeader
          title={isEditMode ? 'Edit Maintenance Record' : 'Add New Maintenance Record'}
          icon={<BuildIcon />}
          showButton={false}
        />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Loading weapons...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={isEditMode ? 'Edit Maintenance Record' : 'Add New Maintenance Record'}
        icon={<BuildIcon />}
        showButton={false}
      />
      
      <Paper sx={{ p: 3, mb: 3 }}>
        {apiError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">Error</Typography>
            <Typography variant="body2">{apiError}</Typography>
            {weapons.length === 0 && (
              <Box mt={2}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small" 
                  onClick={fetchWeapons}
                >
                  Retry Loading Weapons
                </Button>
              </Box>
            )}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Maintenance Information</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <FormControl fullWidth error={!!errors.Weapon_ID}>
                  <InputLabel id="weapon-label">Weapon</InputLabel>
                  <Select
                    labelId="weapon-label"
                    id="Weapon_ID"
                    name="Weapon_ID"
                    value={maintenance.Weapon_ID ? maintenance.Weapon_ID.toString() : ''}
                    onChange={handleSelectChange}
                    label="Weapon"
                  >
                    <MenuItem value="">Select a weapon</MenuItem>
                    {weapons.length > 0 ? (
                      weapons
                        .filter(weapon => weapon.Weapon_ID !== undefined)
                        .map((weapon) => (
                          <MenuItem key={weapon.Weapon_ID} value={weapon.Weapon_ID!.toString()}>
                            {weapon.Name} {weapon.Serial_Number ? `- ${weapon.Serial_Number}` : ''}
                          </MenuItem>
                        ))
                    ) : (
                      <MenuItem disabled value="">
                        No weapons available
                      </MenuItem>
                    )}
                  </Select>
                  {errors.Weapon_ID && (
                    <Typography variant="caption" color="error">
                      {errors.Weapon_ID}
                    </Typography>
                  )}
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel id="maintenance-type-label">Maintenance Type</InputLabel>
                  <Select
                    labelId="maintenance-type-label"
                    id="Type"
                    name="Type"
                    value={maintenance.Type || ''}
                    onChange={handleSelectChange}
                    error={!!errors.Type}
                    label="Maintenance Type"
                  >
                    {maintenanceTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <TextField
                fullWidth
                label="Start Date"
                name="Start_Date"
                type="date"
                value={maintenance.Start_Date || ''}
                onChange={handleInputChange}
                error={!!errors.Start_Date}
                helperText={errors.Start_Date || 'Required'}
                required
                InputLabelProps={{ shrink: true }}
                sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
              />
              
              <TextField
                fullWidth
                label="End Date"
                name="End_Date"
                type="date"
                value={maintenance.End_Date || ''}
                onChange={handleInputChange}
                error={!!errors.End_Date}
                helperText={errors.End_Date}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <TextField
                fullWidth
                label="Technician"
                name="Technician"
                type="text"
                value={maintenance.Technician || ''}
                onChange={handleInputChange}
                sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
              />
              
              <TextField
                fullWidth
                label="Cost"
                name="Cost"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={maintenance.Cost || ''}
                onChange={handleInputChange}
                sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}
              />
            </Box>
            
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="Status"
                name="Status"
                value={maintenance.Status || ''}
                onChange={handleSelectChange}
                error={!!errors.Status}
                label="Status"
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Notes"
              name="Notes"
              multiline
              rows={4}
              value={maintenance.Notes || ''}
              onChange={handleInputChange}
            />
            
            <Divider />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/weapon-maintenance')}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update' : 'Save')}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default MaintenanceForm; 