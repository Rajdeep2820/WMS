import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Divider,
  useTheme,
  Alert,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { PageHeader } from '../../components/common';
import { Ammunition } from '../../types';

// Mock ammunition data (in a real app would come from an API)
const mockAmmunition: Ammunition[] = [
  {
    id: 1,
    type: 'Rifle Cartridge',
    caliber: '5.56×45mm NATO',
    quantity: 10000,
    manufacturerId: 1,
    manufacturerName: 'Defense Systems Inc.',
    batchNumber: 'B-5561-2023',
    manufactureDate: '2023-03-15',
    expirationDate: '2033-03-15',
    storageId: 1,
    storageName: 'Alpha Warehouse',
    status: 'Available',
  },
  {
    id: 2,
    type: 'Pistol Cartridge',
    caliber: '9×19mm Parabellum',
    quantity: 5000,
    manufacturerId: 2,
    manufacturerName: 'Europa Arms',
    batchNumber: 'B-9192-2023',
    manufactureDate: '2023-02-20',
    expirationDate: '2033-02-20',
    storageId: 1,
    storageName: 'Alpha Warehouse',
    status: 'Available',
  },
];

// Mock manufacturer data
const mockManufacturers = [
  { id: 1, name: 'Defense Systems Inc.' },
  { id: 2, name: 'Europa Arms' },
  { id: 3, name: 'Sakura Defense' },
  { id: 4, name: 'Royal Armaments' },
  { id: 5, name: 'Atlas Defense Systems' },
];

// Mock storage data
const mockStorageFacilities = [
  { id: 1, name: 'Alpha Warehouse' },
  { id: 2, name: 'Bravo Storage' },
  { id: 3, name: 'Charlie Bunker' },
  { id: 4, name: 'Delta Vault' },
];

// Common ammunition types
const ammunitionTypes = [
  'Rifle Cartridge',
  'Pistol Cartridge',
  'Shotgun Shell',
  'Sniper Cartridge',
  'Machine Gun Cartridge',
  'Hand Grenade',
  'Mortar Round',
  'Artillery Shell',
  'Rocket',
  'Missile',
];

const emptyAmmunition: Omit<Ammunition, 'id'> = {
  type: '',
  caliber: '',
  quantity: 0,
  manufacturerId: 0,
  batchNumber: '',
  manufactureDate: new Date().toISOString().split('T')[0],
  expirationDate: '',
  storageId: 0,
  status: 'Available',
};

const AmmunitionForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isEditMode = id !== 'new';
  
  const [ammunition, setAmmunition] = useState<Omit<Ammunition, 'id'>>(emptyAmmunition);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const statusOptions: Array<Ammunition['status']> = [
    'Available',
    'Reserved',
    'Depleted',
    'Expired',
  ];
  
  useEffect(() => {
    if (isEditMode) {
      // In a real app, this would be an API call
      const foundAmmunition = mockAmmunition.find(
        (a) => a.id === parseInt(id!, 10)
      );
      
      if (foundAmmunition) {
        const { id, manufacturerName, storageName, ...rest } = foundAmmunition;
        setAmmunition(rest);
      } else {
        // Ammunition not found
        navigate('/ammunition');
      }
    }
  }, [id, isEditMode, navigate]);
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!ammunition.type) {
      newErrors.type = 'Type is required';
    }
    
    if (!ammunition.caliber) {
      newErrors.caliber = 'Caliber is required';
    }
    
    if (!ammunition.quantity || ammunition.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (!ammunition.manufacturerId) {
      newErrors.manufacturerId = 'Manufacturer is required';
    }
    
    if (!ammunition.batchNumber) {
      newErrors.batchNumber = 'Batch number is required';
    }
    
    if (!ammunition.manufactureDate) {
      newErrors.manufactureDate = 'Manufacture date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(ammunition.manufactureDate)) {
      newErrors.manufactureDate = 'Use format YYYY-MM-DD';
    }
    
    if (!ammunition.storageId) {
      newErrors.storageId = 'Storage facility is required';
    }
    
    if (ammunition.expirationDate && !/^\d{4}-\d{2}-\d{2}$/.test(ammunition.expirationDate)) {
      newErrors.expirationDate = 'Use format YYYY-MM-DD';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setAmmunition((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'manufacturerId' || name === 'storageId' 
        ? parseInt(value, 10) || 0 
        : value,
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
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, you would make an API call here
      // isEditMode ? updateAmmunition(id, ammunition) : createAmmunition(ammunition);
      
      navigate('/ammunition');
    } catch (error) {
      setSubmitError('An error occurred while saving. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/ammunition');
  };
  
  return (
    <Box>
      <PageHeader
        title={isEditMode ? 'Edit Ammunition' : 'Add Ammunition'}
        icon={<InventoryIcon fontSize="large" />}
        showButton={false}
      />
      
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: theme.shape.borderRadius,
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
              select
              label="Ammunition Type"
              name="type"
              value={ammunition.type}
              onChange={handleInputChange}
              error={!!errors.type}
              helperText={errors.type}
              required
            >
              {ammunitionTypes.map((type) => (
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
              value={ammunition.caliber}
              onChange={handleInputChange}
              error={!!errors.caliber}
              helperText={errors.caliber}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={ammunition.quantity || ''}
              onChange={handleInputChange}
              error={!!errors.quantity}
              helperText={errors.quantity}
              required
              inputProps={{ min: 1 }}
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Manufacturer"
              name="manufacturerId"
              value={ammunition.manufacturerId || ''}
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
              label="Batch Number"
              name="batchNumber"
              value={ammunition.batchNumber}
              onChange={handleInputChange}
              error={!!errors.batchNumber}
              helperText={errors.batchNumber}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Storage Facility"
              name="storageId"
              value={ammunition.storageId || ''}
              onChange={handleInputChange}
              error={!!errors.storageId}
              helperText={errors.storageId}
              required
            >
              {mockStorageFacilities.map((facility) => (
                <MenuItem key={facility.id} value={facility.id}>
                  {facility.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Manufacture Date (YYYY-MM-DD)"
              name="manufactureDate"
              value={ammunition.manufactureDate}
              onChange={handleInputChange}
              error={!!errors.manufactureDate}
              helperText={errors.manufactureDate}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Expiration Date (YYYY-MM-DD)"
              name="expirationDate"
              value={ammunition.expirationDate || ''}
              onChange={handleInputChange}
              error={!!errors.expirationDate}
              helperText={errors.expirationDate}
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={ammunition.status}
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

export default AmmunitionForm; 