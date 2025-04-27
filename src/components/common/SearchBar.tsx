import React, { useState } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Box, 
  useTheme, 
  alpha,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search...', 
  initialValue = ''
}) => {
  const [query, setQuery] = useState(initialValue);
  const theme = useTheme();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearchSubmit}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 500,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon color="primary" />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        value={query}
        onChange={handleSearchChange}
      />
      {query && (
        <>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton 
            sx={{ p: '10px' }} 
            aria-label="clear search" 
            onClick={handleClear}
          >
            <ClearIcon />
          </IconButton>
        </>
      )}
    </Paper>
  );
};

export default SearchBar; 