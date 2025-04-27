import React from 'react';
import { Box, Button, Paper, Typography, useTheme, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface PageHeaderProps {
  title: string;
  onAdd?: () => void;
  buttonText?: string;
  showButton?: boolean;
  icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onAdd,
  buttonText = 'Add New',
  showButton = true,
  icon,
}) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: alpha(theme.palette.primary.light, 0.05),
        boxShadow: 'none',
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon && <Box sx={{ mr: 1, color: theme.palette.primary.main }}>{icon}</Box>}
        <Typography variant="h5" component="h1" color="primary.main" fontWeight="500">
          {title}
        </Typography>
      </Box>
      {showButton && onAdd && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          {buttonText}
        </Button>
      )}
    </Paper>
  );
};

export default PageHeader; 