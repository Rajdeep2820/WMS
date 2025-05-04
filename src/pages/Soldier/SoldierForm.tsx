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
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { PageHeader } from '../../components/common';
import { Soldier } from '../../types';

// Mock soldiers data
const mockSoldiers: Soldier[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    rank: 'Sergeant',
    serialNumber: 'SN-10045872',
    dateOfBirth: '1992-05-15',
    joinDate: '2010-07-25',
    unitId: 1,
    unitName: '1st Infantry Division',
    status: 'Active',
    specialization: 'Infantry',
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Johnson',
    rank: 'Captain',
    serialNumber: 'SN-20078945',
    dateOfBirth: '1988-11-30',
    joinDate: '2006-02-10',
    unitId: 2,
    unitName: '5th Armored Brigade',
    status: 'Active',
    specialization: 'Armored',
  },
];

// Mock military units
const mockMilitaryUnits = [
  { id: 1, name: '1st Infantry Division' },
  { id: 2, name: '5th Armored Brigade' },
  { id: 3, name: '10th Special Forces Group' },
  { id: 4, name: '101st Airborne Division' },
  { id: 5, name: '3rd Field Artillery Regiment' },
];

// Common ranks
const ranks = [
  'Private',
  'Corporal',
  'Sergeant',
  'Lieutenant',
  'Captain',
  'Major',
  'Colonel',
  'General',
];

// Common specializations
const specializations = [
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

const emptySoldier: Omit<Soldier, 'id'> = {
  firstName: '',
  lastName: '',
  rank: '',
  serialNumber: '',
  dateOfBirth: '',
  joinDate: '',
  unitId: 0,
  status: 'Active',
  specialization: '',
};

const SoldierForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isEditMode = id !== 'new';
  
  const [soldier, setSoldier] = useState<Omit<Soldier, 'id'>>(emptySoldier);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const statusOptions: Array<Soldier['status']> = [
    'Active',
    'Leave',
    'Training',
    'Deployed',
    'Retired',
  ];
  
  useEffect(() => {
    if (isEditMode && id) {
      // In a real app, this would be an API call
      const foundSoldier = mockSoldiers.find(
        (s) => s.id === parseInt(id, 10)
      );
      
      if (foundSoldier) {
        const { id, unitName, ...rest } = foundSoldier;
        setSoldier(rest);
      } else {
        // Soldier not found
        navigate('/soldiers');
      }
    }
    setIsInitialized(true);
  }, [id, isEditMode, navigate]);
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!soldier.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!soldier.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!soldier.rank) {
      newErrors.rank = 'Rank is required';
    }
    
    if (!soldier.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }
    
    if (!soldier.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(soldier.dateOfBirth)) {
      newErrors.dateOfBirth = 'Use format YYYY-MM-DD';
    }
    
    if (!soldier.joinDate) {
      newErrors.joinDate = 'Join date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(soldier.joinDate)) {
      newErrors.joinDate = 'Use format YYYY-MM-DD';
    }
    
    if (!soldier.unitId) {
      newErrors.unitId = 'Unit is required';
    }
    
    if (!soldier.specialization) {
      newErrors.specialization = 'Specialization is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setSoldier((prev) => ({
      ...prev,
      [name]: name === 'unitId' ? parseInt(value, 10) || 0 : value,
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
      // isEditMode ? updateSoldier(id, soldier) : createSoldier(soldier);
      
      // Only navigate after successful submission
      navigate('/soldiers');
    } catch (error) {
      setSubmitError('An error occurred while saving. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/soldiers');
  };

  if (!isInitialized) {
    return null; // Don't render anything until initialization is complete
  }
  
  return (
    <Box sx={{ position: 'relative', zIndex: 2 }}>
      <PageHeader
        title={isEditMode ? 'Edit Soldier' : 'Add Soldier'}
        icon={<PersonIcon fontSize="large" />}
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
              label="First Name"
              name="firstName"
              value={soldier.firstName}
              onChange={handleInputChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={soldier.lastName}
              onChange={handleInputChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Rank"
              name="rank"
              value={soldier.rank}
              onChange={handleInputChange}
              error={!!errors.rank}
              helperText={errors.rank}
              required
            >
              {ranks.map((rank) => (
                <MenuItem key={rank} value={rank}>
                  {rank}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Serial Number"
              name="serialNumber"
              value={soldier.serialNumber}
              onChange={handleInputChange}
              error={!!errors.serialNumber}
              helperText={errors.serialNumber}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Date of Birth (YYYY-MM-DD)"
              name="dateOfBirth"
              value={soldier.dateOfBirth}
              onChange={handleInputChange}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Join Date (YYYY-MM-DD)"
              name="joinDate"
              value={soldier.joinDate}
              onChange={handleInputChange}
              error={!!errors.joinDate}
              helperText={errors.joinDate}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Unit"
              name="unitId"
              value={soldier.unitId || ''}
              onChange={handleInputChange}
              error={!!errors.unitId}
              helperText={errors.unitId}
              required
            >
              {mockMilitaryUnits.map((unit) => (
                <MenuItem key={unit.id} value={unit.id}>
                  {unit.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Specialization"
              name="specialization"
              value={soldier.specialization}
              onChange={handleInputChange}
              error={!!errors.specialization}
              helperText={errors.specialization}
              required
            >
              {specializations.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={soldier.status}
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

export default SoldierForm; 