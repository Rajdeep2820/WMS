import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Alert,
  AlertTitle,
  Button,
} from '@mui/material';
import FactoryIcon from '@mui/icons-material/Factory';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  DataTable,
  PageHeader,
  SearchBar,
  StatusChip,
} from '../../components/common';
import { Manufacturer, SortConfig } from '../../types';
import { manufacturerApi } from '../../services/api';

const ManufacturerList: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [filteredManufacturers, setFilteredManufacturers] = useState<Manufacturer[]>([]);
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

  // Fetch manufacturers data
  const fetchManufacturers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await manufacturerApi.getAll();
      setManufacturers(data);
      setFilteredManufacturers(data);
    } catch (err: any) {
      console.error('Error fetching manufacturers:', err);
      setError(err.message || 'Failed to fetch manufacturers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
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
      id: 'Country',
      label: 'Country',
      minWidth: 120,
      sortable: true,
    },
    {
      id: 'Contact_Info',
      label: 'Contact Info',
      minWidth: 180,
      sortable: true,
    },
    {
      id: 'Status',
      label: 'Status',
      minWidth: 140,
      sortable: true,
      format: (value: string) => {
        const colorMap: Record<string, "success" | "error" | "warning" | "default"> = {
          'Active': 'success',
          'Inactive': 'error',
          'Suspended': 'warning'
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
      id: 'Weapon_Count',
      label: 'Weapons',
      minWidth: 100,
      align: 'right' as 'right',
      sortable: true,
      format: (value: number | undefined) => value || 0,
    },
  ];

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);

    if (!query) {
      setFilteredManufacturers(manufacturers);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = manufacturers.filter((manufacturer) => {
      return (
        manufacturer.Name.toLowerCase().includes(lowerQuery) ||
        manufacturer.Country.toLowerCase().includes(lowerQuery) ||
        manufacturer.Contact_Info.toLowerCase().includes(lowerQuery)
      );
    });

    setFilteredManufacturers(filtered);
  };

  // Handle sort
  const handleSort = (newSortConfig: SortConfig) => {
    setSortConfig(newSortConfig);

    const sortedData = [...filteredManufacturers].sort((a, b) => {
      const aValue = a[newSortConfig.key as keyof Manufacturer];
      const bValue = b[newSortConfig.key as keyof Manufacturer];

      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return newSortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // @ts-ignore: This is safe because we've already checked for null values
      if (aValue < bValue) {
        return newSortConfig.direction === 'asc' ? -1 : 1;
      }
      // @ts-ignore: This is safe because we've already checked for null values
      if (aValue > bValue) {
        return newSortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredManufacturers(sortedData);
  };

  // Navigate to manufacturer details page
  const handleView = (id: number) => {
    navigate(`/manufacturers/${id}`);
  };

  // Navigate to manufacturer edit page
  const handleEdit = (id: number) => {
    navigate(`/manufacturers/edit/${id}`);
  };

  // Delete a manufacturer
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this manufacturer?')) {
      try {
        await manufacturerApi.delete(id);
        setManufacturers((prev) => 
          prev.filter((manufacturer) => manufacturer.Manufacturer_ID !== id)
        );
        setFilteredManufacturers((prev) =>
          prev.filter((manufacturer) => manufacturer.Manufacturer_ID !== id)
        );
      } catch (err: any) {
        console.error('Error deleting manufacturer:', err);
        setError(err.message || 'Failed to delete manufacturer');
      }
    }
  };

  // Navigate to add new manufacturer page
  const handleAddNew = () => {
    navigate('/manufacturers/new');
  };

  return (
    <Box>
      <PageHeader
        title="Manufacturers"
        icon={<FactoryIcon fontSize="large" />}
        onAdd={handleAddNew}
        buttonText="Add Manufacturer"
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
              onClick={fetchManufacturers}
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
          placeholder="Search manufacturers..."
          initialValue={searchQuery}
        />
      </Box>

      <DataTable
        columns={columns}
        data={filteredManufacturers}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onSort={handleSort}
        sortConfig={sortConfig}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowId={(row) => row.Manufacturer_ID || 0}
      />
    </Box>
  );
};

export default ManufacturerList; 