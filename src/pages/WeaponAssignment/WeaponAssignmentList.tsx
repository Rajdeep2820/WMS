import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { PageHeader, ConfirmDialog } from '../../components/common';
import { WeaponAssignment } from '../../types';
import { weaponAssignmentApi } from '../../services/api';
import { format } from 'date-fns';

const WeaponAssignmentList: React.FC = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<WeaponAssignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<WeaponAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [searchTerm, assignments]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weaponAssignmentApi.getAll();
      setAssignments(data);
      setFilteredAssignments(data);
    } catch (error) {
      console.error('Error fetching weapon assignments:', error);
      setError('Failed to load weapon assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterAssignments = () => {
    if (!searchTerm) {
      setFilteredAssignments(assignments);
      return;
    }

    const filtered = assignments.filter((assignment) => {
      const searchFields = [
        assignment.Weapon_Serial,
        assignment.First_Name,
        assignment.Last_Name,
        assignment.Unit_Name,
        assignment.Status,
      ];

      return searchFields.some(
        (field) => field && field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredAssignments(filtered);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = (id: number) => {
    setSelectedAssignmentId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedAssignmentId) {
      try {
        setError(null);
        await weaponAssignmentApi.delete(selectedAssignmentId);
        setOpenDialog(false);
        await fetchAssignments();
      } catch (error) {
        console.error('Error deleting weapon assignment:', error);
        setError('Failed to delete the weapon assignment. Please try again.');
        setOpenDialog(false);
      }
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
      return format(new Date(dateString), 'MMM dd, yyyy');
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

  return (
    <Box>
      <PageHeader
        title="Weapon Assignments"
        subtitle="View and manage all weapon assignments"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/weapon-assignments/new')}
          >
            New Assignment
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Search Assignments"
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by soldier, weapon, unit or status"
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Weapon</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Assignment Date</TableCell>
                <TableCell>Return Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAssignments.length > 0 ? (
                filteredAssignments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((assignment) => (
                    <TableRow key={assignment.Assignment_ID}>
                      <TableCell>{assignment.Assignment_ID}</TableCell>
                      <TableCell>{assignment.Weapon_Serial || `Weapon ID: ${assignment.Weapon_ID}`}</TableCell>
                      <TableCell>
                        {assignment.First_Name && assignment.Last_Name 
                          ? `${assignment.First_Name} ${assignment.Last_Name}`
                          : `Soldier ID: ${assignment.Soldier_ID}`}
                      </TableCell>
                      <TableCell>{assignment.Unit_Name || `Unit ID: ${assignment.Unit_ID}`}</TableCell>
                      <TableCell>{formatDate(assignment.Assignment_Date)}</TableCell>
                      <TableCell>{assignment.Return_Date ? formatDate(assignment.Return_Date) : 'Not Returned'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={assignment.Status} 
                          color={getStatusColor(assignment.Status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <IconButton 
                            color="primary" 
                            onClick={() => navigate(`/weapon-assignments/${assignment.Assignment_ID}`)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            color="primary"
                            onClick={() => navigate(`/weapon-assignments/${assignment.Assignment_ID}/edit`)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            color="error"
                            onClick={() => assignment.Assignment_ID && handleDelete(assignment.Assignment_ID)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No weapon assignments found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAssignments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <ConfirmDialog
        open={openDialog}
        title="Delete Weapon Assignment"
        content="Are you sure you want to delete this weapon assignment? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setOpenDialog(false)}
      />
    </Box>
  );
};

export default WeaponAssignmentList; 