import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import useConfig from '@hooks/useConfig';
import usePage from '@hooks/usePage';
import { ThemeMode } from '@type/config';
import { apiChartOnline } from '@api/ChartOnline';
import { IChartOnline } from '@api/ChartOnline/req';
import { IResChartOnline } from '@api/ChartOnline/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Button } from '@mui/material';
// custom Components
import dayjs from 'dayjs';
import SelectOutline from '@components/search/SelectOutline';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import ReactApexChart, { Props as AreaProps } from 'react-apexcharts';
const barChartOptions = {
  chart: {
    type: 'area',
    stacked: false,
    height: 500,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true,
    },
    toolbar: {
      tools: {
        download: false,
        pan: false,
      },
      autoSelected: 'zoom',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  xaxis: {
    labels: {
      rotate: -45,
      rotateAlways: true,
      show: true,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: true,
  },
};
const ChartOnline = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
  const {
    theme,
    menuState,
    globalState,
    dataList,
    setDataList,
    loadingFlag,
    setLoadingFlag,
    pgCfg,
    setPgCfg,
    tSearchCfg,
    setTSearchCfg,
    editLoading,
    setEditLoading,
  } = pageHocProps;
  const { mode } = useConfig();
  const { t } = usePage();
  const { allPermission } = menuState;
  const { sysTime } = globalState;
  //refer list
  const [perList, setPerList] = useState<TbSelectProps[]>([]);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    per: '60',
    minute_time1: dayjs(sysTime).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    minute_time2: dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss'),
  });
  const { primary, secondary } = theme.palette.text;
  const [options, setOptions] = useState<AreaProps>(barChartOptions);
  const info = theme.palette.info.light;
  const [xaxis, setXaxis] = useState<string[]>([]);
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
    {
      name: '',
      data: [],
    },
  ]);

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, refer, meta } = await apiChartOnline({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      const perList: TbSelectProps[] = Object.entries(refer.per).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      //Search Cfg
      setPerList(perList);
      setXaxis([]);
      const xaxis: string[] = [];
      const series: number[] = [];
      data.map((item: any) => {
        xaxis.push(dayjs(item.minute_time).format('HH:mm'));
        series.push(item.count);
      });
      setXaxis(xaxis);
      setSeries([{ name: t('sys.count'), data: series }]);
      setLoadingFlag(false);
    } catch (error: any) {
      setLoadingFlag(false);
      throw error;
    }
  };

  useEffect(() => {
    fcGetList({
      ...pgCfg,
      searchCfg: { ...searchCfg },
    });
  }, []);

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
    <Grid container xs={12} spacing={2} mt={2}>
      <Grid xs={12} md={2.5}>
        <SelectOutline
          placeholder={t('report.room')}
          options={perList}
          value={searchCfg.per || ''}
          setValue={(value: string) => {
            setSearchCfg((prevState) => ({
              ...prevState,
              per: value,
            }));
          }}
        />
      </Grid>
      <Grid xs={12} md={5}>
        <SearchDateTimeRgPicker
          start={searchCfg.minute_time1 || ''}
          end={searchCfg.minute_time2 || ''}
          startKey={'minute_time1'}
          endKey={'minute_time2'}
          setValue={(key: string, value: string) => {
            setSearchCfg((prevState) => ({
              ...prevState,
              [key]: value,
            }));
          }}
        />
      </Grid>
      <Grid xs={12} md={1}>
        <Button
          variant="contained"
          fullWidth
          onClick={async () => {
            // 比對是否超過60個兼具
            // const totalMinutes = dayjs(searchCfg.minute_time2).diff(
            //   dayjs(searchCfg.minute_time1),
            //   'minute',
            // );
            // const betTime = Math.floor(totalMinutes / parseInt(searchCfg.per));
            // if (betTime > 60) {
            //   fcShowMsg({
            //     type: 'error',
            //     msg: '超過搜尋條件，請重新選擇搜尋條件',
            //   });
            //   return;
            // }
            if (pgCfg.pageIndex > 0) {
              await setPgCfg((prevState: PgCfgProps) => ({
                ...prevState,
                pageIndex: 0,
              }));
              return;
            }
            await fcGetList({
              ...pgCfg,
              searchCfg: { ...searchCfg, ...tSearchCfg },
            });
          }}
        >
          {t('sys.search')}
        </Button>
      </Grid>
      <Grid xs={12}>
        <Box sx={{ bgcolor: 'transparent' }}>
          <ReactApexChart options={options} series={series} height={barChartOptions.chart.height} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default withPageHoc(ChartOnline);
