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