import React, { useState } from 'react';
import { Box, Button, useTheme, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BuildIcon from '@mui/icons-material/Build';
import { DataTable, PageHeader, SearchBar } from '../../components/common';
import { Maintenance, SortConfig } from '../../types';

// Mock data for maintenance records
const mockMaintenance: Maintenance[] = [
  {
    id: 1,
    weaponId: 1,
    weaponName: 'M4A1 Carbine',
    type: 'Regular',
    startDate: '2023-01-15',
    endDate: '2023-01-18',
    technician: 'Robert Johnson',
    status: 'Completed',
    cost: 350,
    notes: 'Routine maintenance and cleaning',
  },
  {
    id: 2,
    weaponId: 2,
    weaponName: 'M9 Beretta',
    type: 'Repair',
    startDate: '2023-02-10',
    endDate: '2023-02-15',
    technician: 'Maria Garcia',
    status: 'Completed',
    cost: 520,
    notes: 'Trigger mechanism replacement',
  },
  {
    id: 3,
    weaponId: 3,
    weaponName: 'M249 SAW',
    type: 'Upgrade',
    startDate: '2023-03-20',
    technician: 'David Lee',
    status: 'In Progress',
    notes: 'Installing improved cooling system',
  },
  {
    id: 4,
    weaponId: 4,
    weaponName: 'M16A4',
    type: 'Inspection',
    startDate: '2023-04-05',
    endDate: '2023-04-05',
    technician: 'Samuel Brown',
    status: 'Completed',
    cost: 150,
    notes: 'Annual inspection and certification',
  },
  {
    id: 5,
    weaponId: 5,
    weaponName: 'Barrett M82',
    type: 'Repair',
    startDate: '2023-05-12',
    technician: 'Lisa Wilson',
    status: 'Scheduled',
    notes: 'Scope calibration and barrel examination',
  },
];

const MaintenanceList: React.FC = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>(mockMaintenance);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'startDate', direction: 'desc' });
  
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'primary';
      case 'Scheduled':
        return 'info';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Regular':
        return 'info';
      case 'Repair':
        return 'warning';
      case 'Upgrade':
        return 'success';
      case 'Inspection':
        return 'secondary';
      default:
        return 'default';
    }
  };
  
  // Define columns for the table
  const columns = [
    { 
      id: 'weaponName', 
      label: 'Weapon', 
      minWidth: 170,
      sortable: true,
    },
    { 
      id: 'type', 
      label: 'Type', 
      minWidth: 120,
      sortable: true,
      format: (value: string) => (
        <Chip 
          label={value} 
          color={getTypeColor(value) as 'info' | 'warning' | 'success' | 'secondary' | 'default'} 
          size="small" 
        />
      ),
    },
    { 
      id: 'startDate', 
      label: 'Start Date', 
      minWidth: 120,
      sortable: true,
      format: (value: string) => new Date(value).toLocaleDateString(),
    },
    { 
      id: 'endDate', 
      label: 'End Date', 
      minWidth: 120,
      sortable: true,
      format: (value: string | undefined) => value ? new Date(value).toLocaleDateString() : '-',
    },
    { 
      id: 'technician', 
      label: 'Technician', 
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
          color={getStatusColor(value) as 'success' | 'primary' | 'info' | 'error' | 'default'} 
          size="small" 
        />
      ),
    },
    { 
      id: 'cost', 
      label: 'Cost ($)', 
      minWidth: 100,
      sortable: true,
      format: (value: number | undefined) => value ? `$${value.toLocaleString()}` : '-',
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
    const sortedData = [...maintenanceRecords].sort((a, b) => {
      const aValue = a[newSortConfig.key as keyof Maintenance];
      const bValue = b[newSortConfig.key as keyof Maintenance];
      
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
    
    setMaintenanceRecords(sortedData);
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
    
    if (!query) {
      setMaintenanceRecords(mockMaintenance);
      return;
    }
    
    const filteredData = mockMaintenance.filter((record) => {
      const lowerQuery = query.toLowerCase();
      return (
        (record.weaponName?.toLowerCase().includes(lowerQuery) || false) ||
        record.type.toLowerCase().includes(lowerQuery) ||
        record.technician.toLowerCase().includes(lowerQuery) ||
        record.status.toLowerCase().includes(lowerQuery) ||
        (record.notes?.toLowerCase().includes(lowerQuery) || false)
      );
    });
    
    setMaintenanceRecords(filteredData);
  };
  
  // Handle view details
  const handleView = (id: number) => {
    navigate(`/maintenance/${id}`);
  };
  
  // Handle edit
  const handleEdit = (id: number) => {
    navigate(`/maintenance/edit/${id}`);
  };
  
  // Handle delete
  const handleDelete = (id: number) => {
    // In a real app, you'd call an API here
    const updatedRecords = maintenanceRecords.filter(
      (record) => record.id !== id
    );
    setMaintenanceRecords(updatedRecords);
  };
  
  // Handle add new
  const handleAddNew = () => {
    navigate('/maintenance/new');
  };
  
  return (
    <Box>
      <PageHeader 
        title="Maintenance Records" 
        icon={<BuildIcon fontSize="large" />}
        onAdd={handleAddNew}
        buttonText="Add Maintenance"
      />
      
      <Box sx={{ mb: 3 }}>
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search maintenance records..."
          initialValue={searchQuery}
        />
      </Box>
      
      <DataTable 
        columns={columns}
        data={maintenanceRecords}
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

export default MaintenanceList; 