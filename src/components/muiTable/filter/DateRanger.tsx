import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@i18n/index';
import { useSelector } from '@store/index';
import { getDateRange, dayType } from '@utils/date';
// material-ui
import { FormControl } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRange } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
// ant-design
import { CalendarOutlined, CloseOutlined } from '@ant-design/icons';
// custom
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/zh-tw';

// 未來優化
//https://github.com/mui/mui-x/issues/5368
function TFilterDatePicker({
  column,
  defaultType = 'null',
}: {
  column: any;
  defaultType?: dayType;
}) {
  const { t } = useTranslation();
  const globalState = useSelector((state) => state.global);
  const { sysTime } = globalState;
  const [lang, setLang] = useState<string | undefined>(i18n.resolvedLanguage);
  const [dateValue, setdateValue] = useState<DateRange<Dayjs>>([dayjs(''), dayjs('')]);
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
  const fcSetValues = (dateAry: Dayjs[] | null) => {
    if (!dateAry) return;
    const formatValue = [
      dayjs(dateAry[0]).format('YYYY-MM-DD'),
      dayjs(dateAry[1]).format('YYYY-MM-DD'),
    ];
    setdateValue([dateAry[0], dateAry[1]]);
    column.setFilterValue(formatValue);
  };
  // 更改格式
  const fcFormatValue = () => {
    const start = dayjs(dateValue[0]);
    const end = dayjs(dateValue[1]);
    if (!start.isValid() && !end.isValid()) return 'YYYY-MM-DD / YYYY-MM-DD';
    if (start.isValid() && !end.isValid()) return `${start.format('YYYY-MM-DD')} / YYYY-MM-DD`;
    if (!start.isValid() && end.isValid()) return `YYYY-MM-DD / ${end.format('YYYY-MM-DD')}`;
    return `${start.format('YYYY-MM-DD')} / ${end.format('YYYY-MM-DD')}`;
  };
  // 初始帶日期
  useEffect(() => {
    if (column.getFilterValue() !== undefined) {
      const dateAry = column.getFilterValue().map((date: string) => dayjs(date));
      fcSetValues(dateAry);
      return;
    }
    if (defaultType === 'null') return;
    const dateAry = getDateRange(sysTime, defaultType);
    fcSetValues(dateAry);
  }, []);

  useEffect(() => {
    switch (i18n.resolvedLanguage) {
      case 'vi':
        setLang('vi');
        break;
      default:
        setLang('zh-tw');
        break;
    }
  }, [i18n.resolvedLanguage]);

  return (
    <FormControl fullWidth>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={lang}
        localeText={{ okButtonLabel: t('sys.confirm'), cancelButtonLabel: t('sys.cancel') }}
      >
        <DateRangePicker
          format="YYYY-MM-DD"
          value={dateValue}
          onChange={(newValue: any) => {
            fcSetValues(newValue);
          }}
          slots={{ field: SingleInputDateRangeField }}
          sx={{ margin: '0.5rem 0' }}
          slotProps={{
            shortcuts: {
              items: shortcutsItems,
            },
            textField: {
              InputProps: {
                sx: { cursor: 'pointer' },
                value: fcFormatValue(),
                endAdornment:
                  dayjs(dateValue[0]).isValid() && dayjs(dateValue[1]).isValid() ? (
                    <CloseOutlined
                      onClick={() => {
                        setdateValue([dayjs(''), dayjs('')]);
                        column.setFilterValue('');
                      }}
                    />
                  ) : (
                    <CalendarOutlined />
                  ),
              },
              error: false,
            },
          }}
        />
      </LocalizationProvider>
    </FormControl>
  );
}
export default TFilterDatePicker;
