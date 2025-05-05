import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  CircularProgress, 
  Divider,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  CardContent,
  Grid,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import GavelIcon from '@mui/icons-material/Gavel';
import FactoryIcon from '@mui/icons-material/Factory';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { PageHeader } from '../../components/common';
import {
  manufacturerApi,
  militaryUnitApi,
  weaponApi,
  soldierApi,
  weaponAssignmentApi,
  storageFacilityApi,
  weaponMaintenanceApi,
  ammunitionApi
} from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, onClick }) => (
  <Card 
    sx={{ 
      height: '100%', 
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': onClick ? {
        transform: 'translateY(-5px)',
        boxShadow: 6,
      } : {},
    }}
    onClick={onClick}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: color, mr: 2 }}>
          {icon}
        </Avatar>
        <Typography variant="h6" fontWeight="medium">
          {title}
        </Typography>
      </Box>
      <Typography variant="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    manufacturers: 0,
    militaryUnits: 0,
    weapons: 0,
    soldiers: 0,
    weaponAssignments: 0,
    storageFacilities: 0,
    maintenanceRecords: 0,
    ammunition: 0
  });
  
  // Data for charts
  const [weaponsByType, setWeaponsByType] = useState<{[key: string]: number}>({});
  const [weaponsByStatus, setWeaponsByStatus] = useState<{[key: string]: number}>({});
  const [maintenanceByStatus, setMaintenanceByStatus] = useState<{[key: string]: number}>({});
  const [unitWeaponDistribution, setUnitWeaponDistribution] = useState<{name: string, count: number}[]>([]);
  const [ammoQuantityByType, setAmmoQuantityByType] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data needed for the dashboard
        const [
          manufacturers,
          militaryUnits,
          weapons,
          soldiers,
          weaponAssignments,
          storageFacilities,
          maintenanceRecords,
          ammunition
        ] = await Promise.all([
          manufacturerApi.getAll(),
          militaryUnitApi.getAll(),
          weaponApi.getAll(),
          soldierApi.getAll(),
          weaponAssignmentApi.getAll(),
          storageFacilityApi.getAll(),
          weaponMaintenanceApi.getAll(),
          ammunitionApi.getAll()
        ]);

        // Set basic stats
        setStats({
          manufacturers: manufacturers.length,
          militaryUnits: militaryUnits.length,
          weapons: weapons.length,
          soldiers: soldiers.length,
          weaponAssignments: weaponAssignments.length,
          storageFacilities: storageFacilities.length,
          maintenanceRecords: maintenanceRecords.length,
          ammunition: ammunition.length
        });

        // Process weapons by type
        const typeCount: {[key: string]: number} = {};
        weapons.forEach(weapon => {
          if (weapon.Type) {
            typeCount[weapon.Type] = (typeCount[weapon.Type] || 0) + 1;
          }
        });
        setWeaponsByType(typeCount);

        // Process weapons by status
        const statusCount: {[key: string]: number} = {};
        weapons.forEach(weapon => {
          if (weapon.Status) {
            statusCount[weapon.Status] = (statusCount[weapon.Status] || 0) + 1;
          }
        });
        setWeaponsByStatus(statusCount);

        // Process maintenance by status
        const maintenanceStatusCount: {[key: string]: number} = {};
        maintenanceRecords.forEach(record => {
          if (record.Status) {
            maintenanceStatusCount[record.Status] = (maintenanceStatusCount[record.Status] || 0) + 1;
          }
        });
        setMaintenanceByStatus(maintenanceStatusCount);

        // Process units with weapon counts (top 5)
        const unitWeapons: {name: string, count: number}[] = militaryUnits
          .map(unit => ({
            name: unit.Name,
            count: weapons.filter(w => w.Assigned_Unit_ID === unit.Unit_ID).length
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setUnitWeaponDistribution(unitWeapons);

        // Process ammunition by type
        const ammoByType: {[key: string]: number} = {};
        ammunition.forEach(ammo => {
          if (ammo.Type) {
            ammoByType[ammo.Type] = (ammoByType[ammo.Type] || 0) + (ammo.Quantity || 0);
          }
        });
        setAmmoQuantityByType(ammoByType);

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Prepare data for charts
  const weaponTypeData = {
    labels: Object.keys(weaponsByType),
    datasets: [
      {
        label: 'Weapons by Type',
        data: Object.values(weaponsByType),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#8BC34A', '#3F51B5'
        ],
        borderWidth: 1,
      },
    ],
  };

  const weaponStatusData = {
    labels: Object.keys(weaponsByStatus),
    datasets: [
      {
        label: 'Weapons by Status',
        data: Object.values(weaponsByStatus),
        backgroundColor: [
          theme.palette.success.main, 
          theme.palette.error.main, 
          theme.palette.warning.main
        ],
        borderWidth: 1,
      },
    ],
  };

  const maintenanceStatusData = {
    labels: Object.keys(maintenanceByStatus),
    datasets: [
      {
        label: 'Maintenance by Status',
        data: Object.values(maintenanceByStatus),
        backgroundColor: [
          theme.palette.info.main,
          theme.palette.warning.main,
          theme.palette.success.main,
          theme.palette.error.main,
        ],
        borderWidth: 1,
      },
    ],
  };

  const unitWeaponData = {
    labels: unitWeaponDistribution.map(unit => unit.name),
    datasets: [
      {
        label: 'Weapons Count',
        data: unitWeaponDistribution.map(unit => unit.count),
        backgroundColor: theme.palette.primary.main,
      },
    ],
  };

  const ammoQuantityData = {
    labels: Object.keys(ammoQuantityByType),
    datasets: [
      {
        label: 'Ammunition Quantity by Type',
        data: Object.values(ammoQuantityByType),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#8BC34A'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <PageHeader 
        title="Dashboard" 
        showButton={false}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Weapons"
            value={stats.weapons}
            icon={<GavelIcon />}
            color="#f44336"
            onClick={() => navigate('/weapons')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Personnel"
            value={stats.soldiers}
            icon={<PeopleOutlineIcon />}
            color="#4caf50"
            onClick={() => navigate('/soldiers')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Military Units"
            value={stats.militaryUnits}
            icon={<MilitaryTechIcon />}
            color="#673ab7"
            onClick={() => navigate('/military-units')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Maintenance"
            value={stats.maintenanceRecords}
            icon={<EngineeringIcon />}
            color="#ff9800"
            onClick={() => navigate('/weapon-maintenance')}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
        Weapons Analytics
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Weapons Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Weapons by Type
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie 
                data={weaponTypeData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Weapons by Status
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut 
                data={weaponStatusData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
        Unit & Maintenance Analytics
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Unit and Maintenance Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Top Military Units by Weapon Count
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar 
                data={unitWeaponData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Maintenance Status Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie 
                data={maintenanceStatusData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
        Ammunition & Inventory
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Ammunition Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Ammunition Quantity by Type
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar 
                data={ammoQuantityData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
        Quick Navigation
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Info Panels */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Inventory Overview
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Current system includes {stats.weapons} weapons across {stats.militaryUnits} military units,
              with {stats.weaponAssignments} active assignments and {stats.ammunition} ammunition records.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click on any card above to view detailed information.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <List>
              <ListItem onClick={() => navigate('/weapons')} sx={{ cursor: 'pointer' }}>
                <ListItemAvatar>
                  <Avatar>
                    <GavelIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Weapons Inventory" 
                  secondary="View and manage all weapons in the system"
                />
              </ListItem>
              <ListItem onClick={() => navigate('/weapon-assignments')} sx={{ cursor: 'pointer' }}>
                <ListItemAvatar>
                  <Avatar>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Weapon Assignments" 
                  secondary="Manage weapon assignments to personnel"
                />
              </ListItem>
              <ListItem onClick={() => navigate('/storage-facilities')} sx={{ cursor: 'pointer' }}>
                <ListItemAvatar>
                  <Avatar>
                    <ApartmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Storage Facilities" 
                  secondary="Manage weapon storage locations"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 