import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  FormHelperText
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import GavelIcon from '@mui/icons-material/Gavel';
import { PageHeader } from '../../components/common';
import { Weapon, Manufacturer } from '../../types';
import { weaponApi, manufacturerApi } from '../../services/api';

// Define the weapon status options to match the database ENUM
const statusOptions = ['Active', 'Inactive', 'Under Maintenance'];

interface WeaponFormData {
  Name: string;
  Type: string;
  Model: string;
  Serial_Number: string;
  Manufacturer_ID: number | '';
  Status: string;
  Caliber?: string;
  Assigned_Unit_ID?: number | null;
  Last_Inspection_Date?: string | null;
  Facility_ID?: number | null;
  Acquisition_Date?: string | null;
}

const initialFormData: WeaponFormData = {
  Name: '',
  Type: '',
  Model: '',
  Serial_Number: '',
  Manufacturer_ID: '',
  Status: 'Active',
  Caliber: '',
  Assigned_Unit_ID: null,
  Last_Inspection_Date: null,
  Facility_ID: null,
  Acquisition_Date: null
};

const WeaponForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<WeaponFormData>(initialFormData);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Fetch weapon data and manufacturers
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch manufacturers regardless of mode
        const manufacturersData = await manufacturerApi.getAll();
        setManufacturers(manufacturersData);
        
        // If in edit mode, fetch the weapon data
        if (isEditMode && id) {
          const weaponData = await weaponApi.getById(parseInt(id, 10));
          setFormData({
            Name: weaponData.Name || '',
            Type: weaponData.Type || '',
            Model: weaponData.Model || '',
            Serial_Number: weaponData.Serial_Number || '',
            Manufacturer_ID: weaponData.Manufacturer_ID || '',
            Status: weaponData.Status || 'Active',
            Caliber: (weaponData as any).Caliber || '',
            Assigned_Unit_ID: (weaponData as any).Assigned_Unit_ID || null,
            Last_Inspection_Date: (weaponData as any).Last_Inspection_Date || null,
            Facility_ID: (weaponData as any).Facility_ID || null,
            Acquisition_Date: (weaponData as any).Acquisition_Date || null
          });
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);
  
  // Handle text field changes
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear validation error for this field
      if (validationErrors[name]) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };
  
  // Handle select field changes
  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    const { name, value } = e.target;
    
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear validation error for this field
      if (validationErrors[name]) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.Name) {
      errors.Name = 'Name is required';
    }
    
    if (!formData.Type) {
      errors.Type = 'Type is required';
    }
    
    if (!formData.Model) {
      errors.Model = 'Model is required';
    }
    
    if (!formData.Serial_Number) {
      errors.Serial_Number = 'Serial Number is required';
    }
    
    if (!formData.Manufacturer_ID) {
      errors.Manufacturer_ID = 'Manufacturer is required';
    }
    
    if (!formData.Status) {
      errors.Status = 'Status is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaveLoading(true);
    
    try {
      // Prepare the data, including all fields expected by the backend
      const weaponData = {
        Name: formData.Name,
        Type: formData.Type,
        Model: formData.Model,
        Serial_Number: formData.Serial_Number,
        Manufacturer_ID: formData.Manufacturer_ID !== '' ? Number(formData.Manufacturer_ID) : null,
        Caliber: formData.Caliber || null,
        Status: formData.Status || 'Active',
        Assigned_Unit_ID: formData.Assigned_Unit_ID || null,
        Last_Inspection_Date: formData.Last_Inspection_Date || null,
        Facility_ID: formData.Facility_ID || null,
        Acquisition_Date: formData.Acquisition_Date || undefined
      };
      
      console.log('Form data prepared for submission:', weaponData);
      
      if (isEditMode && id) {
        // Update existing weapon
        console.log('Updating weapon with ID:', id);
        try {
          const response = await weaponApi.update(parseInt(id, 10), weaponData as unknown as Weapon);
          console.log('Update response:', response);
          navigate(`/weapons/${id}`);
        } catch (updateError: any) {
          console.error('Detailed update error:', updateError);
          throw updateError;
        }
      } else {
        // Create new weapon
        console.log('Creating new weapon');
        try {
          const result = await weaponApi.create(weaponData as unknown as Weapon);
          console.log('Create response:', result);
          navigate(`/weapons/${result.id}`);
        } catch (createError: any) {
          console.error('Detailed create error:', createError);
          throw createError;
        }
      }
    } catch (err: any) {
      console.error('Error saving weapon:', err);
      if (err.response) {
        console.error('Server response:', err.response.data);
        setError(err.response.data.message || 'Failed to save weapon');
      } else {
        setError(err.message || 'Failed to save weapon');
      }
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    if (isEditMode && id) {
      navigate(`/weapons/${id}`);
    } else {
      navigate('/weapons');
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <PageHeader
        title={isEditMode ? 'Edit Weapon' : 'Add New Weapon'}
        icon={<GavelIcon fontSize="large" />}
        showButton={false}
      />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Card variant="outlined">
        <CardHeader title="Weapon Information" />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Weapon Name"
                name="Name"
                value={formData.Name}
                onChange={handleTextChange}
                error={!!validationErrors.Name}
                helperText={validationErrors.Name}
                required
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Type"
                  name="Type"
                  value={formData.Type}
                  onChange={handleTextChange}
                  error={!!validationErrors.Type}
                  helperText={validationErrors.Type}
                  required
                />
                
                <TextField
                  fullWidth
                  label="Model"
                  name="Model"
                  value={formData.Model}
                  onChange={handleTextChange}
                  error={!!validationErrors.Model}
                  helperText={validationErrors.Model}
                  required
                />
              </Box>
              
              <TextField
                fullWidth
                label="Serial Number"
                name="Serial_Number"
                value={formData.Serial_Number}
                onChange={handleTextChange}
                error={!!validationErrors.Serial_Number}
                helperText={validationErrors.Serial_Number}
                required
              />
              
              <FormControl fullWidth error={!!validationErrors.Manufacturer_ID} required>
                <InputLabel id="manufacturer-label">Manufacturer</InputLabel>
                <Select
                  labelId="manufacturer-label"
                  name="Manufacturer_ID"
                  value={formData.Manufacturer_ID}
                  onChange={handleSelectChange}
                  label="Manufacturer"
                >
                  {manufacturers.map((manufacturer) => (
                    <MenuItem key={manufacturer.Manufacturer_ID} value={manufacturer.Manufacturer_ID}>
                      {manufacturer.Name} ({manufacturer.Country || 'Unknown'})
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.Manufacturer_ID && (
                  <FormHelperText>{validationErrors.Manufacturer_ID}</FormHelperText>
                )}
              </FormControl>
              
              <FormControl fullWidth error={!!validationErrors.Status} required>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="Status"
                  value={formData.Status}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.Status && (
                  <FormHelperText>{validationErrors.Status}</FormHelperText>
                )}
              </FormControl>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={saveLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Saving...' : 'Save Weapon'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WeaponForm; 