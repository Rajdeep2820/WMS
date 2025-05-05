import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { Soldier } from '../../types';
import { soldierApi } from '../../services/api';
import { PageHeader } from '../../components/common';

const SoldierList: React.FC = () => {
  const navigate = useNavigate();
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSoldiers();
  }, []);

  const fetchSoldiers = async () => {
    try {
      setLoading(true);
      const data = await soldierApi.getAll();
      setSoldiers(data);
    } catch (err) {
      console.error('Error fetching soldiers:', err);
      setError('Failed to fetch personnel data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this personnel record?')) {
      try {
        await soldierApi.delete(id);
        setSoldiers(prev => prev.filter(soldier => soldier.Soldier_ID !== id));
      } catch (err) {
        console.error('Error deleting soldier:', err);
        setError('Failed to delete personnel. Please try again.');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'error';
      case 'On Leave':
        return 'warning';
      default:
        return 'default';
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
        title="Personnel Management" 
        buttonText="Add New Personnel"
        showButton={true}
        buttonIcon={<AddIcon />}
        onButtonClick={() => navigate('/soldiers/new')}
      />
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Paper sx={{ mt: 3, p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Rank</TableCell>
                <TableCell>Serial Number</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {soldiers.map((soldier) => (
                <TableRow key={soldier.Soldier_ID}>
                  <TableCell>{soldier.Soldier_ID}</TableCell>
                  <TableCell>{`${soldier.First_Name} ${soldier.Last_Name}`}</TableCell>
                  <TableCell>{soldier.Rank}</TableCell>
                  <TableCell>{soldier.Serial_Number}</TableCell>
                  <TableCell>{soldier.Unit_Name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={soldier.Status} 
                      color={getStatusColor(soldier.Status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{soldier.Specialization}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => navigate(`/soldiers/${soldier.Soldier_ID}`)}
                      title="View Details"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => navigate(`/soldiers/${soldier.Soldier_ID}/edit`)}
                      title="Edit"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => soldier.Soldier_ID && handleDelete(soldier.Soldier_ID)}
                      title="Delete"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {soldiers.length === 0 && !loading && (
          <Box textAlign="center" py={3}>
            <Typography variant="body1" color="textSecondary">
              No personnel records found. Click "Add New Personnel" to create one.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SoldierList; 