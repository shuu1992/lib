import { useEffect, useState } from 'react';
import {
  FormControl,
  OutlinedInput,
  Select,
  InputLabel,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { DownOutlined } from '@ant-design/icons';
import { TbSelectProps } from '@type/page';
function SearchSelect({
  placeholder,
  options,
  value,
  setValue,
}: {
  placeholder: string;
  options: TbSelectProps[];
  value: any;
  setValue: (value: string) => void;
}) {
  return (
    <FormControl fullWidth>
      <InputLabel>{placeholder}</InputLabel>
      <Select
        value={value}
        sx={{
          '&.Mui-focused .MuiIconButton-root': { color: 'primary.main' },
        }}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      >
        {options.map(({ text, value }) => (
          <MenuItem key={value} value={value.toString()}>
            {text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SearchSelect;
