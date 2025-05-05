export interface Manufacturer {
  Manufacturer_ID?: number;
  Name: string;
  Country: string;
  Contact_Info: string;
  Status: 'Active' | 'Inactive' | 'Suspended';
  // Calculated fields from joins
  Weapon_Count?: number;
  Ammunition_Count?: number;
}

export interface MilitaryUnit {
  Unit_ID?: number;
  Name: string;
  Branch: string;
  Location: string;
  Commanding_Officer: string;
  // Calculated fields from joins
  Soldier_Count?: number;
  Weapon_Assignment_Count?: number;
}

export interface Weapon {
  Weapon_ID?: number;
  Name: string;
  Type: string;
  Model: string;
  Serial_Number?: string;
  Manufacturer_ID: number;
  Manufacturer_Name?: string;
  Caliber?: string;
  Acquisition_Date?: string;
  Status: 'Active' | 'Inactive' | 'Under Maintenance';
  Assigned_Unit_ID?: number;
  Storage_Facility_ID?: number;
  Last_Inspection_Date?: string;
  // Joined fields
  Facility_Name?: string;
  Unit_Name?: string;
}

export interface Soldier {
  Soldier_ID?: number;
  First_Name: string;
  Last_Name: string;
  Rank: string;
  Serial_Number: string;
  Date_of_Birth: string;
  Join_Date: string;
  Unit_ID: number;
  Status: 'Active' | 'Inactive' | 'On Leave';
  Specialization: string;
  // Joined fields
  Unit_Name?: string;
}

export interface WeaponAssignment {
  Assignment_ID?: number;
  Weapon_ID: number;
  Soldier_ID: number;
  Unit_ID: number;
  Assignment_Date: string;
  Return_Date?: string;
  Status: 'Active' | 'Returned' | 'Lost';
  Notes?: string;
  // Joined fields
  Weapon_Serial?: string;
  First_Name?: string;
  Last_Name?: string;
  Unit_Name?: string;
}

export interface StorageFacility {
  Facility_ID?: number;
  Name: string;
  Location: string;
  Capacity: number;
  Security_Level: 'Low' | 'Medium' | 'High' | 'Maximum';
  Status: 'Active' | 'Inactive' | 'Under Maintenance';
  Unit_ID?: number;
  Manager: string;
  Contact: string;
  // Joined fields
  Unit_Name?: string;
}

export interface WeaponMaintenance {
  Maintenance_ID?: number;
  Weapon_ID: number;
  Type: string;
  Start_Date: string;
  End_Date?: string;
  Technician?: string;
  Cost?: number;
  Status: string;
  Notes?: string;
  // These fields are for display purposes
  Weapon_Name?: string;
  Weapon_Serial?: string;
  First_Name?: string;
  Last_Name?: string;
}

export interface Ammunition {
  Ammunition_ID?: number;
  Name: string;
  Type: string;
  Caliber?: string;
  Quantity: number;
  Manufacturer_ID?: number;
  Batch_Number?: string;
  Production_Date?: string;
  Expiration_Date?: string;
  Facility_ID?: number;
  Status: 'Available' | 'Reserved' | 'Depleted' | 'Expired';
  // Joined fields
  Manufacturer_Name?: string;
  Facility_Name?: string;
}

export interface DashboardStats {
  totalWeapons: number;
  activeWeapons: number;
  totalSoldiers: number;
  totalUnits: number;
  totalMaintenance: number;
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

export interface SelectOption {
  value: string | number;
  label: string;
} 