import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { FormControl, FormHelperText } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRange } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import {
  PickersShortcutsItem,
  PickerShortcutChangeImportance,
} from '@mui/x-date-pickers/PickersShortcuts';
import { CalendarOutlined } from '@ant-design/icons';
import { useSelector } from '@store/index';
import { useTranslation } from 'react-i18next';
import { getDateRange, dayType } from '@utils/date';

function SearchDatePicker({
  placeholder,
  start,
  end,
  startKey,
  endKey,
  errors,
  setValue,
}: {
  placeholder: string;
  start: string;
  end: string;
  startKey: string;
  endKey: string;
  errors: any;
  setValue: (key: string, value: string) => void;
}) {
  const { t } = useTranslation();
  const [changeImportance, setChangeImportance] =
    useState<PickerShortcutChangeImportance>('accept');
  const [dateValue, setdateValue] = useState<DateRange<Dayjs>>([dayjs(start), dayjs(end)]);
  const globalState = useSelector((state) => state.global);
  const { sysTime } = globalState;
  const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
    'today',
    'yesterday',
    'thisWeek',
    'lastWeek',
    'pass7Days',
    'thisMonth',
    'lastMonth',
  ].map((type: string) => ({
    label: t(`cp.${type}`),
    getValue: () => {
      const date = getDateRange(sysTime, type as dayType);
      return [date[0], date[1]];
    },
  }));

  useEffect(() => {
    if (start === '' || end === '') {
      return;
    }
    setdateValue([dayjs(start), dayjs(end)]);
  }, [start, end]);

  useEffect(() => {
    if (dateValue[0]?.isValid() === false && dateValue[1]?.isValid() === false) return;
    if (dateValue[0] === null) return;
    setValue(startKey, dateValue[0]!.format('YYYY-MM-DD'));
    // console.log('start', dateValue[0]!.format('YYYY-MM-DD'));
    if (dateValue[1] === null) return;
    setValue(endKey, dateValue[1]!.format('YYYY-MM-DD'));
    // console.log('end', dateValue[0]!.format('YYYY-MM-DD'));
  }, [dateValue]);

  return (
    <FormControl fullWidth>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {sysTime && (
          <DateRangePicker
            value={dateValue}
            onChange={(newValue) => {
              setdateValue(newValue);
            }}
            slots={{ field: SingleInputDateRangeField }}
            slotProps={{
              shortcuts: {
                items: shortcutsItems,
                changeImportance,
              },
              textField: {
                sx: { cursor: 'pointer' },
                variant: 'outlined',
                InputProps: {
                  endAdornment: <CalendarOutlined />,
                },
                error: false,
              },
            }}
          />
        )}
      </LocalizationProvider>
      {Boolean(errors) && <FormHelperText error>{errors}</FormHelperText>}
    </FormControl>
  );
}
export default SearchDatePicker;
