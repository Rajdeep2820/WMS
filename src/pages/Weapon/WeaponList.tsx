import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Alert, 
  CircularProgress, 
  TextField, 
  InputAdornment, 
  Button,
  Grid,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import { DataTable, PageHeader, StatusChip } from '../../components/common';
import { Weapon, SortConfig } from '../../types';
import { weaponApi } from '../../services/api';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const WeaponList: React.FC = () => {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataFetched = useRef<boolean>(false);
  
  const navigate = useNavigate();

  // Fetch weapons data
  const fetchWeapons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await weaponApi.getAll();
      
      // Transform the API response to match the Weapon type
      const formattedWeapons: Weapon[] = response.map((weapon: any) => ({
        Weapon_ID: weapon.Weapon_ID,
        Name: weapon.Name,
        Type: weapon.Type,
        Model: weapon.Model,
        Serial_Number: weapon.Serial_Number,
        Manufacturer_ID: weapon.Manufacturer_ID,
        Manufacturer_Name: weapon.Manufacturer_Name || '',
        Status: weapon.Status,
        created_at: weapon.created_at,
        updated_at: weapon.updated_at
      }));
      
      setWeapons(formattedWeapons);
    } catch (err) {
      console.error('Error fetching weapons:', err);
      setError('Failed to load weapons. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch - with a check to prevent duplicate calls
  useEffect(() => {
    if (!dataFetched.current) {
      fetchWeapons();
      dataFetched.current = true;
    }
  }, []);
  
  // Define columns for the table
  const columns = [
    { 
      id: 'Name', 
      label: 'Name', 
      minWidth: 150,
      sortable: true,
    },
    { 
      id: 'Type', 
      label: 'Type', 
      minWidth: 120,
      sortable: true,
    },
    { 
      id: 'Serial_Number', 
      label: 'Serial Number', 
      minWidth: 150,
      sortable: true,
    },
    { 
      id: 'Manufacturer_Name', 
      label: 'Manufacturer',  
      minWidth: 150,
      sortable: true,
    },
    { 
      id: 'Status', 
      label: 'Status', 
      minWidth: 120,
      sortable: true,
      format: (value: string) => <StatusChip status={value} />,
    }
  ];
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };
  
  // Handle sort
  const handleSort = (newSortConfig: SortConfig) => {
    setSortConfig(newSortConfig);
    
    // Sort data based on key and direction
    const sortedData = [...weapons].sort((a, b) => {
      const aValue = a[newSortConfig.key as keyof Weapon];
      const bValue = b[newSortConfig.key as keyof Weapon];
      
      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;
      
      if (aValue < bValue) {
        return newSortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return newSortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setWeapons(sortedData);
  };
  
  // Handle search
  const performSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
    
    if (!query) {
      fetchWeapons();
      return;
    }
    
    const filteredData = weapons.filter((weapon) => {
      const lowerQuery = query.toLowerCase();
      return (
        weapon.Name.toLowerCase().includes(lowerQuery) ||
        weapon.Type.toLowerCase().includes(lowerQuery) ||
        (weapon.Serial_Number && weapon.Serial_Number.toLowerCase().includes(lowerQuery)) ||
        (weapon.Manufacturer_Name && weapon.Manufacturer_Name.toLowerCase().includes(lowerQuery)) ||
        weapon.Status.toLowerCase().includes(lowerQuery)
      );
    });
    
    setWeapons(filteredData);
  };
  
  // Handle view details
  const handleView = (id: number) => {
    navigate(`/weapons/${id}`);
  };
  
  // Handle edit
  const handleEdit = (id: number) => {
    navigate(`/weapons/edit/${id}`);
  };
  
  // Handle delete
  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this weapon?')) {
      try {
        await weaponApi.delete(id);
        fetchWeapons();
      } catch (err) {
        console.error('Error deleting weapon:', err);
        setError('Failed to delete weapon. Please try again later.');
      }
    }
  };
  
  // Handle add new
  const handleAddNew = () => {
    navigate('/weapons/new');
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <PageHeader 
        title="Weapons Inventory" 
        icon={<GavelIcon fontSize="large" />}
        onAdd={handleAddNew}
        buttonText="Add Weapon"
      />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box 
        sx={{ 
          mb: 3, 
          p: 2, 
          backgroundColor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={7} lg={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search weapons..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                performSearch(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5} lg={4}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Add New Weapon
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      <DataTable 
        columns={columns}
        data={weapons}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSort={handleSort}
        sortConfig={sortConfig}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{ px: 4, py: 1.5 }}
        >
          Add New Weapon
        </Button>
      </Box>
    </Box>
  );
};

export default WeaponList; 