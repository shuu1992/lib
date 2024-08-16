import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyrightOutlined } from '@ant-design/icons';
import { FormControl, Select, MenuItem, FormHelperText } from '@mui/material';
import Club from '@components/@svgIcon/Club';
import Diamond from '@components/@svgIcon/Diamond';
import Heart from '@components/@svgIcon/Heart';
import Spade from '@components/@svgIcon/Spade';
function SearchSelect({
  disabled,
  value,
  errors,
}: {
  disabled?: boolean;
  value?: any;
  errors?: any;
}) {
  const { t } = useTranslation();
  const [pokerCardList, setPokerCardList] = useState<
    {
      icon: React.ReactNode;
      text: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    const ary = [];
    for (let i = 1; i <= 52; i++) {
      ary.push({
        icon: <Spade style={{ width: '15px', height: '15px', fill: 'green' }} />,
        text: i.toString(),
        value: i.toString(),
      });
      setPokerCardList(ary);
    }
  }, []);

  return (
    <FormControl fullWidth>
      <Select
        value={value}
        displayEmpty
        inputProps={{ readOnly: disabled }}
        sx={{
          '& .MuiSelect-iconOutlined': { display: disabled ? 'none' : '' },
        }}
      >
        <MenuItem value="">{t('sys.plzSelect')}</MenuItem>
        {pokerCardList.map(({ icon, text, value }) => (
          <MenuItem key={value} value={value}>
            {icon}
            <span style={{ marginLeft: '1rem' }}>{text}</span>
          </MenuItem>
        ))}
      </Select>
      {Boolean(errors) && <FormHelperText error>{errors}</FormHelperText>}
    </FormControl>
  );
}

export default SearchSelect;
