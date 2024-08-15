import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@i18n/index';
import { getDateRange } from '@utils/date';
// material-ue
import { FormControl, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CustomizedDateTimePicker from '../dateTimePicker';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
// custom
import { isMobile } from 'react-device-detect';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';

export function SearchDateTimeRangePicker({
  showShortcutsItems = true,
  views = ['year', 'month', 'day', 'hours', 'minutes', 'seconds'],
  format = 'YYYY-MM-DD HH:mm:ss',
  placeholderI18nKey,
  start,
  end,
  startKey,
  endKey,
  setValue,
  sysTime = dayjs().format('YYYY-MM-DD HH:mm:ss'),
}: {
  showShortcutsItems?: boolean;
  views?: ('hours' | 'minutes' | 'month' | 'day' | 'seconds' | 'year')[];
  format?: string;
  placeholderI18nKey?: string;
  start: string;
  end: string;
  startKey: string;
  endKey: string;
  setValue: (key: string, value: string) => void;
  sysTime: string;
}) {
  const { t } = useTranslation();
  // const globalState = useSelector((state) => state.global);
  // const { sysTime } = globalState;
  const [lang, setLang] = useState<string | undefined>(i18n.resolvedLanguage);
  const [startValue, setstartValue] = useState<Dayjs | null>(null);
  const [endValue, setendValue] = useState<Dayjs | null>(null);
  const shortcutsItems = useMemo(
    () => [
      {
        label: t('cp.today'),
        getValue: () => {
          const dateRange = getDateRange(sysTime, 'today');
          setstartValue(dateRange[0]);
          setendValue(dateRange[1]);
        },
      },
      {
        label: t('cp.yesterday'),
        getValue: () => {
          const dateRange = getDateRange(sysTime, 'yesterday');
          setstartValue(dateRange[0]);
          setendValue(dateRange[1]);
        },
      },
      {
        label: t('cp.thisWeek'),
        getValue: () => {
          const dateRange = getDateRange(sysTime, 'thisWeek');
          setstartValue(dateRange[0]);
          setendValue(dateRange[1]);
        },
      },
      {
        label: t('cp.lastWeek'),
        getValue: () => {
          const dateRange = getDateRange(sysTime, 'lastWeek');
          setstartValue(dateRange[0]);
          setendValue(dateRange[1]);
        },
      },
      {
        label: t('cp.pass7Days'),
        getValue: () => {
          const dateRange = getDateRange(sysTime, 'pass7Days');
          setstartValue(dateRange[0]);
          setendValue(dateRange[1]);
        },
      },
    ],
    [t, sysTime],
  );

  useEffect(() => {
    if (dayjs(start).isValid()) {
      setstartValue(dayjs(start));
    }
    if (dayjs(end).isValid()) {
      setendValue(dayjs(end));
    }
  }, []);

  useEffect(() => {
    // if (startValue === null || endValue === null) return;
    if (dayjs(startValue).isValid() === false) {
      setValue(startKey, '');
    }
    if (dayjs(endValue).isValid() === false) {
      setValue(endKey, '');
    }
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
        maxDate={dayjs()}
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
    <FormControl fullWidth>
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
      {showShortcutsItems && (
        <Grid container sx={{ ml: 0.5 }}>
          {shortcutsItems.map((item, index) => {
            return (
              <Button
                key={`dateTime${index}`}
                variant="outlined"
                sx={{ mt: 1, mr: isMobile ? 0.5 : 2 }}
                onClick={() => {
                  item.getValue();
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Grid>
      )}
    </FormControl>
  );
}
