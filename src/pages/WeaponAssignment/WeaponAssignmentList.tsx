import React, { useState } from 'react';
import { Box, Button, useTheme, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { DataTable, PageHeader, SearchBar } from '../../components/common';
import { WeaponAssignment, SortConfig } from '../../types';

// Mock data for weapon assignments
const mockAssignments: WeaponAssignment[] = [
  {
    id: 1,
    weaponId: 1,
    weaponName: 'M4A1 Carbine',
    soldierId: 1,
    soldierName: 'John Smith',
    assignDate: '2023-01-10',
    dueDate: '2023-07-10',
    status: 'Active',
    notes: 'Standard issue for training exercise',
  },
  {
    id: 2,
    weaponId: 2,
    weaponName: 'M9 Beretta',
    soldierId: 2,
    soldierName: 'Sarah Johnson',
    assignDate: '2023-02-05',
    dueDate: '2023-08-05',
    status: 'Active',
    notes: 'Secondary weapon for field operations',
  },
  {
    id: 3,
    weaponId: 3,
    weaponName: 'M249 SAW',
    soldierId: 3,
    soldierName: 'Michael Williams',
    assignDate: '2023-03-15',
    dueDate: '2023-04-15',
    status: 'Returned',
    notes: 'Training exercise complete',
  },
  {
    id: 4,
    weaponId: 4,
    weaponName: 'M16A4',
    soldierId: 4,
    soldierName: 'Emily Davis',
    assignDate: '2023-04-01',
    status: 'Lost',
    notes: 'Reported lost during field exercise. Investigation ongoing.',
  },
  {
    id: 5,
    weaponId: 5,
    weaponName: 'Barrett M82',
    soldierId: 5,
    soldierName: 'David Martinez',
    assignDate: '2023-05-20',
    dueDate: '2023-11-20',
    status: 'Damaged',
    notes: 'Scope damaged during operation. Under repair.',
  },
];

const WeaponAssignmentList: React.FC = () => {
  const [assignments, setAssignments] = useState<WeaponAssignment[]>(mockAssignments);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'assignDate', direction: 'desc' });
  
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Returned':
        return 'info';
      case 'Lost':
        return 'error';
      case 'Damaged':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  // Define columns for the table
  const columns = [
    { 
      id: 'weaponName', 
      label: 'Weapon', 
      minWidth: 180,
      sortable: true,
    },
    { 
      id: 'soldierName', 
      label: 'Assigned To', 
      minWidth: 180,
      sortable: true,
    },
    { 
      id: 'assignDate', 
      label: 'Assign Date', 
      minWidth: 120,
      sortable: true,
      format: (value: string) => new Date(value).toLocaleDateString(),
    },
    { 
      id: 'dueDate', 
      label: 'Due Date', 
      minWidth: 120,
      sortable: true,
      format: (value: string | undefined) => value ? new Date(value).toLocaleDateString() : '-',
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      sortable: true,
      format: (value: string) => (
        <Chip 
          label={value} 
          color={getStatusColor(value) as 'success' | 'info' | 'error' | 'warning' | 'default'} 
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
    const sortedData = [...assignments].sort((a, b) => {
      const aValue = a[newSortConfig.key as keyof WeaponAssignment];
      const bValue = b[newSortConfig.key as keyof WeaponAssignment];
      
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
    
    setAssignments(sortedData);
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
    
    if (!query) {
      setAssignments(mockAssignments);
      return;
    }
    
    const filteredData = mockAssignments.filter((assignment) => {
      const lowerQuery = query.toLowerCase();
      return (
        (assignment.weaponName?.toLowerCase().includes(lowerQuery) || false) ||
        (assignment.soldierName?.toLowerCase().includes(lowerQuery) || false) ||
        assignment.status.toLowerCase().includes(lowerQuery) ||
        (assignment.notes?.toLowerCase().includes(lowerQuery) || false)
      );
    });
    
    setAssignments(filteredData);
  };
  
  // Handle view details
  const handleView = (id: number) => {
    navigate(`/weapon-assignments/${id}`);
  };
  
  // Handle edit
  const handleEdit = (id: number) => {
    navigate(`/weapon-assignments/edit/${id}`);
  };
  
  // Handle delete
  const handleDelete = (id: number) => {
    // In a real app, you'd call an API here
    const updatedAssignments = assignments.filter(
      (assignment) => assignment.id !== id
    );
    setAssignments(updatedAssignments);
  };
  
  // Handle add new
  const handleAddNew = () => {
    navigate('/weapon-assignments/new');
  };
  
  return (
    <Box>
      <PageHeader 
        title="Weapon Assignments" 
        icon={<AssignmentIcon fontSize="large" />}
        onAdd={handleAddNew}
        buttonText="Add Assignment"
      />
      
      <Box sx={{ mb: 3 }}>
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search assignments..."
          initialValue={searchQuery}
        />
      </Box>
      
      <DataTable 
        columns={columns}
        data={assignments}
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

export default WeaponAssignmentList; 