import React, { useState } from 'react';
import { Box, Button, useTheme, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import { DataTable, PageHeader, SearchBar } from '../../components/common';
import { Soldier, SortConfig } from '../../types';

// Mock data for soldiers
const mockSoldiers: Soldier[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    rank: 'Sergeant',
    serialNumber: 'SN-10045872',
    dateOfBirth: '1992-05-15',
    joinDate: '2010-07-25',
    unitId: 1,
    unitName: '1st Infantry Division',
    status: 'Active',
    specialization: 'Infantry',
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Johnson',
    rank: 'Captain',
    serialNumber: 'SN-20078945',
    dateOfBirth: '1988-11-30',
    joinDate: '2006-02-10',
    unitId: 2,
    unitName: '5th Armored Brigade',
    status: 'Active',
    specialization: 'Armored',
  },
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Williams',
    rank: 'Private',
    serialNumber: 'SN-30052134',
    dateOfBirth: '1995-08-22',
    joinDate: '2015-10-05',
    unitId: 1,
    unitName: '1st Infantry Division',
    status: 'Training',
    specialization: 'Infantry',
  },
  {
    id: 4,
    firstName: 'Emily',
    lastName: 'Davis',
    rank: 'Lieutenant',
    serialNumber: 'SN-40067823',
    dateOfBirth: '1990-03-18',
    joinDate: '2012-06-14',
    unitId: 3,
    unitName: '10th Special Forces Group',
    status: 'Deployed',
    specialization: 'Special Forces',
  },
  {
    id: 5,
    firstName: 'David',
    lastName: 'Martinez',
    rank: 'Major',
    serialNumber: 'SN-50043691',
    dateOfBirth: '1985-09-12',
    joinDate: '2005-01-20',
    unitId: 4,
    unitName: '101st Airborne Division',
    status: 'Leave',
    specialization: 'Airborne',
  },
];

const SoldierList: React.FC = () => {
  const [soldiers, setSoldiers] = useState<Soldier[]>(mockSoldiers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'lastName', direction: 'asc' });
  
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Deployed':
        return 'primary';
      case 'Training':
        return 'info';
      case 'Leave':
        return 'warning';
      case 'Retired':
        return 'default';
      default:
        return 'default';
    }
  };
  
  // Define columns for the table
  const columns = [
    { 
      id: 'lastName', 
      label: 'Last Name', 
      minWidth: 130,
      sortable: true,
    },
    { 
      id: 'firstName', 
      label: 'First Name', 
      minWidth: 130,
      sortable: true,
    },
    { 
      id: 'rank', 
      label: 'Rank', 
      minWidth: 120,
      sortable: true,
    },
    { 
      id: 'serialNumber', 
      label: 'Serial Number', 
      minWidth: 150,
      sortable: true,
    },
    { 
      id: 'unitName', 
      label: 'Unit', 
      minWidth: 180,
      sortable: true,
    },
    { 
      id: 'specialization', 
      label: 'Specialization', 
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
          color={getStatusColor(value) as 'success' | 'primary' | 'info' | 'warning' | 'default'} 
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
    const sortedData = [...soldiers].sort((a, b) => {
      const aValue = a[newSortConfig.key as keyof Soldier];
      const bValue = b[newSortConfig.key as keyof Soldier];
      
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
    
    setSoldiers(sortedData);
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
    
    if (!query) {
      setSoldiers(mockSoldiers);
      return;
    }
    
    const filteredData = mockSoldiers.filter((soldier) => {
      const lowerQuery = query.toLowerCase();
      return (
        soldier.firstName.toLowerCase().includes(lowerQuery) ||
        soldier.lastName.toLowerCase().includes(lowerQuery) ||
        soldier.rank.toLowerCase().includes(lowerQuery) ||
        soldier.serialNumber.toLowerCase().includes(lowerQuery) ||
        (soldier.unitName?.toLowerCase().includes(lowerQuery) || false) ||
        soldier.specialization.toLowerCase().includes(lowerQuery) ||
        soldier.status.toLowerCase().includes(lowerQuery)
      );
    });
    
    setSoldiers(filteredData);
  };
  
  // Handle view details
  const handleView = (id: number) => {
    navigate(`/soldiers/${id}`);
  };
  
  // Handle edit
  const handleEdit = (id: number) => {
    navigate(`/soldiers/edit/${id}`);
  };
  
  // Handle delete
  const handleDelete = (id: number) => {
    // In a real app, you'd call an API here
    const updatedSoldiers = soldiers.filter(
      (soldier) => soldier.id !== id
    );
    setSoldiers(updatedSoldiers);
  };
  
  // Handle add new
  const handleAddNew = () => {
    navigate('/soldiers/new');
  };
  
  return (
    <Box>
      <PageHeader 
        title="Soldiers" 
        icon={<PersonIcon fontSize="large" />}
        onAdd={handleAddNew}
        buttonText="Add Soldier"
      />
      
      <Box sx={{ mb: 3 }}>
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search soldiers..."
          initialValue={searchQuery}
        />
      </Box>
      
      <DataTable 
        columns={columns}
        data={soldiers}
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

export default SoldierList; 