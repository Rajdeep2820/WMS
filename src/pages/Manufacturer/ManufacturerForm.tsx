import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  SelectChangeEvent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FactoryIcon from '@mui/icons-material/Factory';
import { PageHeader } from '../../components/common';
import { manufacturerApi } from '../../services/api';
import { Manufacturer } from '../../types';

interface FormErrors {
  [key: string]: string;
}

const ManufacturerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<Partial<Manufacturer>>({
    Name: '',
    Country: '',
    Contact_Info: '',
    Status: 'Active'
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      fetchManufacturer(parseInt(id, 10));
    }
  }, [isEditMode, id]);

  const fetchManufacturer = async (manufacturerId: number) => {
    try {
      setLoading(true);
      const data = await manufacturerApi.getById(manufacturerId);
      setFormData(data);
    } catch (err: any) {
      console.error('Error fetching manufacturer:', err);
      setApiError('Failed to load manufacturer data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.Name?.trim()) {
      newErrors.Name = 'Name is required';
    }
    
    if (!formData.Country?.trim()) {
      newErrors.Country = 'Country is required';
    }
    
    if (!formData.Contact_Info?.trim()) {
      newErrors.Contact_Info = 'Contact information is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setApiError(null);
      
      if (isEditMode && id) {
        await manufacturerApi.update(parseInt(id, 10), formData as Manufacturer);
      } else {
        await manufacturerApi.create(formData as Manufacturer);
      }
      
      navigate('/manufacturers');
    } catch (err: any) {
      console.error('Error saving manufacturer:', err);
      setApiError('Failed to save manufacturer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when field is edited
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };
  
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (name && errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loading && isEditMode) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={isEditMode ? 'Edit Manufacturer' : 'Add New Manufacturer'}
        icon={<FactoryIcon />}
        showButton={false}
      />
      
      <Paper sx={{ p: 3, mb: 3 }}>
        {apiError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {apiError}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" gutterBottom>
              Manufacturer Information
            </Typography>
            
            <TextField
              required
              fullWidth
              label="Name"
              name="Name"
              value={formData.Name || ''}
              onChange={handleInputChange}
              error={!!errors.Name}
              helperText={errors.Name}
            />
            
            <TextField
              required
              fullWidth
              label="Country"
              name="Country"
              value={formData.Country || ''}
              onChange={handleInputChange}
              error={!!errors.Country}
              helperText={errors.Country}
            />
            
            <TextField
              required
              fullWidth
              label="Contact Information"
              name="Contact_Info"
              value={formData.Contact_Info || ''}
              onChange={handleInputChange}
              error={!!errors.Contact_Info}
              helperText={errors.Contact_Info}
              multiline
              rows={2}
            />
            
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="Status"
                value={formData.Status || 'Active'}
                onChange={handleSelectChange}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/manufacturers')}
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

export default ManufacturerForm; 