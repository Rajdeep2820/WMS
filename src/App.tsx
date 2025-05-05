import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { Box, CircularProgress } from '@mui/material';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// Manufacturer pages
const ManufacturerList = React.lazy(() => import('./pages/Manufacturer/ManufacturerList'));
const ManufacturerForm = React.lazy(() => import('./pages/Manufacturer/ManufacturerForm'));
const ManufacturerDetails = React.lazy(() => import('./pages/Manufacturer/ManufacturerDetails'));

// Ammunition pages
const AmmunitionList = React.lazy(() => import('./pages/Ammunition/AmmunitionList'));
const AmmunitionForm = React.lazy(() => import('./pages/Ammunition/AmmunitionForm'));
const AmmunitionDetails = React.lazy(() => import('./pages/Ammunition/AmmunitionDetails'));

// Maintenance pages
const MaintenanceList = React.lazy(() => import('./pages/Maintenance/MaintenanceList'));
const MaintenanceForm = React.lazy(() => import('./pages/Maintenance/MaintenanceForm'));
const MaintenanceDetails = React.lazy(() => import('./pages/Maintenance/MaintenanceDetails'));

// Storage Facility pages
const StorageFacilityList = React.lazy(() => import('./pages/StorageFacility/StorageFacilityList'));
const StorageFacilityForm = React.lazy(() => import('./pages/StorageFacility/StorageFacilityForm'));
const StorageFacilityDetails = React.lazy(() => import('./pages/StorageFacility/StorageFacilityDetails'));

// Weapon pages
const WeaponList = React.lazy(() => import('./pages/Weapon/WeaponList'));
const WeaponForm = React.lazy(() => import('./pages/Weapon/WeaponForm'));
const WeaponDetails = React.lazy(() => import('./pages/Weapon/WeaponDetails'));

// Personnel (Soldier) pages
const SoldierList = React.lazy(() => import('./pages/Soldier/SoldierList'));
const SoldierForm = React.lazy(() => import('./pages/Soldier/SoldierForm'));
const SoldierDetails = React.lazy(() => import('./pages/Soldier/SoldierDetails'));

// Weapon Assignment pages
const WeaponAssignmentList = React.lazy(() => import('./pages/WeaponAssignment/WeaponAssignmentList'));
const WeaponAssignmentForm = React.lazy(() => import('./pages/WeaponAssignment/WeaponAssignmentForm'));
const WeaponAssignmentDetails = React.lazy(() => import('./pages/WeaponAssignment/WeaponAssignmentDetails'));

// Loading component for suspense
const LoadingFallback = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Manufacturer routes */}
            <Route path="/manufacturers" element={<ManufacturerList />} />
            <Route path="/manufacturers/new" element={<ManufacturerForm />} />
            <Route path="/manufacturers/:id" element={<ManufacturerDetails />} />
            <Route path="/manufacturers/edit/:id" element={<ManufacturerForm />} />
            
            {/* Ammunition routes */}
            <Route path="/ammunition" element={<AmmunitionList />} />
            <Route path="/ammunition/new" element={<AmmunitionForm />} />
            <Route path="/ammunition/:id" element={<AmmunitionDetails />} />
            <Route path="/ammunition/:id/edit" element={<AmmunitionForm />} />
            
            {/* Maintenance routes */}
            <Route path="/weapon-maintenance" element={<MaintenanceList />} />
            <Route path="/weapon-maintenance/new" element={<MaintenanceForm />} />
            <Route path="/weapon-maintenance/:id" element={<MaintenanceDetails />} />
            <Route path="/weapon-maintenance/:id/edit" element={<MaintenanceForm />} />
            
            {/* Storage Facility routes */}
            <Route path="/storage-facilities" element={<StorageFacilityList />} />
            <Route path="/storage-facilities/new" element={<StorageFacilityForm />} />
            <Route path="/storage-facilities/:id" element={<StorageFacilityDetails />} />
            <Route path="/storage-facilities/edit/:id" element={<StorageFacilityForm />} />
            
            {/* Weapon routes */}
            <Route path="/weapons" element={<WeaponList />} />
            <Route path="/weapons/new" element={<WeaponForm />} />
            <Route path="/weapons/:id" element={<WeaponDetails />} />
            <Route path="/weapons/edit/:id" element={<WeaponForm />} />
            
            {/* Personnel (Soldier) routes */}
            <Route path="/soldiers" element={<SoldierList />} />
            <Route path="/soldiers/new" element={<SoldierForm />} />
            <Route path="/soldiers/:id" element={<SoldierDetails />} />
            <Route path="/soldiers/:id/edit" element={<SoldierForm />} />
            
            {/* Weapon Assignment routes */}
            <Route path="/weapon-assignments" element={<WeaponAssignmentList />} />
            <Route path="/weapon-assignments/new" element={<WeaponAssignmentForm />} />
            <Route path="/weapon-assignments/:id" element={<WeaponAssignmentDetails />} />
            <Route path="/weapon-assignments/:id/edit" element={<WeaponAssignmentForm />} />
            
            {/* Redirect to home for any other routes */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App; 