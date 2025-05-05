import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Divider,
  useTheme,
  Alert,
  MenuItem,
  CircularProgress,
  Snackbar
} from '@mui/material';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { PageHeader } from '../../components/common';
import { StorageFacility } from '../../types/storageFacility';
import { storageFacilityApi } from '../../services/api';

const securityLevelOptions = ['Low', 'Medium', 'High', 'Maximum'];
const statusOptions = ['Operational', 'Under Maintenance', 'Full', 'Decommissioned'];

// Define the form data type using the actual database schema
type StorageFacilityFormData = Omit<StorageFacility, 'Facility_ID'>;

const StorageFacilityForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isEditMode = id !== 'new';
  
  const initialStorageFacilityState: StorageFacilityFormData = {
    Name: '',
    Location: '',
    Capacity: 0,
    Security_Level: 'Medium',
    Status: 'Operational',
  };
  
  const [storageFacility, setStorageFacility] = useState<StorageFacilityFormData>(initialStorageFacilityState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEditMode);
  
  // Fetch required data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // If in edit mode, fetch the storage facility details
      if (isEditMode && id) {
        try {
          const facilityId = parseInt(id, 10);
          console.log('Fetching storage facility with ID:', facilityId);
          
          const response = await storageFacilityApi.getById(facilityId);
          console.log('Fetched storage facility:', response);
          
          setStorageFacility({
            Name: response.Name || '',
            Location: response.Location || '',
            Capacity: response.Capacity || 0,
            Security_Level: response.Security_Level || 'Medium',
            Status: response.Status || 'Operational',
          });
        } catch (error) {
          console.error('Error fetching storage facility:', error);
          setSubmitError('Failed to load facility data. Please try again.');
          setTimeout(() => navigate('/storage-facilities'), 3000);
        }
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
      setSubmitError('Failed to load required data. Please try again.');
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };
  
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode]);
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!storageFacility.Name?.trim()) {
      newErrors.Name = 'Facility name is required';
    }
    
    if (!storageFacility.Location?.trim()) {
      newErrors.Location = 'Location is required';
    }
    
    if (!storageFacility.Capacity || storageFacility.Capacity <= 0) {
      newErrors.Capacity = 'Capacity must be greater than 0';
    }
    
    if (!storageFacility.Security_Level?.trim()) {
      newErrors.Security_Level = 'Security level is required';
    }
    
    if (!storageFacility.Status?.trim()) {
      newErrors.Status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    console.log('Input changed:', name, value);
    
    setStorageFacility((prev) => {
      const updatedValue = 
        name === 'Capacity' ? 
          parseInt(value, 10) || 0 
        : value;
      
      console.log('Setting', name, 'to', updatedValue);
      
      return {
        ...prev,
        [name]: updatedValue,
      };
    });
    
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
      console.log('Submitting data:', storageFacility);
      
      if (isEditMode && id) {
        const facilityId = parseInt(id, 10);
        console.log('Updating facility ID:', facilityId);
        
        const response = await storageFacilityApi.update(facilityId, storageFacility);
        console.log('Update response:', response);
        
        setSuccessMessage('Storage facility updated successfully');
      } else {
        console.log('Creating new facility');
        
        const response = await storageFacilityApi.create(storageFacility);
        console.log('Create response:', response);
        
        setSuccessMessage('Storage facility created successfully');
      }
      
      // Delay navigation to show success message
      setTimeout(() => navigate('/storage-facilities'), 1500);
    } catch (error: any) {
      console.error('Error saving storage facility:', error);
      let errorMessage = 'An error occurred while saving. Please try again.';
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/storage-facilities');
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!isInitialized) {
    return null;
  }
  
  return (
    <Box sx={{ position: 'relative', zIndex: 2 }}>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        message={successMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
      
      <PageHeader
        title={isEditMode ? 'Edit Storage Facility' : 'Add Storage Facility'}
        icon={<WarehouseIcon fontSize="large" />}
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
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <TextField
            label="Facility Name"
            name="Name"
            value={storageFacility.Name}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.Name}
            helperText={errors.Name}
          />
          
          <TextField
            label="Location"
            name="Location"
            value={storageFacility.Location}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.Location}
            helperText={errors.Location}
          />
          
          <TextField
            label="Capacity"
            name="Capacity"
            type="number"
            value={storageFacility.Capacity}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.Capacity}
            helperText={errors.Capacity}
          />
          
          <TextField
            select
            label="Security Level"
            name="Security_Level"
            value={storageFacility.Security_Level}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.Security_Level}
            helperText={errors.Security_Level}
          >
            {securityLevelOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            label="Status"
            name="Status"
            value={storageFacility.Status}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.Status}
            helperText={errors.Status}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            color="secondary"
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
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default StorageFacilityForm; 