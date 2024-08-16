import { useState } from 'react';
import { FormControl, TextField, InputAdornment, IconButton } from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
function SearchOutLine({
  placeholder,
  value,
  type,
  setValue,
}: {
  placeholder: string;
  value: any;
  type?: string;
  setValue: (value: string) => void;
}) {
  return (
    <FormControl fullWidth>
      <TextField
        value={value}
        label={placeholder}
        InputProps={{
          type: type,
          endAdornment:
            value !== '' ? (
              <InputAdornment position="end">
                <IconButton aria-label="delete" edge="end" onClick={() => setValue('')}>
                  <CloseOutlined />
                </IconButton>
              </InputAdornment>
            ) : null,
        }}
        onChange={(e) => {
          setValue(e.target.value.trim());
        }}
      />
    </FormControl>
  );
}

export default SearchOutLine;
