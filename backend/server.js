const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Regular expressions to match allowed origins
    const allowedOrigins = [
      /^http:\/\/localhost:[0-9]+$/, // Any localhost port
      /^http:\/\/127\.0\.0\.1:[0-9]+$/ // Any 127.0.0.1 port
    ];
    
    // Check if the origin matches any of the allowed patterns
    const allowed = allowedOrigins.some(pattern => pattern.test(origin));
    
    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Add request/response logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Import routes
const weaponRoutes = require('./routes/weapon.routes');
const manufacturerRoutes = require('./routes/manufacturer.routes');
const militaryUnitRoutes = require('./routes/militaryUnit.routes');
const soldierRoutes = require('./routes/soldier.routes');
const weaponAssignmentRoutes = require('./routes/weaponAssignment.routes');
const storageFacilityRoutes = require('./routes/storageFacility.routes');
const weaponMaintenanceRoutes = require('./routes/weaponMaintenance.routes');
const ammunitionRoutes = require('./routes/ammunition.routes');

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Weaponry Management System API' });
});

// Use API routes
app.use('/api/weapons', weaponRoutes);
app.use('/api/manufacturers', manufacturerRoutes);
app.use('/api/military-units', militaryUnitRoutes);
app.use('/api/soldiers', soldierRoutes);
app.use('/api/weapon-assignments', weaponAssignmentRoutes);
app.use('/api/storage-facilities', storageFacilityRoutes);
app.use('/api/weapon-maintenance', weaponMaintenanceRoutes);
app.use('/api/ammunition', ammunitionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Function to try different ports
async function tryPort(port) {
  const maxRetries = 5;
  let currentPort = parseInt(port);
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await new Promise((resolve, reject) => {
        const server = app.listen(currentPort)
          .on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              console.log(`Port ${currentPort} is in use, trying ${currentPort + 1}`);
              currentPort++;
              retries++;
              reject(err);
            } else {
              reject(err);
            }
          })
          .on('listening', () => {
            console.log(`Server is running on port ${currentPort}`);
            resolve(server);
          });
      });
    } catch (err) {
      if (retries >= maxRetries - 1) {
        throw new Error(`Failed to find an available port after ${maxRetries} attempts`);
      }
    }
  }
}

// Start server
const PORT = process.env.PORT || 5001;
tryPort(PORT).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
}); 