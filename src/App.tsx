import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Layout } from './components/layout';
import Dashboard from './pages/Dashboard';
import { ManufacturerList, ManufacturerForm } from './pages/Manufacturer';
import { WeaponList } from './pages/Weapon';

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
            
            <Route path="manufacturers">
              <Route index element={<ManufacturerList />} />
              <Route path="new" element={<ManufacturerForm />} />
              <Route path="edit/:id" element={<ManufacturerForm />} />
              <Route path=":id" element={<ManufacturerForm />} />
            </Route>
            
            <Route path="weapons">
              <Route index element={<WeaponList />} />
              <Route path="new" element={<PlaceholderPage title="Add Weapon" />} />
              <Route path="edit/:id" element={<PlaceholderPage title="Edit Weapon" />} />
              <Route path=":id" element={<PlaceholderPage title="Weapon Details" />} />
            </Route>
            
            <Route path="military-units" element={<PlaceholderPage title="Military Units" />} />
            <Route path="soldiers" element={<PlaceholderPage title="Soldiers" />} />
            <Route path="weapon-assignments" element={<PlaceholderPage title="Weapon Assignments" />} />
            <Route path="storage-facilities" element={<PlaceholderPage title="Storage Facilities" />} />
            <Route path="maintenance" element={<PlaceholderPage title="Maintenance" />} />
            <Route path="ammunition" element={<PlaceholderPage title="Ammunition" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
