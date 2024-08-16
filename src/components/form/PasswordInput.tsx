import { useState } from 'react';
import { FormControl, TextField, InputAdornment, IconButton } from '@mui/material';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
function SearchOutLine({ value, setValue }: { value: any; setValue: (value: string) => void }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl fullWidth>
      <TextField
        value={value}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                edge="end"
                color="secondary"
              >
                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </FormControl>
  );
}

export default SearchOutLine;
