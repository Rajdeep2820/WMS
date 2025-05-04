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
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { PageHeader } from '../../components/common';
import { StorageFacility } from '../../types';

// Mock storage facilities
const mockFacilities: StorageFacility[] = [
  {
    id: 1,
    name: 'Alpha Armory',
    location: 'Building 12, Zone A, Base North',
    capacity: 500,
    securityLevel: 'High',
    manager: 'Richard Wilson',
    contact: '+1-555-123-4567',
    status: 'Operational',
  },
  {
    id: 2,
    name: 'Bravo Bunker',
    location: 'Underground Level 2, Zone C, Base South',
    capacity: 1200,
    securityLevel: 'Maximum',
    manager: 'Jessica Martinez',
    contact: '+1-555-987-6543',
    status: 'Operational',
  },
];

const emptyFacility: Omit<StorageFacility, 'id'> = {
  name: '',
  location: '',
  capacity: 0,
  securityLevel: '',
  manager: '',
  contact: '',
  status: 'Operational',
};

const StorageFacilityForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isEditMode = id !== 'new';
  
  const [facility, setFacility] = useState<Omit<StorageFacility, 'id'>>(emptyFacility);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const securityLevels = [
    'Low',
    'Medium',
    'High',
    'Maximum',
  ];
  
  const statusOptions: Array<StorageFacility['status']> = [
    'Operational',
    'Under Maintenance',
    'Full',
    'Decommissioned',
  ];
  
  useEffect(() => {
    if (isEditMode && id) {
      // In a real app, this would be an API call
      const foundFacility = mockFacilities.find(
        (f) => f.id === parseInt(id, 10)
      );
      
      if (foundFacility) {
        const { id, ...rest } = foundFacility;
        setFacility(rest);
      } else {
        // Facility not found
        navigate('/storage-facilities');
      }
    }
    setIsInitialized(true);
  }, [id, isEditMode, navigate]);
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!facility.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!facility.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (facility.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }
    
    if (!facility.securityLevel) {
      newErrors.securityLevel = 'Security level is required';
    }
    
    if (!facility.manager.trim()) {
      newErrors.manager = 'Manager is required';
    }
    
    if (!facility.contact.trim()) {
      newErrors.contact = 'Contact information is required';
    }
    
    if (!facility.status) {
      newErrors.status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFacility((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value, 10) || 0 : value,
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
      // isEditMode ? updateFacility(id, facility) : createFacility(facility);
      
      // Only navigate after successful submission
      navigate('/storage-facilities');
    } catch (error) {
      setSubmitError('An error occurred while saving. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/storage-facilities');
  };

  if (!isInitialized) {
    return null; // Don't render anything until initialization is complete
  }
  
  return (
    <Box sx={{ position: 'relative', zIndex: 2 }}>
      <PageHeader
        title={isEditMode ? 'Edit Storage Facility' : 'Add Storage Facility'}
        icon={<HomeWorkIcon fontSize="large" />}
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
              label="Facility Name"
              name="name"
              value={facility.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={facility.location}
              onChange={handleInputChange}
              error={!!errors.location}
              helperText={errors.location}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              type="number"
              value={facility.capacity}
              onChange={handleInputChange}
              error={!!errors.capacity}
              helperText={errors.capacity}
              inputProps={{ min: 1 }}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Security Level"
              name="securityLevel"
              value={facility.securityLevel}
              onChange={handleInputChange}
              error={!!errors.securityLevel}
              helperText={errors.securityLevel}
              required
            >
              {securityLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Manager"
              name="manager"
              value={facility.manager}
              onChange={handleInputChange}
              error={!!errors.manager}
              helperText={errors.manager}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Contact Information"
              name="contact"
              value={facility.contact}
              onChange={handleInputChange}
              error={!!errors.contact}
              helperText={errors.contact}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={facility.status}
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

export default StorageFacilityForm; 