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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { PageHeader } from '../../components/common';
import { Maintenance } from '../../types';

// Mock maintenance data
const mockMaintenance: Maintenance[] = [
  {
    id: 1,
    weaponId: 1,
    weaponName: 'M4A1 Carbine',
    type: 'Regular',
    startDate: '2023-01-15',
    endDate: '2023-01-18',
    technician: 'Robert Johnson',
    status: 'Completed',
    cost: 350,
    notes: 'Routine maintenance and cleaning',
  },
  {
    id: 2,
    weaponId: 2,
    weaponName: 'M9 Beretta',
    type: 'Repair',
    startDate: '2023-02-10',
    endDate: '2023-02-15',
    technician: 'Maria Garcia',
    status: 'Completed',
    cost: 520,
    notes: 'Trigger mechanism replacement',
  },
];

// Mock weapons data for dropdown
const mockWeapons = [
  { id: 1, name: 'M4A1 Carbine' },
  { id: 2, name: 'M9 Beretta' },
  { id: 3, name: 'M249 SAW' },
  { id: 4, name: 'M16A4' },
  { id: 5, name: 'Barrett M82' },
  { id: 6, name: 'M24 Sniper Rifle' },
  { id: 7, name: 'M240B Machine Gun' },
];

// Mock technicians
const mockTechnicians = [
  'Robert Johnson',
  'Maria Garcia',
  'David Lee',
  'Samuel Brown',
  'Lisa Wilson',
  'Michael Taylor',
  'Jessica Martinez',
];

const emptyMaintenance: Omit<Maintenance, 'id'> = {
  weaponId: 0,
  type: 'Regular',
  startDate: new Date().toISOString().split('T')[0],
  technician: '',
  status: 'Scheduled',
  notes: '',
};

const MaintenanceForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isEditMode = id !== 'new';
  
  const [maintenance, setMaintenance] = useState<Omit<Maintenance, 'id'>>(emptyMaintenance);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const maintenanceTypes: Array<Maintenance['type']> = [
    'Regular',
    'Repair',
    'Upgrade',
    'Inspection',
  ];
  
  const statusOptions: Array<Maintenance['status']> = [
    'Scheduled',
    'In Progress',
    'Completed',
    'Cancelled',
  ];
  
  useEffect(() => {
    if (isEditMode && id) {
      // In a real app, this would be an API call
      const foundMaintenance = mockMaintenance.find(
        (m) => m.id === parseInt(id, 10)
      );
      
      if (foundMaintenance) {
        const { id, weaponName, ...rest } = foundMaintenance;
        setMaintenance(rest);
        
        // Set the isComplete checkbox if endDate exists
        if (rest.endDate) {
          setIsComplete(true);
        }
      } else {
        // Maintenance record not found
        navigate('/maintenance');
      }
    }
    setIsInitialized(true);
  }, [id, isEditMode, navigate]);
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!maintenance.weaponId) {
      newErrors.weaponId = 'Weapon is required';
    }
    
    if (!maintenance.type) {
      newErrors.type = 'Maintenance type is required';
    }
    
    if (!maintenance.startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(maintenance.startDate)) {
      newErrors.startDate = 'Use format YYYY-MM-DD';
    }
    
    if (maintenance.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(maintenance.endDate)) {
      newErrors.endDate = 'Use format YYYY-MM-DD';
    }
    
    if (!maintenance.technician) {
      newErrors.technician = 'Technician is required';
    }
    
    if (maintenance.cost !== undefined && maintenance.cost < 0) {
      newErrors.cost = 'Cost cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setMaintenance((prev) => ({
      ...prev,
      [name]: name === 'weaponId' || name === 'cost' 
        ? (value === '' ? undefined : Number(value)) 
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
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setIsComplete(checked);
    
    if (checked) {
      // If checked, set end date to today
      setMaintenance((prev) => ({
        ...prev,
        endDate: new Date().toISOString().split('T')[0],
        status: 'Completed',
      }));
    } else {
      // If unchecked, clear end date
      setMaintenance((prev) => {
        const updated = { ...prev };
        delete updated.endDate;
        
        if (updated.status === 'Completed') {
          updated.status = 'In Progress';
        }
        
        return updated;
      });
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
      // isEditMode ? updateMaintenance(id, maintenance) : createMaintenance(maintenance);
      
      // Only navigate after successful submission
      navigate('/maintenance');
    } catch (error) {
      setSubmitError('An error occurred while saving. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/maintenance');
  };

  if (!isInitialized) {
    return null; // Don't render anything until initialization is complete
  }
  
  return (
    <Box sx={{ position: 'relative', zIndex: 2 }}>
      <PageHeader
        title={isEditMode ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
        icon={<BuildIcon fontSize="large" />}
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
              value={maintenance.weaponId || ''}
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
              label="Maintenance Type"
              name="type"
              value={maintenance.type}
              onChange={handleInputChange}
              error={!!errors.type}
              helperText={errors.type}
              required
            >
              {maintenanceTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Start Date (YYYY-MM-DD)"
              name="startDate"
              value={maintenance.startDate}
              onChange={handleInputChange}
              error={!!errors.startDate}
              helperText={errors.startDate}
              required
            />
          </Box>
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              select
              label="Technician"
              name="technician"
              value={maintenance.technician}
              onChange={handleInputChange}
              error={!!errors.technician}
              helperText={errors.technician}
              required
            >
              {mockTechnicians.map((tech) => (
                <MenuItem key={tech} value={tech}>
                  {tech}
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
              value={maintenance.status}
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
          
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Cost ($)"
              name="cost"
              type="number"
              value={maintenance.cost ?? ''}
              onChange={handleInputChange}
              error={!!errors.cost}
              helperText={errors.cost}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Box>
          
          <Box sx={{ flex: '1 1 100%', minWidth: '300px' }}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={maintenance.notes || ''}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
          </Box>
          
          <Box sx={{ flex: '1 1 100%' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isComplete}
                  onChange={handleCheckboxChange}
                  name="isComplete"
                  color="primary"
                />
              }
              label="Maintenance is complete"
            />
            
            {isComplete && (
              <TextField
                sx={{ mt: 2 }}
                fullWidth
                label="End Date (YYYY-MM-DD)"
                name="endDate"
                value={maintenance.endDate || ''}
                onChange={handleInputChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
              />
            )}
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

export default MaintenanceForm; 