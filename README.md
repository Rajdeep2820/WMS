# Weaponry Management System

A comprehensive system for managing military weaponry, personnel, and inventory with a React frontend and Node.js/Express backend.

## System Features

- **Inventory Management**: Track weapons, ammunition, and maintenance records
- **Personnel Management**: Manage military units and soldier data
- **Assignment Tracking**: Monitor weapon assignments to soldiers
- **Storage Management**: Handle storage facilities and inventory locations
- **Reporting**: Generate insights on weapon usage and status

## Architecture

### Frontend
- **Framework**: React with TypeScript
- **UI Components**: Material UI
- **State Management**: React Hooks
- **Routing**: React Router

### Backend
- **Framework**: Node.js with Express
- **Database**: MySQL

## Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL (v8+)
- npm or yarn

### Database Setup

1. Create a MySQL database named `weaponry_management`
2. Configure database connection settings in `/backend/.env` (create this file if it doesn't exist):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=weaponry_management
PORT=5001
```

3. Run the database setup script to create tables and load sample data:
```
cd backend
npm run setup-db
```

For more detailed information about the database structure and setup, please refer to the `DATABASE_README.md` file in the backend directory.

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd ..
   npm install
   ```

### Running the Application

Use our development script that starts both backend and frontend:

```
./start-dev.sh
```

Alternatively, you can start the servers separately:

**Backend:**
```
cd backend
npm start
```

**Frontend:**
```
npm start
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:5001/api`.

## API Endpoints

### Manufacturers
- `GET /api/manufacturers` - Get all manufacturers
- `GET /api/manufacturers/:id` - Get manufacturer by ID
- `POST /api/manufacturers` - Create new manufacturer
- `PUT /api/manufacturers/:id` - Update manufacturer
- `DELETE /api/manufacturers/:id` - Delete manufacturer

### Military Units
- `GET /api/military-units` - Get all military units
- `GET /api/military-units/:id` - Get military unit by ID
- `POST /api/military-units` - Create new military unit
- `PUT /api/military-units/:id` - Update military unit
- `DELETE /api/military-units/:id` - Delete military unit

### Weapons
- `GET /api/weapons` - Get all weapons
- `GET /api/weapons/:id` - Get weapon by ID
- `POST /api/weapons` - Create new weapon
- `PUT /api/weapons/:id` - Update weapon
- `DELETE /api/weapons/:id` - Delete weapon

### Soldiers
- `GET /api/soldiers` - Get all soldiers
- `GET /api/soldiers/:id` - Get soldier by ID
- `POST /api/soldiers` - Create new soldier
- `PUT /api/soldiers/:id` - Update soldier
- `DELETE /api/soldiers/:id` - Delete soldier

### Weapon Assignments
- `GET /api/weapon-assignments` - Get all weapon assignments
- `GET /api/weapon-assignments/:id` - Get weapon assignment by ID
- `POST /api/weapon-assignments` - Create new weapon assignment
- `PUT /api/weapon-assignments/:id` - Update weapon assignment
- `DELETE /api/weapon-assignments/:id` - Delete weapon assignment

### Storage Facilities
- `GET /api/storage-facilities` - Get all storage facilities
- `GET /api/storage-facilities/:id` - Get storage facility by ID
- `POST /api/storage-facilities` - Create new storage facility
- `PUT /api/storage-facilities/:id` - Update storage facility
- `DELETE /api/storage-facilities/:id` - Delete storage facility

### Weapon Maintenance
- `GET /api/weapon-maintenance` - Get all maintenance records
- `GET /api/weapon-maintenance/:id` - Get maintenance record by ID
- `POST /api/weapon-maintenance` - Create new maintenance record
- `PUT /api/weapon-maintenance/:id` - Update maintenance record
- `DELETE /api/weapon-maintenance/:id` - Delete maintenance record

### Ammunition
- `GET /api/ammunition` - Get all ammunition
- `GET /api/ammunition/:id` - Get ammunition by ID
- `POST /api/ammunition` - Create new ammunition
- `PUT /api/ammunition/:id` - Update ammunition
- `DELETE /api/ammunition/:id` - Delete ammunition

## Development

### Project Structure

```
/
├── backend/                # Backend server code
│   ├── config/             # Configuration files
│   ├── controllers/        # API controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── server.js           # Server entry point
├── src/                    # Frontend React code
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── types/              # TypeScript interfaces
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main App component
│   └── index.tsx           # React entry point
└── package.json            # Project configuration
```

## License

This project is licensed under the MIT License.

## Contributors

- Project Lead: [Your Name]
- Backend Developer: [Backend Developer Name]
- Frontend Developer: [Frontend Developer Name]
