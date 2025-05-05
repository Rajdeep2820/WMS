import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, parseISO } from 'date-fns';
import { WeaponAssignment, Weapon, Soldier, MilitaryUnit } from '../../types';
import { weaponAssignmentApi, weaponApi, soldierApi, militaryUnitApi } from '../../services/api';
import { PageHeader } from '../../components/common';

interface FormData extends Omit<WeaponAssignment, 'Assignment_Date' | 'Return_Date'> {
  Assignment_Date: Date | null;
  Return_Date: Date | null;
}

const initialFormData: FormData = {
  Weapon_ID: 0,
  Soldier_ID: 0,
  Unit_ID: 0,
  Assignment_Date: new Date(),
  Return_Date: null,
  Status: 'Active',
  Notes: ''
};

interface FormErrors {
  Weapon_ID?: string;
  Soldier_ID?: string;
  Unit_ID?: string;
  Assignment_Date?: string;
  Status?: string;
}

const WeaponAssignmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [militaryUnits, setMilitaryUnits] = useState<MilitaryUnit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(isEditMode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reference data
        const [weaponsData, soldiersData, unitsData] = await Promise.all([
          weaponApi.getAll(),
          soldierApi.getAll(),
          militaryUnitApi.getAll()
        ]);
        
        setWeapons(weaponsData);
        setSoldiers(soldiersData);
        setMilitaryUnits(unitsData);
        
        // If in edit mode, fetch the assignment
        if (isEditMode && id) {
          const assignment = await weaponAssignmentApi.getById(parseInt(id));
          setFormData({
            ...assignment,
            Assignment_Date: assignment.Assignment_Date ? parseISO(assignment.Assignment_Date) : null,
            Return_Date: assignment.Return_Date ? parseISO(assignment.Return_Date) : null
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setSaveError('Failed to load required data');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.Weapon_ID) {
      newErrors.Weapon_ID = 'Weapon is required';
    }
    
    if (!formData.Soldier_ID) {
      newErrors.Soldier_ID = 'Soldier is required';
    }
    
    if (!formData.Unit_ID) {
      newErrors.Unit_ID = 'Military unit is required';
    }
    
    if (!formData.Assignment_Date) {
      newErrors.Assignment_Date = 'Assignment date is required';
    }
    
    if (!formData.Status) {
      newErrors.Status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSaveError(null);
    
    try {
      // Format dates for API
      const apiData: WeaponAssignment = {
        ...formData,
        // Ensure IDs are numbers
        Weapon_ID: Number(formData.Weapon_ID),
        Soldier_ID: Number(formData.Soldier_ID),
        Unit_ID: Number(formData.Unit_ID),
        Assignment_Date: formData.Assignment_Date ? format(formData.Assignment_Date, 'yyyy-MM-dd') : '',
        Return_Date: formData.Return_Date ? format(formData.Return_Date, 'yyyy-MM-dd') : undefined
      };
      
      if (isEditMode && id) {
        await weaponAssignmentApi.update(parseInt(id), apiData);
      } else {
        await weaponAssignmentApi.create(apiData);
      }
      
      navigate('/weapon-assignments');
    } catch (error) {
      console.error('Error saving weapon assignment:', error);
      setSaveError('Failed to save weapon assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    
    if (name) {
      // Convert string values to numbers for ID fields
      if (name === 'Weapon_ID' || name === 'Soldier_ID' || name === 'Unit_ID') {
        setFormData(prev => ({
          ...prev,
          [name]: parseInt(value) || 0
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
      
      // Clear error for this field
      if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error for this field
      if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    }
  };

  const handleDateChange = (date: Date | null, fieldName: 'Assignment_Date' | 'Return_Date') => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: date
    }));
    
    if (fieldName === 'Assignment_Date' && errors.Assignment_Date) {
      setErrors(prev => ({
        ...prev,
        Assignment_Date: undefined
      }));
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={isEditMode ? 'Edit Weapon Assignment' : 'New Weapon Assignment'}
        subtitle={isEditMode ? 'Update weapon assignment details' : 'Assign a weapon to a soldier'}
      />
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        {saveError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {saveError}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.Weapon_ID}>
                <InputLabel id="weapon-label">Weapon</InputLabel>
                <Select
                  labelId="weapon-label"
                  name="Weapon_ID"
                  value={String(formData.Weapon_ID)}
                  onChange={handleSelectChange}
                  label="Weapon"
                >
                  <MenuItem value="0" disabled>
                    <em>Select a weapon</em>
                  </MenuItem>
                  {weapons.map(weapon => (
                    <MenuItem key={weapon.Weapon_ID} value={String(weapon.Weapon_ID)}>
                      {weapon.Name} - {weapon.Serial_Number || 'No Serial'}
                    </MenuItem>
                  ))}
                </Select>
                {errors.Weapon_ID && <FormHelperText>{errors.Weapon_ID}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.Soldier_ID}>
                <InputLabel id="soldier-label">Soldier</InputLabel>
                <Select
                  labelId="soldier-label"
                  name="Soldier_ID"
                  value={String(formData.Soldier_ID)}
                  onChange={handleSelectChange}
                  label="Soldier"
                >
                  <MenuItem value="0" disabled>
                    <em>Select a soldier</em>
                  </MenuItem>
                  {soldiers.map(soldier => (
                    <MenuItem key={soldier.Soldier_ID} value={String(soldier.Soldier_ID)}>
                      {soldier.First_Name} {soldier.Last_Name} - {soldier.Rank}
                    </MenuItem>
                  ))}
                </Select>
                {errors.Soldier_ID && <FormHelperText>{errors.Soldier_ID}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.Unit_ID}>
                <InputLabel id="unit-label">Military Unit</InputLabel>
                <Select
                  labelId="unit-label"
                  name="Unit_ID"
                  value={String(formData.Unit_ID)}
                  onChange={handleSelectChange}
                  label="Military Unit"
                >
                  <MenuItem value="0" disabled>
                    <em>Select a military unit</em>
                  </MenuItem>
                  {militaryUnits.map(unit => (
                    <MenuItem key={unit.Unit_ID} value={String(unit.Unit_ID)}>
                      {unit.Name} - {unit.Branch}
                    </MenuItem>
                  ))}
                </Select>
                {errors.Unit_ID && <FormHelperText>{errors.Unit_ID}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.Status}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="Status"
                  value={formData.Status}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Returned">Returned</MenuItem>
                  <MenuItem value="Lost">Lost</MenuItem>
                </Select>
                {errors.Status && <FormHelperText>{errors.Status}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Assignment Date"
                  value={formData.Assignment_Date}
                  onChange={(newValue) => handleDateChange(newValue, 'Assignment_Date')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.Assignment_Date}
                      helperText={errors.Assignment_Date}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Return Date"
                  value={formData.Return_Date}
                  onChange={(newValue) => handleDateChange(newValue, 'Return_Date')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="Notes"
                label="Notes"
                multiline
                rows={4}
                value={formData.Notes || ''}
                onChange={handleTextChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/weapon-assignments')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {isEditMode ? 'Update' : 'Create'} Assignment
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default WeaponAssignmentForm; 