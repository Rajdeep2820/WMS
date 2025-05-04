import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Divider,
  useTheme,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { PageHeader } from '../../components/common';
import { Weapon } from '../../types';

// Mock weapons data
const mockWeapons: Weapon[] = [
  {
    id: 1,
    name: 'M4A1 Carbine',
    type: 'Assault Rifle',
    caliber: '5.56×45mm NATO',
    manufacturerId: 1,
    manufacturerName: 'Defense Systems Inc.',
    serialNumber: 'M4A1-2023-001',
    manufactureDate: '2023-01-15',
    status: 'Available',
    description: 'Standard issue assault rifle',
  },
  {
    id: 2,
    name: 'M9 Beretta',
    type: 'Pistol',
    caliber: '9×19mm Parabellum',
    manufacturerId: 2,
    manufacturerName: 'Europa Arms',
    serialNumber: 'M9-2023-001',
    manufactureDate: '2023-02-20',
    status: 'Available',
    description: 'Standard issue sidearm',
  },
];

// Mock manufacturers for dropdown
const mockManufacturers = [
  { id: 1, name: 'Defense Systems Inc.' },
  { id: 2, name: 'Europa Arms' },
  { id: 3, name: 'Sakura Defense' },
  { id: 4, name: 'Royal Armaments' },
];

// Weapon types
const weaponTypes = [
  'Assault Rifle',
  'Pistol',
  'Shotgun',
  'Sniper Rifle',
  'Machine Gun',
  'Submachine Gun',
  'Rifle',
  'Carbine',
];

const emptyWeapon: Omit<Weapon, 'id'> = {
  name: '',
  type: '',
  caliber: '',
  manufacturerId: 0,
  serialNumber: '',
  manufactureDate: new Date().toISOString().split('T')[0],
  status: 'Available',
  description: '',
};

const WeaponForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isEditMode = id !== 'new';
  
  const [weapon, setWeapon] = useState<Omit<Weapon, 'id'>>(emptyWeapon);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const statusOptions: Array<Weapon['status']> = [
    'Available',
    'Assigned',
    'Maintenance',
    'Retired',
  ];
  
  useEffect(() => {
    if (isEditMode && id) {
      // In a real app, this would be an API call
      const foundWeapon = mockWeapons.find(
        (w) => w.id === parseInt(id, 10)
      );
      
      if (foundWeapon) {
        const { id, manufacturerName, ...rest } = foundWeapon;
        setWeapon(rest);
      } else {
        // Weapon not found
        navigate('/weapons');
      }
    }
    setIsInitialized(true);
  }, [id, isEditMode, navigate]);
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!weapon.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!weapon.type) {
      newErrors.type = 'Type is required';
    }
    
    if (!weapon.caliber.trim()) {
      newErrors.caliber = 'Caliber is required';
    }
    
    if (!weapon.manufacturerId) {
      newErrors.manufacturerId = 'Manufacturer is required';
    }
    
    if (!weapon.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }
    
    if (!weapon.manufactureDate) {
      newErrors.manufactureDate = 'Manufacture date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(weapon.manufactureDate)) {
      newErrors.manufactureDate = 'Use format YYYY-MM-DD';
    }
    
    if (!weapon.status) {
      newErrors.status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setWeapon((prev) => ({
      ...prev,
      [name]: name === 'manufacturerId' ? parseInt(value, 10) || 0 : value,
    }));
    
    // Clear error when user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitError('Please fill in all required fields correctly.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Simulate API call with a longer delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // In a real app, you would make an API call here
      // isEditMode ? updateWeapon(id, weapon) : createWeapon(weapon);
      
      // Only navigate after successful submission
      navigate('/weapons');
    } catch (error) {
      setSubmitError('An error occurred while saving. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/weapons');
  };

  if (!isInitialized) {
    return null; // Don't render anything until initialization is complete
  }
  
  return (
    <Box sx={{ position: 'relative', zIndex: 2 }}>
      <PageHeader
        title={isEditMode ? 'Edit Weapon' : 'Add Weapon'}
        icon={<SaveIcon fontSize="large" />}
        showButton={false}
      />
      
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: theme.shape.borderRadius,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={weapon.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Type"
              name="type"
              value={weapon.type}
              onChange={handleInputChange}
              error={!!errors.type}
              helperText={errors.type}
              required
            >
              {weaponTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Caliber"
              name="caliber"
              value={weapon.caliber}
              onChange={handleInputChange}
              error={!!errors.caliber}
              helperText={errors.caliber}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Manufacturer"
              name="manufacturerId"
              value={weapon.manufacturerId || ''}
              onChange={handleInputChange}
              error={!!errors.manufacturerId}
              helperText={errors.manufacturerId}
              required
            >
              {mockManufacturers.map((manufacturer) => (
                <MenuItem key={manufacturer.id} value={manufacturer.id}>
                  {manufacturer.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Serial Number"
              name="serialNumber"
              value={weapon.serialNumber}
              onChange={handleInputChange}
              error={!!errors.serialNumber}
              helperText={errors.serialNumber}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Manufacture Date (YYYY-MM-DD)"
              name="manufactureDate"
              value={weapon.manufactureDate}
              onChange={handleInputChange}
              error={!!errors.manufactureDate}
              helperText={errors.manufactureDate}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={weapon.status}
              onChange={handleInputChange}
              error={!!errors.status}
              helperText={errors.status}
              required
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 100%', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={weapon.description}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCancel}
            startIcon={<CancelIcon />}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default WeaponForm; 