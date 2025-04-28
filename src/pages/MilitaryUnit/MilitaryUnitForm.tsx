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
  MenuItem,
} from '@mui/material';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { PageHeader } from '../../components/common';
import { MilitaryUnit } from '../../types';

// Mock military units data (in a real app would come from an API)
const mockMilitaryUnits: MilitaryUnit[] = [
  {
    id: 1,
    name: '1st Infantry Division',
    location: 'Fort Riley, Kansas',
    commanderName: 'Colonel James Wilson',
    type: 'Infantry',
    personnel: 12500,
    established: '1917-06-14',
  },
  {
    id: 2,
    name: '5th Armored Brigade',
    location: 'Fort Bliss, Texas',
    commanderName: 'Colonel Sarah Johnson',
    type: 'Armored',
    personnel: 8200,
    established: '1942-10-01',
  },
];

const emptyMilitaryUnit: Omit<MilitaryUnit, 'id'> = {
  name: '',
  location: '',
  commanderName: '',
  type: '',
  personnel: 0,
  established: '',
};

const unitTypes = [
  'Infantry',
  'Armored',
  'Artillery',
  'Aviation',
  'Special Forces',
  'Medical',
  'Intelligence',
  'Engineering',
  'Supply',
  'Communication',
];

const MilitaryUnitForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isEditMode = id !== 'new';
  
  const [militaryUnit, setMilitaryUnit] = useState<Omit<MilitaryUnit, 'id'>>(emptyMilitaryUnit);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isEditMode) {
      // In a real app, this would be an API call
      const foundMilitaryUnit = mockMilitaryUnits.find(
        (m) => m.id === parseInt(id!, 10)
      );
      
      if (foundMilitaryUnit) {
        const { id, ...rest } = foundMilitaryUnit;
        setMilitaryUnit(rest);
      } else {
        // Military unit not found
        navigate('/military-units');
      }
    }
  }, [id, isEditMode, navigate]);
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!militaryUnit.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!militaryUnit.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!militaryUnit.commanderName.trim()) {
      newErrors.commanderName = 'Commander name is required';
    }
    
    if (!militaryUnit.type) {
      newErrors.type = 'Unit type is required';
    }
    
    if (!militaryUnit.personnel || militaryUnit.personnel <= 0) {
      newErrors.personnel = 'Personnel count must be greater than 0';
    }
    
    if (!militaryUnit.established.trim()) {
      newErrors.established = 'Established date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(militaryUnit.established)) {
      newErrors.established = 'Use format YYYY-MM-DD';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setMilitaryUnit((prev) => ({
      ...prev,
      [name]: name === 'personnel' ? parseInt(value, 10) || 0 : value,
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
      // isEditMode ? updateMilitaryUnit(id, militaryUnit) : createMilitaryUnit(militaryUnit);
      
      navigate('/military-units');
    } catch (error) {
      setSubmitError('An error occurred while saving. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/military-units');
  };
  
  return (
    <Box>
      <PageHeader
        title={isEditMode ? 'Edit Military Unit' : 'Add Military Unit'}
        icon={<MilitaryTechIcon fontSize="large" />}
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
              label="Unit Name"
              name="name"
              value={militaryUnit.name}
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
              value={militaryUnit.location}
              onChange={handleInputChange}
              error={!!errors.location}
              helperText={errors.location}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Commander Name"
              name="commanderName"
              value={militaryUnit.commanderName}
              onChange={handleInputChange}
              error={!!errors.commanderName}
              helperText={errors.commanderName}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Unit Type"
              name="type"
              value={militaryUnit.type}
              onChange={handleInputChange}
              error={!!errors.type}
              helperText={errors.type}
              required
            >
              {unitTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Personnel Count"
              name="personnel"
              type="number"
              value={militaryUnit.personnel || ''}
              onChange={handleInputChange}
              error={!!errors.personnel}
              helperText={errors.personnel}
              required
              inputProps={{ min: 1 }}
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Established (YYYY-MM-DD)"
              name="established"
              value={militaryUnit.established}
              onChange={handleInputChange}
              error={!!errors.established}
              helperText={errors.established}
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

export default MilitaryUnitForm; 