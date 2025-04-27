import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  alpha,
  useTheme,
  Paper,
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { PageHeader } from '../../components/common';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BuildIcon from '@mui/icons-material/Build';

// Mock data for the dashboard
const mockDashboardData = {
  totalWeapons: 2580,
  availableWeapons: 1850,
  totalSoldiers: 4200,
  activeSoldiers: 3800,
  totalFacilities: 18,
  scheduledMaintenance: 35,
  weaponsByType: [
    { type: 'Rifles', count: 1200 },
    { type: 'Handguns', count: 800 },
    { type: 'Sniper Rifles', count: 120 },
    { type: 'Machine Guns', count: 280 },
    { type: 'Shotguns', count: 180 },
  ],
  soldiersByUnit: [
    { unit: 'Alpha', count: 1200 },
    { unit: 'Bravo', count: 950 },
    { unit: 'Charlie', count: 850 },
    { unit: 'Delta', count: 720 },
    { unit: 'Support', count: 480 },
  ],
  maintenanceByStatus: [
    { status: 'Scheduled', count: 35 },
    { status: 'In Progress', count: 18 },
    { status: 'Completed', count: 88 },
    { status: 'Cancelled', count: 4 },
  ],
  ammunitionByType: [
    { type: '5.56mm', count: 48000 },
    { type: '9mm', count: 32000 },
    { type: '7.62mm', count: 18000 },
    { type: '12 Gauge', count: 8500 },
    { type: '.50 BMG', count: 2000 },
  ],
};

const COLORS = ['#1f3a5f', '#3d6a45', '#8884d8', '#e57373', '#4db6ac', '#ff9800'];

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  secondary?: string;
  color?: string;
}> = ({ title, value, icon, secondary, color }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value.toLocaleString()}
            </Typography>
            {secondary && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {secondary}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: alpha(color || theme.palette.primary.main, 0.1),
              borderRadius: '50%',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color || theme.palette.primary.main,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <PageHeader 
        title="Dashboard" 
        icon={<DashboardIcon fontSize="large" />} 
        showButton={false} 
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Summary Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '240px' }}>
            <StatCard
              title="Total Weapons"
              value={mockDashboardData.totalWeapons}
              secondary={`${mockDashboardData.availableWeapons} Available`}
              icon={<GavelIcon />}
              color={theme.palette.primary.main}
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '240px' }}>
            <StatCard
              title="Total Personnel"
              value={mockDashboardData.totalSoldiers}
              secondary={`${mockDashboardData.activeSoldiers} Active`}
              icon={<PersonIcon />}
              color={theme.palette.secondary.main}
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '240px' }}>
            <StatCard
              title="Storage Facilities"
              value={mockDashboardData.totalFacilities}
              icon={<HomeWorkIcon />}
              color={theme.palette.info.main}
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '240px' }}>
            <StatCard
              title="Scheduled Maintenance"
              value={mockDashboardData.scheduledMaintenance}
              icon={<BuildIcon />}
              color={theme.palette.warning.main}
            />
          </Box>
        </Box>

        {/* Charts - First Row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '320px' }}>
            <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Weapons by Type
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={mockDashboardData.weaponsByType}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '320px' }}>
            <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Soldiers by Unit
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={mockDashboardData.soldiersByUnit}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="unit" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill={theme.palette.secondary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Box>

        {/* Charts - Second Row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '320px' }}>
            <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Maintenance Status
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={mockDashboardData.maintenanceByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="status"
                    >
                      {mockDashboardData.maintenanceByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>

          <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: '320px' }}>
            <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Ammunition by Type
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={mockDashboardData.ammunitionByType}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill={theme.palette.info.main} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 