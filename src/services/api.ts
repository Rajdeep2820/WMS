import axios from 'axios';
import { 
  Manufacturer, 
  MilitaryUnit, 
  Weapon, 
  Soldier, 
  WeaponAssignment,
  WeaponMaintenance,
  Ammunition
} from '../types';
import { StorageFacility } from '../types/storageFacility';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Generic API functions
const getAll = async <T>(endpoint: string): Promise<T[]> => {
  console.log(`Fetching data from endpoint: ${endpoint}`);
  try {
    const response = await api.get<T[]>(endpoint);
    console.log(`Response from ${endpoint}:`, response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

const getById = async <T>(endpoint: string, id: number): Promise<T> => {
  const response = await api.get<T>(`${endpoint}/${id}`);
  return response.data;
};

const create = async <T>(endpoint: string, data: T): Promise<{ id: number, message: string }> => {
  const response = await api.post<{ id: number, message: string }>(endpoint, data);
  return response.data;
};

const update = async <T>(endpoint: string, id: number, data: T): Promise<{ message: string }> => {
  const response = await api.put<{ message: string }>(`${endpoint}/${id}`, data);
  return response.data;
};

const remove = async (endpoint: string, id: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`${endpoint}/${id}`);
  return response.data;
};

// API service per entity
export const manufacturerApi = {
  getAll: () => getAll<Manufacturer>('/api/manufacturers'),
  getById: (id: number) => getById<Manufacturer>('/api/manufacturers', id),
  create: (data: Manufacturer) => create<Manufacturer>('/api/manufacturers', data),
  update: (id: number, data: Manufacturer) => update<Manufacturer>('/api/manufacturers', id, data),
  delete: (id: number) => remove('/api/manufacturers', id),
};

export const militaryUnitApi = {
  getAll: () => getAll<MilitaryUnit>('/api/military-units'),
  getById: (id: number) => getById<MilitaryUnit>('/api/military-units', id),
  create: (data: MilitaryUnit) => create<MilitaryUnit>('/api/military-units', data),
  update: (id: number, data: MilitaryUnit) => update<MilitaryUnit>('/api/military-units', id, data),
  delete: (id: number) => remove('/api/military-units', id),
};

export const weaponApi = {
  getAll: () => getAll<Weapon>('/api/weapons'),
  getById: (id: number) => getById<Weapon>('/api/weapons', id),
  create: (data: Weapon) => create<Weapon>('/api/weapons', data),
  update: (id: number, data: Weapon) => update<Weapon>('/api/weapons', id, data),
  delete: (id: number) => remove('/api/weapons', id),
};

export const soldierApi = {
  getAll: () => getAll<Soldier>('/api/soldiers'),
  getById: (id: number) => getById<Soldier>('/api/soldiers', id),
  create: (data: Soldier) => create<Soldier>('/api/soldiers', data),
  update: (id: number, data: Soldier) => update<Soldier>('/api/soldiers', id, data),
  delete: (id: number) => remove('/api/soldiers', id),
};

export const weaponAssignmentApi = {
  getAll: () => getAll<WeaponAssignment>('/api/weapon-assignments'),
  getById: (id: number) => getById<WeaponAssignment>('/api/weapon-assignments', id),
  create: (data: WeaponAssignment) => create<WeaponAssignment>('/api/weapon-assignments', data),
  update: (id: number, data: WeaponAssignment) => update<WeaponAssignment>('/api/weapon-assignments', id, data),
  delete: (id: number) => remove('/api/weapon-assignments', id),
};

export const storageFacilityApi = {
  getAll: () => getAll<StorageFacility>('/api/storage-facilities'),
  getById: (id: number) => getById<StorageFacility>('/api/storage-facilities', id),
  create: (data: Omit<StorageFacility, 'Facility_ID'>) => 
    create<Omit<StorageFacility, 'Facility_ID'>>('/api/storage-facilities', data),
  update: (id: number, data: Omit<StorageFacility, 'Facility_ID'>) => 
    update<Omit<StorageFacility, 'Facility_ID'>>('/api/storage-facilities', id, data),
  delete: (id: number) => remove('/api/storage-facilities', id),
};

export const weaponMaintenanceApi = {
  getAll: () => getAll<WeaponMaintenance>('/api/weapon-maintenance'),
  getById: (id: number) => getById<WeaponMaintenance>('/api/weapon-maintenance', id),
  create: (data: WeaponMaintenance) => create<WeaponMaintenance>('/api/weapon-maintenance', data),
  update: (id: number, data: WeaponMaintenance) => update<WeaponMaintenance>('/api/weapon-maintenance', id, data),
  delete: (id: number) => remove('/api/weapon-maintenance', id),
};

export const ammunitionApi = {
  getAll: () => getAll<Ammunition>('/api/ammunition'),
  getById: (id: number) => getById<Ammunition>('/api/ammunition', id),
  create: (data: Ammunition) => create<Ammunition>('/api/ammunition', data),
  update: (id: number, data: Ammunition) => update<Ammunition>('/api/ammunition', id, data),
  delete: (id: number) => remove('/api/ammunition', id),
}; 