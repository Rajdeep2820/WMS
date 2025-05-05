import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { WeaponAssignment } from '../../types';
import { weaponAssignmentApi } from '../../services/api';
import { format } from 'date-fns';
import { PageHeader, ConfirmDialog } from '../../components/common';

const WeaponAssignmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<WeaponAssignment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('Missing assignment ID');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await weaponAssignmentApi.getById(parseInt(id));
        setAssignment(data);
      } catch (error) {
        console.error('Error fetching assignment:', error);
        setError('Failed to load assignment details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = () => {
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (!id) return;
    
    try {
      setError(null);
      await weaponAssignmentApi.delete(parseInt(id));
      navigate('/weapon-assignments');
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError('Failed to delete assignment. Please try again.');
      setOpenDialog(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Returned':
        return 'info';
      case 'Lost':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/weapon-assignments')}
          sx={{ mt: 2 }}
        >
          Back to Assignments
        </Button>
      </Box>
    );
  }

  if (!assignment) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">Assignment not found.</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/weapon-assignments')}
          sx={{ mt: 2 }}
        >
          Back to Assignments
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Weapon Assignment Details"
        subtitle={`Assignment #${assignment.Assignment_ID}`}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/weapon-assignments')}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/weapon-assignments/${id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Assignment Information</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip 
                  label={assignment.Status} 
                  color={getStatusColor(assignment.Status) as any}
                  size="small" 
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Assignment Date</Typography>
                <Typography variant="body2">{formatDate(assignment.Assignment_Date)}</Typography>
              </Box>
              
              {assignment.Return_Date && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Return Date</Typography>
                  <Typography variant="body2">{formatDate(assignment.Return_Date)}</Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Military Unit</Typography>
                <Typography variant="body2">{assignment.Unit_Name || `Unit ID: ${assignment.Unit_ID}`}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Weapon & Soldier</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>Weapon</Typography>
              <Typography variant="body2" paragraph>
                {assignment.Weapon_Serial || `Weapon ID: ${assignment.Weapon_ID}`}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>Assigned To</Typography>
              <Typography variant="body2" paragraph>
                {assignment.First_Name && assignment.Last_Name 
                  ? `${assignment.First_Name} ${assignment.Last_Name}`
                  : `Soldier ID: ${assignment.Soldier_ID}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {assignment.Notes && (
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Notes</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2">{assignment.Notes}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <ConfirmDialog
        open={openDialog}
        title="Delete Weapon Assignment"
        content="Are you sure you want to delete this assignment? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setOpenDialog(false)}
      />
    </Box>
  );
};

export default WeaponAssignmentDetails; 