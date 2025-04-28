import React, { useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import { DataTable, PageHeader, SearchBar } from '../../components/common';
import { Ammunition, SortConfig } from '../../types';

// Mock data for ammunition
const mockAmmunition: Ammunition[] = [
  {
    id: 1,
    type: 'Rifle Cartridge',
    caliber: '5.56×45mm NATO',
    quantity: 10000,
    manufacturerId: 1,
    manufacturerName: 'Defense Systems Inc.',
    batchNumber: 'B-5561-2023',
    manufactureDate: '2023-03-15',
    expirationDate: '2033-03-15',
    storageId: 1,
    storageName: 'Alpha Warehouse',
    status: 'Available',
  },
  {
    id: 2,
    type: 'Pistol Cartridge',
    caliber: '9×19mm Parabellum',
    quantity: 5000,
    manufacturerId: 2,
    manufacturerName: 'Europa Arms',
    batchNumber: 'B-9192-2023',
    manufactureDate: '2023-02-20',
    expirationDate: '2033-02-20',
    storageId: 1,
    storageName: 'Alpha Warehouse',
    status: 'Available',
  },
  {
    id: 3,
    type: 'Shotgun Shell',
    caliber: '12 Gauge',
    quantity: 3000,
    manufacturerId: 1,
    manufacturerName: 'Defense Systems Inc.',
    batchNumber: 'B-12G-2023',
    manufactureDate: '2023-01-10',
    expirationDate: '2028-01-10',
    storageId: 2,
    storageName: 'Bravo Storage',
    status: 'Available',
  },
  {
    id: 4,
    type: 'Sniper Cartridge',
    caliber: '.338 Lapua Magnum',
    quantity: 1000,
    manufacturerId: 3,
    manufacturerName: 'Sakura Defense',
    batchNumber: 'B-338L-2022',
    manufactureDate: '2022-11-05',
    expirationDate: '2032-11-05',
    storageId: 3,
    storageName: 'Charlie Bunker',
    status: 'Reserved',
  },
  {
    id: 5,
    type: 'Machine Gun Cartridge',
    caliber: '7.62×51mm NATO',
    quantity: 8000,
    manufacturerId: 4,
    manufacturerName: 'Royal Armaments',
    batchNumber: 'B-7621-2022',
    manufactureDate: '2022-09-12',
    expirationDate: '2032-09-12',
    storageId: 2,
    storageName: 'Bravo Storage',
    status: 'Available',
  },
];

const AmmunitionList: React.FC = () => {
  const [ammunition, setAmmunition] = useState<Ammunition[]>(mockAmmunition);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'type', direction: 'asc' });
  
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Define columns for the table
  const columns = [
    { 
      id: 'type', 
      label: 'Type', 
      minWidth: 150,
      sortable: true,
    },
    { 
      id: 'caliber', 
      label: 'Caliber', 
      minWidth: 120,
      sortable: true,
    },
    { 
      id: 'quantity', 
      label: 'Quantity', 
      minWidth: 100,
      sortable: true,
      format: (value: number) => value.toLocaleString(),
    },
    { 
      id: 'manufacturerName', 
      label: 'Manufacturer', 
      minWidth: 150,
      sortable: true,
    },
    { 
      id: 'batchNumber', 
      label: 'Batch Number', 
      minWidth: 120,
      sortable: true,
    },
    { 
      id: 'manufactureDate', 
      label: 'Manufacture Date', 
      minWidth: 150,
      sortable: true,
      format: (value: string) => new Date(value).toLocaleDateString(),
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
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
    const sortedData = [...ammunition].sort((a, b) => {
      const aValue = a[newSortConfig.key as keyof Ammunition];
      const bValue = b[newSortConfig.key as keyof Ammunition];
      
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
    
    setAmmunition(sortedData);
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
    
    if (!query) {
      setAmmunition(mockAmmunition);
      return;
    }
    
    const filteredData = mockAmmunition.filter((ammo) => {
      const lowerQuery = query.toLowerCase();
      return (
        ammo.type.toLowerCase().includes(lowerQuery) ||
        ammo.caliber.toLowerCase().includes(lowerQuery) ||
        (ammo.manufacturerName?.toLowerCase().includes(lowerQuery) || false) ||
        ammo.batchNumber.toLowerCase().includes(lowerQuery) ||
        (ammo.storageName?.toLowerCase().includes(lowerQuery) || false) ||
        ammo.status.toLowerCase().includes(lowerQuery)
      );
    });
    
    setAmmunition(filteredData);
  };
  
  // Handle view details
  const handleView = (id: number) => {
    navigate(`/ammunition/${id}`);
  };
  
  // Handle edit
  const handleEdit = (id: number) => {
    navigate(`/ammunition/edit/${id}`);
  };
  
  // Handle delete
  const handleDelete = (id: number) => {
    // In a real app, you'd call an API here
    const updatedAmmunition = ammunition.filter(
      (ammo) => ammo.id !== id
    );
    setAmmunition(updatedAmmunition);
  };
  
  // Handle add new
  const handleAddNew = () => {
    navigate('/ammunition/new');
  };
  
  return (
    <Box>
      <PageHeader 
        title="Ammunition" 
        icon={<InventoryIcon fontSize="large" />}
        onAdd={handleAddNew}
        buttonText="Add Ammunition"
      />
      
      <Box sx={{ mb: 3 }}>
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search ammunition..."
          initialValue={searchQuery}
        />
      </Box>
      
      <DataTable 
        columns={columns}
        data={ammunition}
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

export default AmmunitionList;