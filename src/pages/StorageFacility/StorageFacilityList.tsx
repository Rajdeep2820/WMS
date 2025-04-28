import React, { useState } from 'react';
import { Box, Button, useTheme, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { DataTable, PageHeader, SearchBar } from '../../components/common';
import { StorageFacility, SortConfig } from '../../types';

// Mock data for storage facilities
const mockFacilities: StorageFacility[] = [
  {
    id: 1,
    name: 'Alpha Armory',
    location: 'Building 12, Zone A, Base North',
    capacity: 500,
    securityLevel: 'High',
    manager: 'Richard Wilson',
    contact: '+1-555-123-4567',
    status: 'Operational',
  },
  {
    id: 2,
    name: 'Bravo Bunker',
    location: 'Underground Level 2, Zone C, Base South',
    capacity: 1200,
    securityLevel: 'Maximum',
    manager: 'Jessica Martinez',
    contact: '+1-555-987-6543',
    status: 'Operational',
  },
  {
    id: 3,
    name: 'Charlie Container',
    location: 'Field Camp, Zone E, Eastern Perimeter',
    capacity: 300,
    securityLevel: 'Medium',
    manager: 'Robert Johnson',
    contact: '+1-555-456-7890',
    status: 'Under Maintenance',
  },
  {
    id: 4,
    name: 'Delta Depot',
    location: 'Building A5, Zone B, Base West',
    capacity: 700,
    securityLevel: 'High',
    manager: 'Sarah Thompson',
    contact: '+1-555-234-5678',
    status: 'Full',
  },
  {
    id: 5,
    name: 'Echo Enclosure',
    location: 'Old Base Sector, Zone Z, South Wing',
    capacity: 250,
    securityLevel: 'Low',
    manager: 'David Lee',
    contact: '+1-555-876-5432',
    status: 'Decommissioned',
  },
];

const StorageFacilityList: React.FC = () => {
  const [facilities, setFacilities] = useState<StorageFacility[]>(mockFacilities);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational':
        return 'success';
      case 'Under Maintenance':
        return 'warning';
      case 'Full':
        return 'info';
      case 'Decommissioned':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Define columns for the table
  const columns = [
    { 
      id: 'name', 
      label: 'Facility Name', 
      minWidth: 180,
      sortable: true,
    },
    { 
      id: 'location', 
      label: 'Location', 
      minWidth: 220,
      sortable: true,
    },
    { 
      id: 'capacity', 
      label: 'Capacity', 
      minWidth: 100,
      sortable: true,
    },
    { 
      id: 'securityLevel', 
      label: 'Security Level', 
      minWidth: 120,
      sortable: true,
    },
    { 
      id: 'manager', 
      label: 'Manager', 
      minWidth: 150,
      sortable: true,
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      sortable: true,
      format: (value: string) => (
        <Chip 
          label={value} 
          color={getStatusColor(value) as 'success' | 'warning' | 'info' | 'error' | 'default'} 
          size="small" 
        />
      ),
    },
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
    const sortedData = [...facilities].sort((a, b) => {
      const aValue = a[newSortConfig.key as keyof StorageFacility];
      const bValue = b[newSortConfig.key as keyof StorageFacility];
      
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
    
    setFacilities(sortedData);
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
    
    if (!query) {
      setFacilities(mockFacilities);
      return;
    }
    
    const filteredData = mockFacilities.filter((facility) => {
      const lowerQuery = query.toLowerCase();
      return (
        facility.name.toLowerCase().includes(lowerQuery) ||
        facility.location.toLowerCase().includes(lowerQuery) ||
        facility.securityLevel.toLowerCase().includes(lowerQuery) ||
        facility.manager.toLowerCase().includes(lowerQuery) ||
        facility.status.toLowerCase().includes(lowerQuery)
      );
    });
    
    setFacilities(filteredData);
  };
  
  // Handle view details
  const handleView = (id: number) => {
    navigate(`/storage-facilities/${id}`);
  };
  
  // Handle edit
  const handleEdit = (id: number) => {
    navigate(`/storage-facilities/edit/${id}`);
  };
  
  // Handle delete
  const handleDelete = (id: number) => {
    // In a real app, you'd call an API here
    const updatedFacilities = facilities.filter(
      (facility) => facility.id !== id
    );
    setFacilities(updatedFacilities);
  };
  
  // Handle add new
  const handleAddNew = () => {
    navigate('/storage-facilities/new');
  };
  
  return (
    <Box>
      <PageHeader 
        title="Storage Facilities" 
        icon={<HomeWorkIcon fontSize="large" />}
        onAdd={handleAddNew}
        buttonText="Add Facility"
      />
      
      <Box sx={{ mb: 3 }}>
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search facilities..."
          initialValue={searchQuery}
        />
      </Box>
      
      <DataTable 
        columns={columns}
        data={facilities}
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
    </Box>
  );
};

export default StorageFacilityList; 