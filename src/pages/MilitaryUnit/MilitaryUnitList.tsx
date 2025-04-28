import React, { useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { DataTable, PageHeader, SearchBar } from '../../components/common';
import { MilitaryUnit, SortConfig } from '../../types';

// Mock data for military units
const mockMilitaryUnits: MilitaryUnit[] = [
  {
    id: 1,
    name: '1st Infantry Division',
    location: 'Fort Riley, Kansas',
    commanderName: 'Colonel James Wilson',
    type: 'Infantry',
    personnel: 12500,
    established: '1917-06-14',
  },
  {
    id: 2,
    name: '5th Armored Brigade',
    location: 'Fort Bliss, Texas',
    commanderName: 'Colonel Sarah Johnson',
    type: 'Armored',
    personnel: 8200,
    established: '1942-10-01',
  },
  {
    id: 3,
    name: '10th Special Forces Group',
    location: 'Fort Carson, Colorado',
    commanderName: 'Colonel David Martinez',
    type: 'Special Forces',
    personnel: 2300,
    established: '1952-06-19',
  },
  {
    id: 4,
    name: '101st Airborne Division',
    location: 'Fort Campbell, Kentucky',
    commanderName: 'General Robert Thompson',
    type: 'Aviation',
    personnel: 18200,
    established: '1942-08-16',
  },
  {
    id: 5,
    name: '3rd Field Artillery Regiment',
    location: 'Fort Hood, Texas',
    commanderName: 'Colonel Michael Anderson',
    type: 'Artillery',
    personnel: 4800,
    established: '1936-03-22',
  },
];

const MilitaryUnitList: React.FC = () => {
  const [militaryUnits, setMilitaryUnits] = useState<MilitaryUnit[]>(mockMilitaryUnits);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Define columns for the table
  const columns = [
    { 
      id: 'name', 
      label: 'Unit Name', 
      minWidth: 170,
      sortable: true,
    },
    { 
      id: 'type', 
      label: 'Type', 
      minWidth: 120,
      sortable: true,
    },
    { 
      id: 'location', 
      label: 'Location', 
      minWidth: 150,
      sortable: true,
    },
    { 
      id: 'commanderName', 
      label: 'Commander', 
      minWidth: 170,
      sortable: true,
    },
    { 
      id: 'personnel', 
      label: 'Personnel', 
      minWidth: 100,
      sortable: true,
      format: (value: number) => value.toLocaleString(),
    },
    { 
      id: 'established', 
      label: 'Established', 
      minWidth: 120,
      sortable: true,
      format: (value: string) => new Date(value).toLocaleDateString(),
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
    const sortedData = [...militaryUnits].sort((a, b) => {
      const aValue = a[newSortConfig.key as keyof MilitaryUnit];
      const bValue = b[newSortConfig.key as keyof MilitaryUnit];
      
      if (aValue < bValue) {
        return newSortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return newSortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setMilitaryUnits(sortedData);
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
    
    if (!query) {
      setMilitaryUnits(mockMilitaryUnits);
      return;
    }
    
    const filteredData = mockMilitaryUnits.filter((unit) => {
      const lowerQuery = query.toLowerCase();
      return (
        unit.name.toLowerCase().includes(lowerQuery) ||
        unit.location.toLowerCase().includes(lowerQuery) ||
        unit.commanderName.toLowerCase().includes(lowerQuery) ||
        unit.type.toLowerCase().includes(lowerQuery)
      );
    });
    
    setMilitaryUnits(filteredData);
  };
  
  // Handle view details
  const handleView = (id: number) => {
    navigate(`/military-units/${id}`);
  };
  
  // Handle edit
  const handleEdit = (id: number) => {
    navigate(`/military-units/edit/${id}`);
  };
  
  // Handle delete
  const handleDelete = (id: number) => {
    // In a real app, you'd call an API here
    const updatedUnits = militaryUnits.filter(
      (unit) => unit.id !== id
    );
    setMilitaryUnits(updatedUnits);
  };
  
  // Handle add new
  const handleAddNew = () => {
    navigate('/military-units/new');
  };
  
  return (
    <Box>
      <PageHeader 
        title="Military Units" 
        icon={<MilitaryTechIcon fontSize="large" />}
        onAdd={handleAddNew}
        buttonText="Add Military Unit"
      />
      
      <Box sx={{ mb: 3 }}>
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search military units..."
          initialValue={searchQuery}
        />
      </Box>
      
      <DataTable 
        columns={columns}
        data={militaryUnits}
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

export default MilitaryUnitList; 