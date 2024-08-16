import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ListItemText from '@mui/material/ListItemText';
import { FormControl, Select, MenuItem, FormHelperText } from '@mui/material';
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

function MultipleSelect({
  disabled,
  options,
  value,
  errors,
  setValue,
  isSelectAllEnabled = false,
}: {
  disabled?: boolean;
  options: { text: string; value: string }[];
  value: any; // 1,2,3
  errors: any;
  setValue: (value: string) => void;
  isSelectAllEnabled?: boolean;
}) {
  const { t } = useTranslation();
  const [selectValue, setSelectValue] = useState<string[]>([]);

  // 是否是全選（true無）
  const isAllSelected = useMemo(() => {
    return selectValue.length === options.length;
  }, [selectValue, options.length]);

  useEffect(() => {
    if (value.length === 0) return;
    setSelectValue(value.split(','));
  }, [value]);

  const handleSelectChange = (e: any) => {
    const selectedValues = e.target.value as string[];

    if (isSelectAllEnabled && selectedValues.includes('all')) {
      if (isAllSelected) {
        // 取消全選
        setSelectValue([]);
        setValue('');
      } else {
        // 全選
        const allValues = options.map((option) => option.value);
        setSelectValue(allValues);
        setValue(allValues.toString());
      }
    } else {
      //單選
      setSelectValue(selectedValues);
      setValue(selectedValues.toString());
    }
  };
  return (
    <FormControl fullWidth>
      <Select
        disabled={disabled}
        multiple
        displayEmpty
        value={selectValue}
        onChange={handleSelectChange}
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
        {isSelectAllEnabled && (
          <MenuItem key="all" value="all">
            <Checkbox checked={isAllSelected} />
            <ListItemText primary={t('sys.selectAll')} />
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.text} value={option.value}>
            <Checkbox checked={selectValue.indexOf(option.value) > -1} />
            <ListItemText primary={option.text} />
          </MenuItem>
        ))}
      </Select>
      {Boolean(errors) && <FormHelperText error>{errors}</FormHelperText>}
    </FormControl>
  );
}

export default MultipleSelect;
