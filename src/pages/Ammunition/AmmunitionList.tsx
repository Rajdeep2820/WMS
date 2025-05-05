import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { PageHeader, DataTable } from '../../components/common';
import { ammunitionApi } from '../../services/api';
import { Ammunition } from '../../types';

const AmmunitionList: React.FC = () => {
  const navigate = useNavigate();
  const [ammunition, setAmmunition] = useState<Ammunition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchAmmunition();
  }, []);

  const fetchAmmunition = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching ammunition...');
      
      const data = await ammunitionApi.getAll();
      console.log('Ammunition data:', data);
      
      setAmmunition(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching ammunition:', err);
      setError('Failed to fetch ammunition data');
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this ammunition?')) {
      try {
        await ammunitionApi.delete(id);
        fetchAmmunition();
      } catch (err) {
        console.error('Error deleting ammunition:', err);
        setError('Failed to delete ammunition');
      }
    }
  };

  const columns = [
    { id: 'Ammunition_ID', label: 'ID', minWidth: 50 },
    { id: 'Name', label: 'Name', minWidth: 150 },
    { id: 'Type', label: 'Type', minWidth: 100 },
    { id: 'Caliber', label: 'Caliber', minWidth: 100 },
    { id: 'Quantity', label: 'Quantity', minWidth: 80 },
    { id: 'Manufacturer_Name', label: 'Manufacturer', minWidth: 150 },
    { id: 'Batch_Number', label: 'Batch #', minWidth: 100 },
    { id: 'Production_Date', label: 'Production Date', minWidth: 120, 
      format: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { id: 'Expiration_Date', label: 'Expiration Date', minWidth: 120,
      format: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { id: 'Facility_Name', label: 'Storage Location', minWidth: 150 },
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
              value === 'Available' ? 'success.main' :
              value === 'Reserved' ? 'info.main' :
              value === 'Depleted' ? 'warning.main' :
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
      format: (value: any, row: Ammunition) => (
        <Box>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => navigate(`/ammunition/${row.Ammunition_ID}`)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => navigate(`/ammunition/${row.Ammunition_ID}/edit`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDelete(row.Ammunition_ID || 0)}
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
        title="Ammunition"
        showButton
        buttonText="Add New Ammunition"
        buttonIcon={<AddIcon />}
        onButtonClick={() => navigate('/ammunition/new')}
      />
      <DataTable
        columns={columns}
        data={ammunition}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </Box>
  );
};

export default AmmunitionList; 