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
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { PageHeader } from '../../components/common';
import { Soldier } from '../../types';
import { soldierApi, militaryUnitApi } from '../../services/api';

const rankOptions = [
  'Private',
  'Corporal',
  'Sergeant',
  'Lieutenant',
  'Captain',
  'Major',
  'Colonel',
  'General',
];

const statusOptions = ['Active', 'Inactive', 'On Leave'];

const specializationOptions = [
  'Infantry',
  'Artillery',
  'Armor',
  'Engineer',
  'Communications',
  'Intelligence',
  'Medical',
  'Logistics',
];

const SoldierForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isEditMode = id !== 'new';
  
  const initialSoldierState: Omit<Soldier, 'Soldier_ID'> = {
    First_Name: '',
    Last_Name: '',
    Rank: '',
    Serial_Number: '',
    Date_of_Birth: '',
    Join_Date: '',
    Unit_ID: 0,
    Status: 'Active',
    Specialization: '',
  };
  
  const [soldier, setSoldier] = useState<Omit<Soldier, 'Soldier_ID'>>(initialSoldierState);
  const [militaryUnits, setMilitaryUnits] = useState<{ Unit_ID: number | undefined; Name: string }[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const fetchMilitaryUnits = async () => {
      try {
        const response = await militaryUnitApi.getAll();
        setMilitaryUnits(response.map((unit: any) => ({
          Unit_ID: unit.Unit_ID,
          Name: unit.Name
        })) || []);
      } catch (error) {
        console.error('Error fetching military units:', error);
      }
    };
    
    fetchMilitaryUnits();
    
    if (isEditMode && id) {
      const fetchSoldier = async () => {
        try {
          const response = await soldierApi.getById(parseInt(id, 10));
          setSoldier({
            First_Name: response.First_Name || '',
            Last_Name: response.Last_Name || '',
            Rank: response.Rank || '',
            Serial_Number: response.Serial_Number || '',
            Date_of_Birth: response.Date_of_Birth || '',
            Join_Date: response.Join_Date || '',
            Unit_ID: response.Unit_ID || 0,
            Status: response.Status || 'Active',
            Specialization: response.Specialization || '',
          });
        } catch (error) {
          console.error('Error fetching soldier:', error);
          navigate('/soldiers');
        }
      };
      
      fetchSoldier();
    }
    
    setIsInitialized(true);
  }, [id, isEditMode, navigate]);
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!soldier.First_Name?.trim()) {
      newErrors.First_Name = 'First name is required';
    }
    
    if (!soldier.Last_Name?.trim()) {
      newErrors.Last_Name = 'Last name is required';
    }
    
    if (!soldier.Rank?.trim()) {
      newErrors.Rank = 'Rank is required';
    }
    
    if (!soldier.Serial_Number?.trim()) {
      newErrors.Serial_Number = 'Serial number is required';
    }
    
    if (!soldier.Date_of_Birth?.trim()) {
      newErrors.Date_of_Birth = 'Date of birth is required';
    }
    
    if (!soldier.Join_Date?.trim()) {
      newErrors.Join_Date = 'Join date is required';
    }
    
    if (!soldier.Unit_ID) {
      newErrors.Unit_ID = 'Unit is required';
    }
    
    if (!soldier.Status?.trim()) {
      newErrors.Status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setSoldier((prev) => ({
      ...prev,
      [name]: name === 'Unit_ID' ? parseInt(value, 10) || 0 : value,
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
        await soldierApi.update(parseInt(id, 10), soldier);
      } else {
        await soldierApi.create(soldier);
      }
      
      navigate('/soldiers');
    } catch (error) {
      setSubmitError('An error occurred while saving. Please try again.');
      console.error('Error saving soldier:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/soldiers');
  };
  
  if (!isInitialized) {
    return null;
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
          {/* Personal Information */}
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="First Name"
              name="First_Name"
              value={soldier.First_Name}
              onChange={handleInputChange}
              error={!!errors.First_Name}
              helperText={errors.First_Name}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Last Name"
              name="Last_Name"
              value={soldier.Last_Name}
              onChange={handleInputChange}
              error={!!errors.Last_Name}
              helperText={errors.Last_Name}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Rank"
              name="Rank"
              value={soldier.Rank}
              onChange={handleInputChange}
              error={!!errors.Rank}
              helperText={errors.Rank}
              required
            >
              {rankOptions.map((rank) => (
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
              name="Serial_Number"
              value={soldier.Serial_Number}
              onChange={handleInputChange}
              error={!!errors.Serial_Number}
              helperText={errors.Serial_Number}
              required
            />
          </Box>
          
          {/* Dates */}
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="Date_of_Birth"
              type="date"
              value={soldier.Date_of_Birth}
              onChange={handleInputChange}
              error={!!errors.Date_of_Birth}
              helperText={errors.Date_of_Birth || 'MM/DD/YYYY'}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Join Date"
              name="Join_Date"
              type="date"
              value={soldier.Join_Date}
              onChange={handleInputChange}
              error={!!errors.Join_Date}
              helperText={errors.Join_Date || 'MM/DD/YYYY'}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          
          {/* Unit and Status */}
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Military Unit"
              name="Unit_ID"
              value={soldier.Unit_ID || ''}
              onChange={handleInputChange}
              error={!!errors.Unit_ID}
              helperText={errors.Unit_ID}
              required
            >
              {militaryUnits.map((unit) => (
                <MenuItem key={unit.Unit_ID || `temp-${unit.Name}`} value={unit.Unit_ID || 0}>
                  {unit.Name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Status"
              name="Status"
              value={soldier.Status}
              onChange={handleInputChange}
              error={!!errors.Status}
              helperText={errors.Status}
              required
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Specialization"
              name="Specialization"
              value={soldier.Specialization}
              onChange={handleInputChange}
              error={!!errors.Specialization}
              helperText={errors.Specialization}
              required
            >
              {specializationOptions.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
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

export { SoldierForm };
export default SoldierForm; 