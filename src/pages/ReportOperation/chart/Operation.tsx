import { useEffect, useState } from 'react';
import usePage from '@hooks/usePage';
import { useSelector } from '@store/index';
import { useTheme } from '@mui/material/styles';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { useModalWindow } from 'react-modal-global';
import { apiList } from '@api/ReportOperation';
import { IResInfo, IResFooter } from '@api/ReportOperation/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Checkbox, InputLabel, FormControlLabel, Tooltip } from '@mui/material';
// ant-design
import { SyncOutlined } from '@ant-design/icons';
// custom Components
import dayjs from 'dayjs';
import LoadingButton from '@components/@extended/LoadingButton';
import CustomizedDialog from '@components/dialog/FormDialog';
import ChartComp from '@components/chart/TabChart';

export default function Chart() {
  const { t } = usePage();
  const modal = useModalWindow();
  const theme = useTheme();
  const globalState = useSelector((state) => state.global);
  const { sysTime } = globalState;
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    type: '1',
  });
  const [loadingCfg, setLoadingCfg] = useState<boolean>(false);
  //儲存每個月資料
  const [databaseList, setDatabaseList] = useState<{
    [key: number]: {
      data: IResInfo[];
      footer: IResFooter;
    };
  }>({});
  //日期Type
  const [monthList, setMonthList] = useState<{ text: string; value: number; flag: boolean }[]>([]);
  //分析Type
  const [analyzeList, setAnalyzeList] = useState<{ text: string; value: string; flag: boolean }[]>(
    [],
  );
  //Bar圖表X軸
  const [barXAxis, setBarXAxis] = useState<{ scaleType: string; data: any[] }[]>([
    { scaleType: 'band', data: [] },
  ]);
  //Bar圖表資料
  const [barData, setBarData] = useState<any[]>([]);
  const fcCloseDialog = () => {
    modal.close();
  };
  async function fcGetList({
    searchListCfg,
  }: {
    searchListCfg: {
      month: number;
      report_date1: string;
      report_date2: string;
    };
  }) {
    setLoadingCfg(true);
    const { data, refer, footer } = await apiList({
      ...searchCfg,
      ...searchListCfg,
      page: 1,
      per_page: 100,
    });
    const barData: IResInfo[] = [];
    const barXAxis: number[] = [];
    for (let i = 0; i < 31; i++) {
      const dataDay = data.findIndex((item: IResInfo) => {
        return dayjs(item.report_date).get('date') === i + 1;
      });
      barXAxis.push(i + 1);
      if (dataDay !== -1) {
        barData.push(data[dataDay]);
      } else {
        barData.push({
          bet_count: 0,
          bet_real: 0,
          bet_total: 0,
          bet_user: 0,
          payoff: 0,
          payout: 0,
          rebate: 0,
          donate: 0,
          report_date: dayjs(searchListCfg.report_date1).add(i, 'day').format('YYYY-MM-DD'),
        });
      }
    }
    //Search Cfg
    setDatabaseList((prevState: any) => ({
      ...prevState,
      [searchListCfg.month]: {
        data: barData,
        footer: footer,
      },
    }));
    setBarXAxis([{ scaleType: 'band', data: barXAxis }]);
    fcGetanalyzeList(footer);
    setLoadingCfg(false);
  }
  function fcGetMonthList() {
    const nowMonth = dayjs().get('month') + 1;
    const arr = [];
    for (let i = nowMonth - 5; i <= nowMonth; i++) {
      const month =
        dayjs(sysTime)
          .set('month', i - 1)
          .month() + 1;
      const monthTxt = dayjs(sysTime)
        .set('month', i - 1)
        .format('YYYY-MM');
      arr.push({
        text: monthTxt,
        value: month,
        flag: false,
      });
      databaseList[month] = {
        data: [],
        footer: {
          bet_count: 0,
          bet_real: 0,
          bet_total: 0,
          bet_user: 0,
          payoff: 0,
          payout: 0,
          rebate: 0,
          donate: 0,
        },
      };
      fcGetList({
        searchListCfg: {
          month: month,
          report_date1: dayjs()
            .set('month', i - 1)
            .startOf('month')
            .format('YYYY-MM-DD'),
          report_date2: dayjs()
            .set('month', i - 1)
            .endOf('month')
            .format('YYYY-MM-DD'),
        },
      });
    }
    arr.sort((a, b) => {
      return b.value - a.value;
    });
    setMonthList(arr);
  }
  function fcGetanalyzeList(footerObj: IResFooter) {
    const arry = Object.entries(footerObj).map(([key], keyNum) => {
      return {
        text: `${t(`report.${key}`)}`,
        value: key,
        flag: keyNum === 0,
      };
    });
    setAnalyzeList(arry);
  }
  function fcChangeMonthList(value: number) {
    if (
      monthList.filter((item) => item.flag).length === 1 &&
      monthList.find((item) => item.value === value)?.flag
    ) {
      return;
    }
    const arr = monthList.map((item) => {
      if (item.value === value) {
        item.flag = !item.flag;
      }
      return item;
    });
    setMonthList(arr);
  }
  function fcChangeanalyzeList(value: string) {
    // 一定要有一個選項
    if (
      analyzeList.filter((item) => item.flag).length === 1 &&
      analyzeList.find((item) => item.value === value)?.flag
    ) {
      return;
    }
    const arr = analyzeList.map((item) => {
      if (item.value === value) {
        item.flag = !item.flag;
      } else {
        item.flag = false;
      }
      return item;
    });
    setAnalyzeList(arr);
  }
  function fcBarSetData(monthFlagAry: { text: string; value: number; flag: boolean }[]) {
    const analyzeType = analyzeList.find((item) => item.flag)?.value;
    const analyzeDataAry: any[] = [];
    if (analyzeType) {
      monthFlagAry.forEach((item) => {
        const data = databaseList[item.value].data;
        const obj = {
          label: `${item.text}`,
          month: item.value,
          data: [] as number[],
        };
        const arr = data.map((item: any) => {
          return item[analyzeType];
        });
        obj.data = arr;
        analyzeDataAry.push(obj);
      });
    }
    setBarData(analyzeDataAry);
  }
  async function fcRefresh() {
    await setBarData([]);
    await setBarXAxis([{ scaleType: 'band', data: [] }]);
    monthList.forEach((item) => {
      setDatabaseList((prevState: any) => ({
        ...prevState,
        [item.value]: {
          data: [],
          footer: [],
        },
      }));
    });
    await fcGetMonthList();
  }

  useEffect(() => {
    fcGetMonthList();
  }, []);

  useEffect(() => {
    if (monthList.length === 0) return;
    const monthFlagAry = monthList.filter((item) => item.flag);
    fcBarSetData(monthFlagAry);
  }, [monthList, analyzeList]);

  useEffect(() => {
    const checkDataDone = Object.values(databaseList).every((item) => item.data.length === 31);
    if (checkDataDone) {
      fcChangeMonthList(dayjs(sysTime).get('month') + 1);
    }
  }, [databaseList]);

  return (
    <CustomizedDialog
      flag={!modal.closed}
      title={t('sys.chart')}
      confirmCfg={{
        flag: false,
        txt: '',
        fcConfirm: async () => {
          return;
        },
      }}
      cancelCfg={{
        flag: true,
        txt: t('sys.close'),
      }}
      fcChangeDialog={fcCloseDialog}
    >
      <Grid container>
        <Grid xs={3}>
          <Tooltip
            title={t('sys.refresh')}
            onClick={() => {
              fcRefresh();
            }}
          >
            <LoadingButton loading={loadingCfg} shape="rounded" color="primary">
              <SyncOutlined spin={loadingCfg} twoToneColor={theme.palette.primary.main} />
            </LoadingButton>
          </Tooltip>
        </Grid>
      </Grid>
      <ChartComp
        chartTypeList={['bar', 'line']}
        barSeachComp={
          <Grid m={3} xs={12}>
            <Grid xs={12}>
              <InputLabel>日期:</InputLabel>
              {monthList.map(
                (item: { text: string; value: number; flag: boolean }, key: number) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        checked={item.flag}
                        name={item.text}
                        onClick={() => {
                          fcChangeMonthList(item.value);
                        }}
                      />
                    }
                    label={item.text}
                  />
                ),
              )}
            </Grid>
            <Grid xs={12}>
              <InputLabel sx={{ marginTop: '25px' }}>種類:</InputLabel>
              {analyzeList.map(
                (item: { text: string; value: string; flag: boolean }, key: number) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        checked={item.flag}
                        name={item.text}
                        onClick={() => {
                          fcChangeanalyzeList(item.value);
                        }}
                      />
                    }
                    label={item.text}
                  />
                ),
              )}
            </Grid>
          </Grid>
        }
        barData={{
          xAxis: barXAxis,
          series: barData.map((item) => ({
            label: item.label,
            data: item.data,
          })),
        }}
        lineSeachComp={
          <Grid m={3} xs={12}>
            <Grid xs={12}>
              <InputLabel>日期:</InputLabel>
              {monthList.map(
                (item: { text: string; value: number; flag: boolean }, key: number) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        checked={item.flag}
                        name={item.text}
                        onClick={() => {
                          fcChangeMonthList(item.value);
                        }}
                      />
                    }
                    label={item.text}
                  />
                ),
              )}
            </Grid>
            <Grid xs={12}>
              <InputLabel sx={{ marginTop: '25px' }}>種類:</InputLabel>
              {analyzeList.map(
                (item: { text: string; value: string; flag: boolean }, key: number) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        checked={item.flag}
                        name={item.text}
                        onClick={() => {
                          fcChangeanalyzeList(item.value);
                        }}
                      />
                    }
                    label={item.text}
                  />
                ),
              )}
            </Grid>
          </Grid>
        }
        lineData={{
          xAxis: barXAxis,
          series: barData.map((item) => ({
            label: item.label,
            data: item.data,
          })),
        }}
      />
    </CustomizedDialog>
  );
}
