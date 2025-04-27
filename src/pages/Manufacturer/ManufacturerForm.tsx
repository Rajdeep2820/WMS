import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  useTheme,
  Alert,
} from '@mui/material';
import FactoryIcon from '@mui/icons-material/Factory';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { PageHeader } from '../../components/common';
import { Manufacturer } from '../../types';

// Mock manufacturer data (in a real app would come from an API)
const mockManufacturers: Manufacturer[] = [
  {
    id: 1,
    name: 'Defense Systems Inc.',
    country: 'United States',
    established: '1985-06-12',
    contact: 'John Smith',
    email: 'jsmith@defensesys.com',
    phone: '+1-555-123-4567',
    address: '123 Weapons Ave, Arlington, VA 22201',
  },
  {
    id: 2,
    name: 'Europa Arms',
    country: 'Germany',
    established: '1964-02-28',
    contact: 'Hans Weber',
    email: 'hweber@europaarms.de',
    phone: '+49-30-987-6543',
    address: 'Waffenstraße 45, Berlin, 10115',
  },
];

const emptyManufacturer: Omit<Manufacturer, 'id'> = {
  name: '',
  country: '',
  established: '',
  contact: '',
  email: '',
  phone: '',
  address: '',
};

const ManufacturerForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isEditMode = id !== 'new';
  
  const [manufacturer, setManufacturer] = useState<Omit<Manufacturer, 'id'>>(emptyManufacturer);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isEditMode) {
      // In a real app, this would be an API call
      const foundManufacturer = mockManufacturers.find(
        (m) => m.id === parseInt(id!, 10)
      );
      
      if (foundManufacturer) {
        const { id, ...rest } = foundManufacturer;
        setManufacturer(rest);
      } else {
        // Manufacturer not found
        navigate('/manufacturers');
      }
    }
  }, [id, isEditMode, navigate]);
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!manufacturer.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!manufacturer.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    if (!manufacturer.established.trim()) {
      newErrors.established = 'Established date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(manufacturer.established)) {
      newErrors.established = 'Use format YYYY-MM-DD';
    }
    
    if (!manufacturer.contact.trim()) {
      newErrors.contact = 'Contact person is required';
    }
    
    if (!manufacturer.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(manufacturer.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (!manufacturer.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    if (!manufacturer.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManufacturer((prev) => ({
      ...prev,
      [name]: value,
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
      // isEditMode ? updateManufacturer(id, manufacturer) : createManufacturer(manufacturer);
      
      navigate('/manufacturers');
    } catch (error) {
      setSubmitError('An error occurred while saving. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/manufacturers');
  };
  
  return (
    <Box>
      <PageHeader
        title={isEditMode ? 'Edit Manufacturer' : 'Add Manufacturer'}
        icon={<FactoryIcon fontSize="large" />}
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
              label="Name"
              name="name"
              value={manufacturer.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={manufacturer.country}
              onChange={handleInputChange}
              error={!!errors.country}
              helperText={errors.country}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Established (YYYY-MM-DD)"
              name="established"
              value={manufacturer.established}
              onChange={handleInputChange}
              error={!!errors.established}
              helperText={errors.established}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Contact Person"
              name="contact"
              value={manufacturer.contact}
              onChange={handleInputChange}
              error={!!errors.contact}
              helperText={errors.contact}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={manufacturer.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={manufacturer.phone}
              onChange={handleInputChange}
              error={!!errors.phone}
              helperText={errors.phone}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 100%', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={manufacturer.address}
              onChange={handleInputChange}
              error={!!errors.address}
              helperText={errors.address}
              required
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

export default ManufacturerForm; 