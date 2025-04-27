import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import { DataTable, PageHeader, SearchBar, StatusChip } from '../../components/common';
import { Weapon, SortConfig } from '../../types';

// Mock data for weapons
const mockWeapons: Weapon[] = [
  {
    id: 1,
    name: 'M4A1 Carbine',
    type: 'Assault Rifle',
    caliber: '5.56mm',
    manufacturerId: 1,
    manufacturerName: 'Defense Systems Inc.',
    serialNumber: 'DS-AR-10045',
    manufactureDate: '2019-05-15',
    status: 'Available',
    description: 'Standard issue assault rifle for military personnel',
  },
  {
    id: 2,
    name: 'Glock 19',
    type: 'Handgun',
    caliber: '9mm',
    manufacturerId: 3,
    manufacturerName: 'Sakura Defense',
    serialNumber: 'SD-HG-57291',
    manufactureDate: '2020-08-23',
    status: 'Assigned',
    description: 'Compact handgun for military and law enforcement',
  },
  {
    id: 3,
    name: 'Barrett M82',
    type: 'Sniper Rifle',
    caliber: '.50 BMG',
    manufacturerId: 2,
    manufacturerName: 'Europa Arms',
    serialNumber: 'EA-SR-00372',
    manufactureDate: '2018-11-10',
    status: 'Maintenance',
    description: 'Long-range anti-materiel sniper rifle',
  },
  {
    id: 4,
    name: 'Benelli M4',
    type: 'Shotgun',
    caliber: '12 Gauge',
    manufacturerId: 5,
    manufacturerName: 'Atlas Defense Systems',
    serialNumber: 'ADS-SG-83921',
    manufactureDate: '2021-02-14',
    status: 'Available',
    description: 'Semi-automatic tactical shotgun',
  },
  {
    id: 5,
    name: 'MP5',
    type: 'Submachine Gun',
    caliber: '9mm',
    manufacturerId: 4,
    manufacturerName: 'Royal Armaments',
    serialNumber: 'RA-SMG-12857',
    manufactureDate: '2017-07-30',
    status: 'Assigned',
    description: 'Compact submachine gun for close quarters combat',
  },
  {
    id: 6,
    name: 'M249 SAW',
    type: 'Machine Gun',
    caliber: '5.56mm',
    manufacturerId: 1,
    manufacturerName: 'Defense Systems Inc.',
    serialNumber: 'DS-MG-00689',
    manufactureDate: '2016-12-05',
    status: 'Retired',
    description: 'Light machine gun for squad support',
  },
];

const WeaponList: React.FC = () => {
  const [weapons, setWeapons] = useState<Weapon[]>(mockWeapons);
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
      minWidth: 150,
      sortable: true,
    },
    { 
      id: 'type', 
      label: 'Type', 
      minWidth: 130,
      sortable: true,
    },
    { 
      id: 'caliber', 
      label: 'Caliber', 
      minWidth: 100,
      sortable: true,
    },
    { 
      id: 'manufacturerName', 
      label: 'Manufacturer', 
      minWidth: 150,
      sortable: true,
    },
    { 
      id: 'serialNumber', 
      label: 'Serial Number', 
      minWidth: 130,
      sortable: true,
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      sortable: true,
      format: (value: string) => <StatusChip status={value} type="weapon" />,
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
    const sortedData = [...weapons].sort((a, b) => {
      const aValue = a[newSortConfig.key as keyof Weapon];
      const bValue = b[newSortConfig.key as keyof Weapon];
      
      // Handle undefined or null values
      if (aValue === undefined || aValue === null) return newSortConfig.direction === 'asc' ? -1 : 1;
      if (bValue === undefined || bValue === null) return newSortConfig.direction === 'asc' ? 1 : -1;
      
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
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
    
    if (!query) {
      setWeapons(mockWeapons);
      return;
    }
    
    const filteredData = mockWeapons.filter((weapon) => {
      const lowerQuery = query.toLowerCase();
      return (
        weapon.name.toLowerCase().includes(lowerQuery) ||
        weapon.type.toLowerCase().includes(lowerQuery) ||
        weapon.caliber.toLowerCase().includes(lowerQuery) ||
        weapon.serialNumber.toLowerCase().includes(lowerQuery) ||
        (weapon.manufacturerName && weapon.manufacturerName.toLowerCase().includes(lowerQuery))
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
  const handleDelete = (id: number) => {
    // In a real app, you'd call an API here
    const updatedWeapons = weapons.filter(
      (weapon) => weapon.id !== id
    );
    setWeapons(updatedWeapons);
  };
  
  // Handle add new
  const handleAddNew = () => {
    navigate('/weapons/new');
  };
  
  return (
    <Box>
      <PageHeader 
        title="Weapons" 
        icon={<GavelIcon fontSize="large" />}
        onAdd={handleAddNew}
        buttonText="Add Weapon"
      />
      
      <Box sx={{ mb: 3 }}>
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search weapons..."
          initialValue={searchQuery}
        />
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
    </Box>
  );
};

export default WeaponList; 