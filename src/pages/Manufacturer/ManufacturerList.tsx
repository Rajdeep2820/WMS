import React, { useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FactoryIcon from '@mui/icons-material/Factory';
import { DataTable, PageHeader, SearchBar } from '../../components/common';
import { Manufacturer, SortConfig } from '../../types';

// Mock data for manufacturers
const mockManufacturers: Manufacturer[] = [
  {
    id: 1,
    name: 'Defense Systems Inc.',
    country: 'United States',
    established: '1985-06-12',
    contact: 'John Smith',
    email: 'jsmith@defensesys.com',
    phone: '+1-555-123-4567',
    address: '123 Weapons Ave, Arlington, VA 22201',
  },
  {
    id: 2,
    name: 'Europa Arms',
    country: 'Germany',
    established: '1964-02-28',
    contact: 'Hans Weber',
    email: 'hweber@europaarms.de',
    phone: '+49-30-987-6543',
    address: 'Waffenstraße 45, Berlin, 10115',
  },
  {
    id: 3,
    name: 'Sakura Defense',
    country: 'Japan',
    established: '1972-11-05',
    contact: 'Takashi Yamamoto',
    email: 'tyamamoto@sakuradefense.jp',
    phone: '+81-3-1234-5678',
    address: '7-1 Military District, Tokyo, 105-0021',
  },
  {
    id: 4,
    name: 'Royal Armaments',
    country: 'United Kingdom',
    established: '1897-03-15',
    contact: 'Elizabeth Parker',
    email: 'eparker@royalarmaments.co.uk',
    phone: '+44-20-7946-0987',
    address: '42 Crown St, London, SW1A 1AA',
  },
  {
    id: 5,
    name: 'Atlas Defense Systems',
    country: 'France',
    established: '1983-09-22',
    contact: 'Jean Dupont',
    email: 'jdupont@atlasdefense.fr',
    phone: '+33-1-2345-6789',
    address: '15 Rue de la Défense, Paris, 75001',
  },
];

const ManufacturerList: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(mockManufacturers);
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
      label: 'Name', 
      minWidth: 170,
      sortable: true,
    },
    { 
      id: 'country', 
      label: 'Country', 
      minWidth: 100,
      sortable: true,
    },
    { 
      id: 'established', 
      label: 'Established', 
      minWidth: 120,
      sortable: true,
      format: (value: string) => new Date(value).toLocaleDateString(),
    },
    { 
      id: 'contact', 
      label: 'Contact Person', 
      minWidth: 150,
      sortable: true,
    },
    { 
      id: 'email', 
      label: 'Email', 
      minWidth: 170,
      sortable: true,
    },
    { 
      id: 'phone', 
      label: 'Phone', 
      minWidth: 150,
      sortable: true,
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
    const sortedData = [...manufacturers].sort((a, b) => {
      const aValue = a[newSortConfig.key as keyof Manufacturer];
      const bValue = b[newSortConfig.key as keyof Manufacturer];
      
      if (aValue < bValue) {
        return newSortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return newSortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setManufacturers(sortedData);
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
    
    if (!query) {
      setManufacturers(mockManufacturers);
      return;
    }
    
    const filteredData = mockManufacturers.filter((manufacturer) => {
      const lowerQuery = query.toLowerCase();
      return (
        manufacturer.name.toLowerCase().includes(lowerQuery) ||
        manufacturer.country.toLowerCase().includes(lowerQuery) ||
        manufacturer.contact.toLowerCase().includes(lowerQuery) ||
        manufacturer.email.toLowerCase().includes(lowerQuery)
      );
    });
    
    setManufacturers(filteredData);
  };
  
  // Handle view details
  const handleView = (id: number) => {
    navigate(`/manufacturers/${id}`);
  };
  
  // Handle edit
  const handleEdit = (id: number) => {
    navigate(`/manufacturers/edit/${id}`);
  };
  
  // Handle delete
  const handleDelete = (id: number) => {
    // In a real app, you'd call an API here
    const updatedManufacturers = manufacturers.filter(
      (manufacturer) => manufacturer.id !== id
    );
    setManufacturers(updatedManufacturers);
  };
  
  // Handle add new
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
      />
      
      <Box sx={{ mb: 3 }}>
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search manufacturers..."
          initialValue={searchQuery}
        />
      </Box>
      
      <DataTable 
        columns={columns}
        data={manufacturers}
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

export default ManufacturerList; 