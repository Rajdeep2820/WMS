import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BuildIcon from '@mui/icons-material/Build';
import { PageHeader, DataTable } from '../../components/common';
import { weaponMaintenanceApi } from '../../services/api';
import { WeaponMaintenance } from '../../types';

const MaintenanceList: React.FC = () => {
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState<WeaponMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching maintenance records...');
      
      const data = await weaponMaintenanceApi.getAll();
      console.log('Maintenance data:', data);
      
      setMaintenance(data);
    } catch (err) {
      console.error('Error fetching maintenance records:', err);
      setError('Failed to fetch maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await weaponMaintenanceApi.delete(id);
        fetchMaintenance();
      } catch (err) {
        console.error('Error deleting maintenance record:', err);
        setError('Failed to delete maintenance record');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Scheduled': return 'info';
      case 'In Progress': return 'warning';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const columns = [
    { id: 'Maintenance_ID', label: 'ID', minWidth: 50 },
    { id: 'Weapon_Name', label: 'Weapon', minWidth: 150 },
    { id: 'Weapon_Serial', label: 'Serial #', minWidth: 120 },
    { id: 'Type', label: 'Maintenance Type', minWidth: 120 },
    { id: 'Start_Date', label: 'Start Date', minWidth: 120, 
      format: (value: string) => formatDate(value) },
    { id: 'End_Date', label: 'End Date', minWidth: 120,
      format: (value: string) => formatDate(value) },
    { id: 'Technician', label: 'Technician', minWidth: 150 },
    { id: 'Cost', label: 'Cost', minWidth: 100,
      format: (value: number) => formatCurrency(value) },
    { id: 'Status', label: 'Status', minWidth: 100,
      format: (value: string) => (
        <Box
          component="span"
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            color: 'white',
            bgcolor: 
              value === 'Scheduled' ? 'info.main' :
              value === 'In Progress' ? 'warning.main' :
              value === 'Completed' ? 'success.main' :
              'error.main'
          }}
        >
          {value}
        </Box>
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      align: 'center' as const,
      format: (value: any, row: WeaponMaintenance) => (
        <Box>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => navigate(`/weapon-maintenance/${row.Maintenance_ID}`)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => navigate(`/weapon-maintenance/${row.Maintenance_ID}/edit`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDelete(row.Maintenance_ID || 0)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (error) return <div>{error}</div>;

  return (
    <Box>
      <PageHeader
        title="Weapon Maintenance"
        icon={<BuildIcon />}
        showButton
        buttonText="Add New Maintenance Record"
        buttonIcon={<AddIcon />}
        onButtonClick={() => navigate('/weapon-maintenance/new')}
      />
      <DataTable
        columns={columns}
        data={maintenance}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </Box>
  );
};

export default MaintenanceList; 