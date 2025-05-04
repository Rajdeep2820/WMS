import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Layout } from './components/layout';
import Dashboard from './pages/Dashboard';
import { ManufacturerList, ManufacturerForm } from './pages/Manufacturer';
import { WeaponList, WeaponForm } from './pages/Weapon';
import { MilitaryUnitList, MilitaryUnitForm } from './pages/MilitaryUnit';
import { AmmunitionList, AmmunitionForm } from './pages/Ammunition';
import { MaintenanceList, MaintenanceForm } from './pages/Maintenance';
import { SoldierList, SoldierForm } from './pages/Soldier';
import { WeaponAssignmentList, WeaponAssignmentForm } from './pages/WeaponAssignment';
import { StorageFacilityList, StorageFacilityForm } from './pages/StorageFacility';


// For now, add placeholder components for other pages
const PlaceholderPage = ({ title }: { title: string }) => <div>{title} Page</div>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            
            {/* Manufacturers */}
            <Route path="manufacturers">
              <Route index element={<ManufacturerList />} />
              <Route path="new" element={<ManufacturerForm />} />
              <Route path="edit/:id" element={<ManufacturerForm />} />
              <Route path=":id" element={<ManufacturerForm />} />
            </Route>
            
            {/* Weapons */}
            <Route path="weapons">
              <Route index element={<WeaponList />} />
              <Route path="new" element={<WeaponForm />} />
              <Route path="edit/:id" element={<WeaponForm />} />
              <Route path=":id" element={<WeaponForm />} />
            </Route>
            
            {/* Military Units */}
            <Route path="military-units">
              <Route index element={<MilitaryUnitList />} />
              <Route path="new" element={<MilitaryUnitForm />} />
              <Route path="edit/:id" element={<MilitaryUnitForm />} />
              <Route path=":id" element={<MilitaryUnitForm />} />
            </Route>
            
            {/* Ammunition */}
            <Route path="ammunition">
              <Route index element={<AmmunitionList />} />
              <Route path="new" element={<AmmunitionForm />} />
              <Route path="edit/:id" element={<AmmunitionForm />} />
              <Route path=":id" element={<AmmunitionForm />} />
            </Route>
            
            {/* Soldiers */}
            <Route path="soldiers">
              <Route index element={<SoldierList />} />
              <Route path="new" element={<SoldierForm />} />
              <Route path="edit/:id" element={<SoldierForm />} />
              <Route path=":id" element={<SoldierForm />} />
            </Route>
            
            {/* Maintenance */}
            <Route path="maintenance">
              <Route index element={<MaintenanceList />} />
              <Route path="new" element={<MaintenanceForm />} />
              <Route path="edit/:id" element={<MaintenanceForm />} />
              <Route path=":id" element={<MaintenanceForm />} />
            </Route>
            
            {/* Weapon Assignments */}
            <Route path="weapon-assignments">
              <Route index element={<WeaponAssignmentList />} />
              <Route path="new" element={<WeaponAssignmentForm />} />
              <Route path="edit/:id" element={<WeaponAssignmentForm />} />
              <Route path=":id" element={<WeaponAssignmentForm />} />
            </Route>
            
            {/* Storage Facilities */}
            <Route path="storage-facilities">
              <Route index element={<StorageFacilityList />} />
              <Route path="new" element={<StorageFacilityForm />} />
              <Route path="edit/:id" element={<StorageFacilityForm />} />
              <Route path=":id" element={<StorageFacilityForm />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
