import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@i18n/index';
import { useSelector } from '@store/index';
import { getDateRange } from '@utils/date';
// material-ue
import { FormControl, FormHelperText } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CustomizedDateTimePicker from '@components/dateTimePicker';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
// custom
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';

function SearchDateTimeRangePicker({
  views = ['year', 'month', 'day', 'hours', 'minutes', 'seconds'],
  format = 'YYYY-MM-DD HH:mm:ss',
  placeholderI18nKey,
  start,
  end,
  startKey,
  endKey,
  errors,
  setValue,
}: {
  views?: ('hours' | 'minutes' | 'month' | 'day' | 'seconds' | 'year')[];
  format?: string;
  placeholderI18nKey?: string;
  start: string;
  end: string;
  startKey: string;
  endKey: string;
  errors: any;
  setValue: (key: string, value: string) => void;
}) {
  const { t } = useTranslation();
  const globalState = useSelector((state) => state.global);
  const { sysTime } = globalState;
  const [lang, setLang] = useState<string | undefined>(i18n.resolvedLanguage);
  const [startValue, setstartValue] = useState<Dayjs | null>(null);
  const [endValue, setendValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (start === '' || end === '') {
      return;
    }
    setstartValue(dayjs(start));
    setendValue(dayjs(end));
  }, [start, end]);

  useEffect(() => {
    if (dayjs(startValue).isValid() && dayjs(endValue).isValid()) {
      setValue(startKey, dayjs(startValue).format('YYYY-MM-DD HH:mm:ss'));
      setValue(endKey, dayjs(endValue).format('YYYY-MM-DD HH:mm:ss'));
    }
  }, [startValue, endValue]);

  useEffect(() => {
    switch (i18n.resolvedLanguage) {
      case 'en':
        setLang('en');
        break;
      case 'vi':
        setLang('vi');
        break;
      default:
        setLang('zh-tw');
        break;
    }
  }, [i18n.resolvedLanguage]);

  const MemoizedCustomizedDateTimePicker = React.memo(CustomizedDateTimePicker);

  const handleStartChange = useCallback(
    (newValue: Dayjs | null) => {
      setstartValue(newValue);
    },
    [setstartValue],
  );

  const handleEndChange = useCallback(
    (newValue: Dayjs | null) => {
      setendValue(newValue);
    },
    [setendValue],
  );
  const startComp = useCallback(() => {
    return (
      <MemoizedCustomizedDateTimePicker
        label={placeholderI18nKey ? `${t(placeholderI18nKey)}-${t('sys.start')}` : t('sys.start')}
        views={views}
        format={format}
        value={startValue}
        onChange={handleStartChange}
      />
    );
  }, [startValue, endValue, handleStartChange]);
  const endComp = useCallback(() => {
    return (
      <MemoizedCustomizedDateTimePicker
        label={placeholderI18nKey ? `${t(placeholderI18nKey)}-${t('sys.end')}` : t('sys.end')}
        views={views}
        format={format}
        minDate={startValue}
        value={endValue}
        onChange={handleEndChange}
      />
    );
  }, [startValue, endValue, handleEndChange]);

  return (
    <FormControl fullWidth sx={{ marginTop: '0.5rem' }}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={lang}
        localeText={{ okButtonLabel: t('sys.confirm'), cancelButtonLabel: t('sys.cancel') }}
      >
        <MultiInputDateTimeRangeField
          slotProps={{
            textField: ({ position }) => ({
              component: position === 'start' ? startComp : endComp,
            }),
          }}
        />
      </LocalizationProvider>
      {Boolean(errors) && <FormHelperText error>{errors}</FormHelperText>}
    </FormControl>
  );
}

export default SearchDateTimeRangePicker;
