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
import { CloseOutlined } from '@ant-design/icons';
import { TbSelectProps } from '@type/page';
function SearchSelect({
  disabled = false,
  placeholder,
  options,
  value,
  setValue,
}: {
  disabled?: boolean;
  placeholder: string;
  options: TbSelectProps[];
  value: any;
  setValue: (value: string) => void;
}) {
  return (
    <FormControl fullWidth>
      <InputLabel>{placeholder}</InputLabel>
      <Select
        readOnly={disabled}
        value={value}
        input={<OutlinedInput placeholder="Tag" />}
        variant="outlined"
        sx={{
          '& .MuiSelect-iconOutlined': { display: value ? 'none' : '' },
          '&.Mui-focused .MuiIconButton-root': { color: 'primary.main' },
        }}
        endAdornment={
          disabled === false &&
          value !== '' && (
            <InputAdornment position="end">
              <IconButton aria-label="delete" edge="end" onClick={() => setValue('')}>
                <CloseOutlined />
              </IconButton>
            </InputAdornment>
          )
        }
        onChange={(e) => {
          setValue(e.target.value);
        }}
      >
        {options.map(({ text, value }) => (
          <MenuItem key={`key${value}`} value={value.toString()}>
            {text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SearchSelect;
