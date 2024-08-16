import { useEffect, useState } from 'react';
import useConfig from '@hooks/useConfig';
import usePage from '@hooks/usePage';
import { ThemeMode } from '@type/config';
import { apiChartOnline } from '@api/ChartOnline';
// material-ui
import { Box, useMediaQuery } from '@mui/material';
// third-party
import dayjs from 'dayjs';
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';

// chart options
const barChartOptions = {
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    labels: {
      rotate: -45,
      rotateAlways: true,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  grid: {
    show: false,
  },
};

// ==============================|| MONTHLY BAR CHART ||============================== //

const MonthlyBarChart = () => {
  const { t, theme, fcShowMsg } = usePage();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const { mode } = useConfig();
  const { primary, secondary } = theme.palette.text;
  const info = theme.palette.info.light;
  const [timeCount, setTimeCount] = useState(0);
  const [xaxis, setXaxis] = useState<string[]>([]);
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
    {
      name: '',
      data: [],
    },
  ]);

  const [options, setOptions] = useState<ChartProps>(barChartOptions);

  const fcGhartOnline = async () => {
    try {
      const { data } = await apiChartOnline({
        page: 1,
        per_page: 100,
        per: 10,
        minute_time1: dayjs()
          .subtract(matchesXs ? 1 : 3, 'hour')
          .startOf('hour')
          .format('YYYY-MM-DD HH:mm:ss'),
        minute_time2: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      setXaxis([]);
      const xaxis: string[] = [];
      const series: number[] = [];
      data.map((item: any) => {
        xaxis.push(dayjs(item.minute_time).format('HH:mm'));
        series.push(item.count);
      });
      setXaxis(xaxis);
      setSeries([{ name: t('sys.count'), data: series }]);
    } catch (error: any) {
      throw error;
    }
  };

  useEffect(() => {
    fcGhartOnline();
    const interval = setInterval(() => {
      setTimeCount((prevStatus) => prevStatus + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 每10分鐘同步一次
    if (timeCount % 300 === 0 && timeCount > 0) {
      fcGhartOnline();
    }
  }, [timeCount]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [info],
      xaxis: {
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary],
          },
        },
        categories: xaxis,
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light',
      },
    }));
  }, [mode, primary, info, secondary, xaxis, series]);

  return (
    <Box sx={{ bgcolor: 'transparent' }}>
      <ReactApexChart options={options} series={series} type="bar" height={365} />
    </Box>
  );
};

export default MonthlyBarChart;
