import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  TableSortLabel,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { SortConfig, SortOrder } from '../../types';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  totalCount?: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onSort?: (sortConfig: SortConfig) => void;
  sortConfig?: SortConfig;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  disableActions?: boolean;
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
}));

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  sortConfig,
  onEdit,
  onDelete,
  onView,
  disableActions = false,
}) => {
  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    onPageChange(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const createSortHandler = (columnId: string) => () => {
    if (!onSort) return;

    const isAsc = sortConfig?.key === columnId && sortConfig.direction === 'asc';
    const newDirection: SortOrder = isAsc ? 'desc' : 'asc';
    
    onSort({
      key: columnId,
      direction: newDirection,
    });
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth, fontWeight: 600 }}
                >
                  {column.sortable && onSort ? (
                    <TableSortLabel
                      active={sortConfig?.key === column.id}
                      direction={sortConfig?.key === column.id ? sortConfig.direction : 'asc'}
                      onClick={createSortHandler(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {!disableActions && (onEdit || onDelete || onView) && (
                <TableCell align="center" style={{ minWidth: 120 }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <StyledTableRow hover tabIndex={-1} key={row.id}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format ? column.format(value) : value}
                    </TableCell>
                  );
                })}
                {!disableActions && (onEdit || onDelete || onView) && (
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      {onView && (
                        <Tooltip title="View details">
                          <ActionButton
                            aria-label="view"
                            color="primary"
                            onClick={() => onView(row.id)}
                            size="small"
                          >
                            <VisibilityIcon fontSize="small" />
                          </ActionButton>
                        </Tooltip>
                      )}
                      {onEdit && (
                        <Tooltip title="Edit">
                          <ActionButton
                            aria-label="edit"
                            color="primary"
                            onClick={() => onEdit(row.id)}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </ActionButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Delete">
                          <ActionButton
                            aria-label="delete"
                            color="error"
                            onClick={() => onDelete(row.id)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </ActionButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                )}
              </StyledTableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + (disableActions ? 0 : (onEdit || onDelete || onView ? 1 : 0))
                  }
                  align="center"
                  sx={{ py: 3 }}
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount ?? data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Paper>
  );
};

export default DataTable; 