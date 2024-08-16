import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, Select, MenuItem, FormHelperText } from '@mui/material';
function SearchSelect({
  disabled = false,
  options,
  value,
  errors,
  setValue,
}: {
  disabled?: boolean;
  options: { text: string; value: string }[];
  value: any;
  errors?: any;
  setValue: (value: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <FormControl fullWidth>
      <Select
        value={value}
        displayEmpty
        onChange={(e) => {
          setValue(e.target.value);
        }}
        inputProps={{ readOnly: disabled }}
        sx={{
          '& .MuiSelect-iconOutlined': { display: disabled ? 'none' : '' },
        }}
      >
        <MenuItem value="">{t('sys.plzSelect')}</MenuItem>
        {options.map(({ text, value }) => (
          <MenuItem key={value} value={value}>
            {text}
          </MenuItem>
        ))}
      </Select>
      {Boolean(errors) && <FormHelperText error>{errors}</FormHelperText>}
    </FormControl>
  );
}

export default SearchSelect;
