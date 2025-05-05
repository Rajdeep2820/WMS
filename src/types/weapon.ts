export interface Weapon {
  Weapon_ID: number;
  Name: string;
  Type: string;
  Model: string;
  Serial_Number: string;
  Manufacturer_ID: number;
  Manufacturer_Name?: string;
  Status: 'Active' | 'Inactive' | 'Under Maintenance';
  Caliber?: string | null;
  Assigned_Unit_ID?: number | null;
  Last_Inspection_Date?: string | null;
  Facility_ID?: number | null;
  Acquisition_Date?: string | null;
  created_at?: string;
  updated_at?: string;
} 