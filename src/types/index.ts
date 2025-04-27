export interface Manufacturer {
  id: number;
  name: string;
  country: string;
  established: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
}

export interface MilitaryUnit {
  id: number;
  name: string;
  location: string;
  commanderName: string;
  type: string;
  personnel: number;
  established: string;
}

export interface Weapon {
  id: number;
  name: string;
  type: string;
  caliber: string;
  manufacturerId: number;
  manufacturerName?: string;
  serialNumber: string;
  manufactureDate: string;
  status: 'Available' | 'Assigned' | 'Maintenance' | 'Retired';
  description: string;
}

export interface Soldier {
  id: number;
  firstName: string;
  lastName: string;
  rank: string;
  serialNumber: string;
  dateOfBirth: string;
  joinDate: string;
  unitId: number;
  unitName?: string;
  status: 'Active' | 'Leave' | 'Training' | 'Deployed' | 'Retired';
  specialization: string;
}

export interface WeaponAssignment {
  id: number;
  weaponId: number;
  weaponName?: string;
  soldierId: number;
  soldierName?: string;
  assignDate: string;
  dueDate?: string;
  status: 'Active' | 'Returned' | 'Lost' | 'Damaged';
  notes?: string;
}

export interface StorageFacility {
  id: number;
  name: string;
  location: string;
  capacity: number;
  securityLevel: string;
  manager: string;
  contact: string;
  status: 'Operational' | 'Under Maintenance' | 'Full' | 'Decommissioned';
}

export interface Maintenance {
  id: number;
  weaponId: number;
  weaponName?: string;
  type: 'Regular' | 'Repair' | 'Upgrade' | 'Inspection';
  startDate: string;
  endDate?: string;
  technician: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  cost?: number;
  notes?: string;
}

export interface Ammunition {
  id: number;
  type: string;
  caliber: string;
  quantity: number;
  manufacturerId: number;
  manufacturerName?: string;
  batchNumber: string;
  manufactureDate: string;
  expirationDate?: string;
  storageId: number;
  storageName?: string;
  status: 'Available' | 'Reserved' | 'Depleted' | 'Expired';
}

export interface DashboardStats {
  totalWeapons: number;
  availableWeapons: number;
  totalSoldiers: number;
  activeSoldiers: number;
  totalFacilities: number;
  scheduledMaintenance: number;
  weaponsByType: {
    type: string;
    count: number;
  }[];
  soldiersByUnit: {
    unit: string;
    count: number;
  }[];
  maintenanceByStatus: {
    status: string;
    count: number;
  }[];
  ammunitionByType: {
    type: string;
    count: number;
  }[];
}

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortOrder;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
} 