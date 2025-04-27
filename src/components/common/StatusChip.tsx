import React from 'react';
import { Chip, ChipProps, useTheme } from '@mui/material';

interface StatusConfig {
  color: ChipProps['color'];
  backgroundColor?: string;
  borderColor?: string;
}

interface StatusMappings {
  [key: string]: StatusConfig;
}

// Weapon status
const weaponStatusMappings: StatusMappings = {
  'Available': { color: 'success' },
  'Assigned': { color: 'primary' },
  'Maintenance': { color: 'warning' },
  'Retired': { color: 'error' },
};

// Soldier status
const soldierStatusMappings: StatusMappings = {
  'Active': { color: 'success' },
  'Leave': { color: 'info' },
  'Training': { color: 'primary' },
  'Deployed': { color: 'secondary' },
  'Retired': { color: 'error' },
};

// WeaponAssignment status
const assignmentStatusMappings: StatusMappings = {
  'Active': { color: 'success' },
  'Returned': { color: 'info' },
  'Lost': { color: 'error' },
  'Damaged': { color: 'warning' },
};

// Storage Facility status
const facilityStatusMappings: StatusMappings = {
  'Operational': { color: 'success' },
  'Under Maintenance': { color: 'warning' },
  'Full': { color: 'secondary' },
  'Decommissioned': { color: 'error' },
};

// Maintenance status
const maintenanceStatusMappings: StatusMappings = {
  'Scheduled': { color: 'info' },
  'In Progress': { color: 'primary' },
  'Completed': { color: 'success' },
  'Cancelled': { color: 'error' },
};

// Ammunition status
const ammunitionStatusMappings: StatusMappings = {
  'Available': { color: 'success' },
  'Reserved': { color: 'primary' },
  'Depleted': { color: 'warning' },
  'Expired': { color: 'error' },
};

// All mappings in one object for easy access
const statusMappings = {
  weapon: weaponStatusMappings,
  soldier: soldierStatusMappings,
  assignment: assignmentStatusMappings,
  facility: facilityStatusMappings,
  maintenance: maintenanceStatusMappings,
  ammunition: ammunitionStatusMappings,
};

export type StatusType = 'weapon' | 'soldier' | 'assignment' | 'facility' | 'maintenance' | 'ammunition';

interface StatusChipProps {
  status: string;
  type: StatusType;
  size?: ChipProps['size'];
}

const StatusChip: React.FC<StatusChipProps> = ({ status, type, size = 'small' }) => {
  const theme = useTheme();
  
  const getStatusConfig = (statusValue: string, statusType: StatusType): StatusConfig => {
    const mappings = statusMappings[statusType];
    return mappings[statusValue] || { color: 'default' };
  };

  const config = getStatusConfig(status, type);

  return (
    <Chip
      label={status}
      size={size}
      color={config.color}
      sx={{
        fontWeight: 500,
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
      }}
    />
  );
};

export default StatusChip; 