import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Chip,
  Alert,
  AlertTitle,
  Button,
} from '@mui/material';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  DataTable,
  PageHeader,
  SearchBar,
} from '../../components/common';
import { SortConfig } from '../../types';
import { StorageFacility } from '../../types/storageFacility';
import { storageFacilityApi } from '../../services/api';

const StorageFacilityList: React.FC = () => {
  const [facilities, setFacilities] = useState<StorageFacility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<StorageFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'Name',
    direction: 'asc',
  });

  const navigate = useNavigate();

  // Fetch storage facilities data
  const fetchFacilities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await storageFacilityApi.getAll();
      console.log('Fetched storage facilities:', data);
      setFacilities(data);
      setFilteredFacilities(data);
    } catch (err: any) {
      console.error('Error fetching storage facilities:', err);
      setError(err.message || 'Failed to fetch storage facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Define columns for the data table
  const columns = [
    {
      id: 'Name',
      label: 'Name',
      minWidth: 180,
      sortable: true,
    },
    {
      id: 'Location',
      label: 'Location',
      minWidth: 160,
      sortable: true,
      format: (value: string) => value || 'N/A',
    },
    {
      id: 'Capacity',
      label: 'Capacity',
      minWidth: 120,
      align: 'right' as 'right',
      sortable: true,
      format: (value: number) => value || 'N/A',
    },
    {
      id: 'Status',
      label: 'Status',
      minWidth: 140,
      sortable: true,
      format: (value: string) => {
        if (!value) return 'N/A';
        
        const colorMap: Record<string, "success" | "error" | "warning" | "default"> = {
          'Operational': 'success',
          'Full': 'warning',
          'Under Maintenance': 'warning',
          'Decommissioned': 'error'
        };
        
        return (
          <Chip
            size="small"
            label={value}
            color={colorMap[value] || 'default'}
            variant="outlined"
          />
        );
      },
    },
    {
      id: 'Security_Level',
      label: 'Security Level',
      minWidth: 140,
      sortable: true,
      format: (value: string) => {
        if (!value) return 'N/A';
        
        const colorMap: Record<string, "success" | "error" | "warning" | "info" | "default"> = {
          'Low': 'default',
          'Medium': 'info',
          'High': 'warning',
          'Maximum': 'error'
        };
        
        return (
          <Chip
            size="small"
            label={value}
            color={colorMap[value] || 'default'}
          />
        );
      },
    },
  ];

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);

    if (!query) {
      setFilteredFacilities(facilities);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = facilities.filter((facility) => {
      return (
        facility.Name.toLowerCase().includes(lowerQuery) ||
        (facility.Location && facility.Location.toLowerCase().includes(lowerQuery)) ||
        (facility.Status && facility.Status.toLowerCase().includes(lowerQuery)) ||
        (facility.Security_Level && facility.Security_Level.toLowerCase().includes(lowerQuery))
      );
    });

    setFilteredFacilities(filtered);
  };

  // Handle sort
  const handleSort = (newSortConfig: SortConfig) => {
    setSortConfig(newSortConfig);

    const sortedData = [...filteredFacilities].sort((a, b) => {
      const aValue = a[newSortConfig.key as keyof StorageFacility];
      const bValue = b[newSortConfig.key as keyof StorageFacility];

      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return newSortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) {
        return newSortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return newSortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredFacilities(sortedData);
  };

  // Navigate to storage facility details page
  const handleView = (id: number) => {
    navigate(`/storage-facilities/${id}`);
  };

  // Navigate to storage facility edit page
  const handleEdit = (id: number) => {
    navigate(`/storage-facilities/edit/${id}`);
  };

  // Delete a storage facility
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this storage facility?')) {
      try {
        await storageFacilityApi.delete(id);
        setFacilities((prev) => 
          prev.filter((facility) => facility.Facility_ID !== id)
        );
        setFilteredFacilities((prev) =>
          prev.filter((facility) => facility.Facility_ID !== id)
        );
      } catch (err: any) {
        console.error('Error deleting storage facility:', err);
        setError(err.message || 'Failed to delete storage facility');
      }
    }
  };

  // Navigate to add new storage facility page
  const handleAddNew = () => {
    navigate('/storage-facilities/new');
  };

  return (
    <Box>
      <PageHeader
        title="Storage Facilities"
        icon={<WarehouseIcon fontSize="large" />}
        onAdd={handleAddNew}
        buttonText="Add Storage Facility"
        showButton={true}
      />

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={fetchFacilities}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          }
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search facilities..."
          initialValue={searchQuery}
        />
      </Box>

      <DataTable
        columns={columns}
        data={filteredFacilities}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onSort={handleSort}
        sortConfig={sortConfig}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowId={(row) => row.Facility_ID || 0}
        loading={loading}
      />
    </Box>
  );
};

export default StorageFacilityList; 