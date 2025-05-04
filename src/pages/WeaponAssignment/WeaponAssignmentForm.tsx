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
import AssignmentIcon from '@mui/icons-material/Assignment';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { PageHeader } from '../../components/common';
import { WeaponAssignment } from '../../types';

// Mock weapon assignments
const mockAssignments: WeaponAssignment[] = [
  {
    id: 1,
    weaponId: 1,
    weaponName: 'M4A1 Carbine',
    soldierId: 1,
    soldierName: 'John Smith',
    assignDate: '2023-01-10',
    dueDate: '2023-07-10',
    status: 'Active',
    notes: 'Standard issue for training exercise',
  },
  {
    id: 2,
    weaponId: 2,
    weaponName: 'M9 Beretta',
    soldierId: 2,
    soldierName: 'Sarah Johnson',
    assignDate: '2023-02-05',
    dueDate: '2023-08-05',
    status: 'Active',
    notes: 'Secondary weapon for field operations',
  },
];

// Mock weapons for dropdown (only available weapons)
const mockWeapons = [
  { id: 1, name: 'M4A1 Carbine' },
  { id: 2, name: 'M9 Beretta' },
  { id: 3, name: 'M249 SAW' },
  { id: 4, name: 'M16A4' },
  { id: 5, name: 'Barrett M82' },
  { id: 6, name: 'M24 Sniper Rifle' },
  { id: 7, name: 'M240B Machine Gun' },
];

// Mock soldiers for dropdown (only active soldiers)
const mockSoldiers = [
  { id: 1, name: 'John Smith', rank: 'Sergeant' },
  { id: 2, name: 'Sarah Johnson', rank: 'Captain' },
  { id: 3, name: 'Michael Williams', rank: 'Private' },
  { id: 4, name: 'Emily Davis', rank: 'Lieutenant' },
  { id: 5, name: 'David Martinez', rank: 'Major' },
];

const emptyAssignment: Omit<WeaponAssignment, 'id'> = {
  weaponId: 0,
  soldierId: 0,
  assignDate: new Date().toISOString().split('T')[0],
  status: 'Active',
  notes: '',
};

const WeaponAssignmentForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isEditMode = id !== 'new';
  
  const [assignment, setAssignment] = useState<Omit<WeaponAssignment, 'id'>>(emptyAssignment);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const statusOptions: Array<WeaponAssignment['status']> = [
    'Active',
    'Returned',
    'Lost',
    'Damaged',
  ];
  
  useEffect(() => {
    if (isEditMode && id) {
      // In a real app, this would be an API call
      const foundAssignment = mockAssignments.find(
        (a) => a.id === parseInt(id, 10)
      );
      
      if (foundAssignment) {
        const { id, weaponName, soldierName, ...rest } = foundAssignment;
        setAssignment(rest);
      } else {
        // Assignment not found
        navigate('/weapon-assignments');
      }
    }
    setIsInitialized(true);
  }, [id, isEditMode, navigate]);
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!assignment.weaponId) {
      newErrors.weaponId = 'Weapon is required';
    }
    
    if (!assignment.soldierId) {
      newErrors.soldierId = 'Soldier is required';
    }
    
    if (!assignment.assignDate) {
      newErrors.assignDate = 'Assign date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(assignment.assignDate)) {
      newErrors.assignDate = 'Use format YYYY-MM-DD';
    }
    
    if (assignment.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(assignment.dueDate)) {
      newErrors.dueDate = 'Use format YYYY-MM-DD';
    }
    
    if (!assignment.status) {
      newErrors.status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setAssignment((prev) => ({
      ...prev,
      [name]: name === 'weaponId' || name === 'soldierId' 
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
      setSubmitError('Please fill in all required fields correctly.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Simulate API call with a longer delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // In a real app, you would make an API call here
      // isEditMode ? updateAssignment(id, assignment) : createAssignment(assignment);
      
      // Only navigate after successful submission
      navigate('/weapon-assignments');
    } catch (error) {
      setSubmitError('An error occurred while saving. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/weapon-assignments');
  };

  if (!isInitialized) {
    return null; // Don't render anything until initialization is complete
  }
  
  return (
    <Box sx={{ position: 'relative', zIndex: 2 }}>
      <PageHeader
        title={isEditMode ? 'Edit Weapon Assignment' : 'Add Weapon Assignment'}
        icon={<AssignmentIcon fontSize="large" />}
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
              select
              label="Weapon"
              name="weaponId"
              value={assignment.weaponId || ''}
              onChange={handleInputChange}
              error={!!errors.weaponId}
              helperText={errors.weaponId}
              required
            >
              {mockWeapons.map((weapon) => (
                <MenuItem key={weapon.id} value={weapon.id}>
                  {weapon.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Soldier"
              name="soldierId"
              value={assignment.soldierId || ''}
              onChange={handleInputChange}
              error={!!errors.soldierId}
              helperText={errors.soldierId}
              required
            >
              {mockSoldiers.map((soldier) => (
                <MenuItem key={soldier.id} value={soldier.id}>
                  {soldier.rank} {soldier.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Assign Date (YYYY-MM-DD)"
              name="assignDate"
              value={assignment.assignDate}
              onChange={handleInputChange}
              error={!!errors.assignDate}
              helperText={errors.assignDate}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Due Date (YYYY-MM-DD)"
              name="dueDate"
              value={assignment.dueDate || ''}
              onChange={handleInputChange}
              error={!!errors.dueDate}
              helperText={errors.dueDate}
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={assignment.status}
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
          
          <Box sx={{ flex: '1 1 100%', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={assignment.notes || ''}
              onChange={handleInputChange}
              multiline
              rows={4}
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

export default WeaponAssignmentForm; 