import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  MenuItem,
  CircularProgress,
  SelectChangeEvent,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { PageHeader } from '../../components/common';
import { ammunitionApi } from '../../services/api';
import { Ammunition } from '../../types';

const AmmunitionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Ammunition>>({
    Name: '',
    Type: '',
    Caliber: '',
    Quantity: 0,
    Manufacturer_ID: undefined,
    Facility_ID: undefined,
    Status: 'Available',
    Batch_Number: '',
  });

  useEffect(() => {
    if (id) {
      fetchAmmunition();
    }
  }, [id]);

  const fetchAmmunition = async () => {
    try {
      setLoading(true);
      const data = await ammunitionApi.getById(parseInt(id!, 10));
      console.log('Ammunition data loaded:', data);
      setFormData(data);
    } catch (err) {
      console.error('Error fetching ammunition:', err);
      setError('Failed to fetch ammunition data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Create a copy of form data for submission
      const submissionData = { ...formData };
      
      // Format dates properly for MySQL - convert ISO string to 'YYYY-MM-DD' format
      if (submissionData.Production_Date) {
        const prodDate = new Date(submissionData.Production_Date);
        submissionData.Production_Date = prodDate.toISOString().split('T')[0];
      }
      
      if (submissionData.Expiration_Date) {
        const expDate = new Date(submissionData.Expiration_Date);
        submissionData.Expiration_Date = expDate.toISOString().split('T')[0];
      }
      
      // Check if Manufacturer_ID and Facility_ID exist and are valid
      if (submissionData.Manufacturer_ID !== undefined && submissionData.Manufacturer_ID <= 0) {
        submissionData.Manufacturer_ID = undefined;
      }
      
      if (submissionData.Facility_ID !== undefined && submissionData.Facility_ID <= 0) {
        submissionData.Facility_ID = undefined;
      }
      
      console.log('Submitting ammunition data:', submissionData);
      
      if (id) {
        await ammunitionApi.update(parseInt(id, 10), submissionData as Ammunition);
      } else {
        await ammunitionApi.create(submissionData as Ammunition);
      }
      
      navigate('/ammunition');
    } catch (err) {
      console.error('Error saving ammunition:', err);
      setError('Failed to save ammunition');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields
    if (name === 'Quantity' || name === 'Manufacturer_ID' || name === 'Facility_ID') {
      const numValue = name === 'Quantity' ? parseInt(value) || 0 : value === '' ? undefined : parseInt(value);
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const statusOptions = ['Available', 'Reserved', 'Depleted', 'Expired'];

  if (loading && id) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={id ? 'Edit Ammunition' : 'Add New Ammunition'}
        showButton={false}
      />
      <Paper sx={{ p: 3 }}>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="Name"
                  value={formData.Name || ''}
                  onChange={handleChange}
                  required
                />
              </Box>
              
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Type"
                  name="Type"
                  value={formData.Type || ''}
                  onChange={handleChange}
                  required
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Caliber"
                  name="Caliber"
                  value={formData.Caliber || ''}
                  onChange={handleChange}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Batch Number"
                  name="Batch_Number"
                  value={formData.Batch_Number || ''}
                  onChange={handleChange}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="Quantity"
                  type="number"
                  value={formData.Quantity || 0}
                  onChange={handleChange}
                  required
                />
              </Box>
              
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="Status"
                    value={formData.Status || 'Available'}
                    label="Status"
                    onChange={handleSelectChange}
                    required
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Manufacturer ID"
                  name="Manufacturer_ID"
                  type="number"
                  value={formData.Manufacturer_ID || ''}
                  onChange={handleChange}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Facility ID"
                  name="Facility_ID"
                  type="number"
                  value={formData.Facility_ID || ''}
                  onChange={handleChange}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/ammunition')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : (id ? 'Update' : 'Create')}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AmmunitionForm; 