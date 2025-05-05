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
} from '@mui/material';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { PageHeader } from '../../components/common';
import { MilitaryUnit } from '../../types';
import { militaryUnitApi } from '../../services/api';

const branchOptions = [
  'Army',
  'Navy',
  'Air Force',
  'Marines', 
  'Coast Guard',
  'Special Forces',
  'National Guard',
  'Reserve',
];

const statusOptions = ['Active', 'Inactive', 'Training', 'Deployed', 'Reserve', 'Disbanded'];

const MilitaryUnitForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isEditMode = id !== 'new';
  
  const initialMilitaryUnitState: Omit<MilitaryUnit, 'Unit_ID'> = {
    Name: '',
    Branch: '',
    Location: '',
    Commanding_Officer: '',
  };
  
  const [militaryUnit, setMilitaryUnit] = useState<Omit<MilitaryUnit, 'Unit_ID'>>(initialMilitaryUnitState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (isEditMode && id) {
      const fetchMilitaryUnit = async () => {
        try {
          const response = await militaryUnitApi.getById(parseInt(id, 10));
          
          // Map the response to the correct MilitaryUnit interface properties
          setMilitaryUnit({
            Name: response.Name || '',
            Branch: response.Branch || '',
            Location: response.Location || '',
            Commanding_Officer: response.Commanding_Officer || '',
          });
        } catch (error) {
          console.error('Error fetching military unit:', error);
          navigate('/military-units');
        }
      };
      
      fetchMilitaryUnit();
    }
    setIsInitialized(true);
  }, [id, isEditMode, navigate]);
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!militaryUnit.Name?.trim()) {
      newErrors.Name = 'Name is required';
    }
    
    if (!militaryUnit.Branch?.trim()) {
      newErrors.Branch = 'Branch is required';
    }
    
    if (!militaryUnit.Location?.trim()) {
      newErrors.Location = 'Location is required';
    }
    
    if (!militaryUnit.Commanding_Officer?.trim()) {
      newErrors.Commanding_Officer = 'Commanding Officer is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setMilitaryUnit((prev) => ({
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
      setSubmitError('Please fill in all required fields correctly.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      if (isEditMode && id) {
        await militaryUnitApi.update(parseInt(id, 10), militaryUnit);
      } else {
        await militaryUnitApi.create(militaryUnit);
      }
      
      navigate('/military-units');
    } catch (error) {
      setSubmitError('An error occurred while saving. Please try again.');
      console.error('Error saving military unit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/military-units');
  };

  if (!isInitialized) {
    return null;
  }
  
  return (
    <Box sx={{ position: 'relative', zIndex: 2 }}>
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
              label="Unit Name"
              name="Name"
              value={militaryUnit.Name}
              onChange={handleInputChange}
              error={!!errors.Name}
              helperText={errors.Name}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Location"
              name="Location"
              value={militaryUnit.Location}
              onChange={handleInputChange}
              error={!!errors.Location}
              helperText={errors.Location}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Commanding Officer"
              name="Commanding_Officer"
              value={militaryUnit.Commanding_Officer}
              onChange={handleInputChange}
              error={!!errors.Commanding_Officer}
              helperText={errors.Commanding_Officer}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Branch"
              name="Branch"
              value={militaryUnit.Branch}
              onChange={handleInputChange}
              error={!!errors.Branch}
              helperText={errors.Branch}
              required
            >
              {branchOptions.map((branch) => (
                <MenuItem key={branch} value={branch}>
                  {branch}
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

export default MilitaryUnitForm; 