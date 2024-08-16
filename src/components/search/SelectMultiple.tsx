import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  OutlinedInput,
  Select,
  InputLabel,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import { CloseOutlined } from '@ant-design/icons';
import { TbSelectProps } from '@type/page';
import Checkbox from '@mui/material/Checkbox';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function MultipleSearchSelect({
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
  const { t } = useTranslation();
  const [selectValue, setSelectValue] = useState<string[]>([]);
  useEffect(() => {
    if (value.length === 0) {
      setSelectValue([]);
      return;
    }
    setSelectValue(value.split(','));
  }, [value]);

  return (
    <FormControl fullWidth>
      <InputLabel>{placeholder}</InputLabel>
      <Select
        multiple
        readOnly={disabled}
        value={selectValue}
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
          setSelectValue(e.target.value as string[]);
          setValue(e.target.value.toString());
        }}
        renderValue={(selected: string[]) => {
          let valueTxt = '';
          if (selected.length === 0) return t('sys.plzSelect');

          selected.map((item: string) => {
            options.map((option) => {
              if (option.value === item) {
                valueTxt += `${option.text} ,`;
              }
            });
          });
          return valueTxt;
        }}
        MenuProps={MenuProps}
      >
        {options.map((option) => (
          <MenuItem key={option.text} value={option.value}>
            <Checkbox checked={value.indexOf(option.value) > -1} />
            <ListItemText primary={option.text} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MultipleSearchSelect;
