export interface StorageFacility {
  Facility_ID: number;
  Name: string;
  Location?: string;
  Capacity?: number;
  Security_Level?: 'Low' | 'Medium' | 'High' | 'Maximum';
  Status?: 'Operational' | 'Under Maintenance' | 'Full' | 'Decommissioned';
}