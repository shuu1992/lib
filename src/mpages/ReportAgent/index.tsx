import { useState, useEffect, useMemo } from 'react';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import useAuth from '@hooks/useAuth';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button } from '@mui/material';
//Custom Components
import { getDateRange } from '@utils/date';
import SelectOutline from '@components/search/SelectOutline';
import SearchDateReportPicker from '@components/search/DateReportPicker';
import Home from './Home';
import Sub from './Sub';

export type StepType = 'home' | 'sub';

export interface ParentSearchType {
  pid: string;
  room_id: string;
  report_time1: string;
  report_time2: string;
  forceUpdate: number;
}

export interface ParentSearchProps {
  parentSearch: ParentSearchType;
  roomList: TbSelectProps[];
  setStep: (step: StepType) => void;
  setParentSearch: (cb: (value: ParentSearchType) => ParentSearchType) => void;
  setRoomList: (option: TbSelectProps[]) => void;
}

const ReportAgent = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const { sysTime } = globalState;
  const { authState } = useAuth();
  const { t } = usePage();
  const [step, setStep] = useState('home'); // home: 首頁, sub: 子頁面
  const [parentSearch, setParentSearch] = useState<ParentSearchType>({
    pid: '',
    room_id: '',
    report_time1: getDateRange(sysTime, 'thisWeek')[0].format('YYYY-MM-DD HH:mm:ss'),
    report_time2: getDateRange(sysTime, 'thisWeek')[1].format('YYYY-MM-DD HH:mm:ss'),
    forceUpdate: 0,
  }); // 父層搜尋條件
  const [roomList, setRoomList] = useState<TbSelectProps[]>([]);

  useEffect(() => {
    setParentSearch((prevState) => ({
      ...prevState,
      forceUpdate: 0,
    }));
  }, [step]);

  useEffect(() => {
    setParentSearch((prevState) => ({
      ...prevState,
      report_time1: getDateRange(sysTime, 'thisWeek')[0].format('YYYY-MM-DD HH:mm:ss'),
      report_time2: getDateRange(sysTime, 'thisWeek')[1].format('YYYY-MM-DD HH:mm:ss'),
    }));
    if (authState.user?.backstage === 2) {
      setStep('sub');
    } else {
      setStep('home');
    }
  }, []);

  const shortcutsItemList = useMemo(() => {
    // money_type // 1:現金 2:信用 信用版顯示信用版月算法
    return authState.user?.money_type === 2
      ? [
          'today',
          'yesterday',
          'thisWeek',
          'lastWeek',
          'pass7Days',
          'creditThisMonth',
          'creditLastMonth',
        ]
      : ['today', 'yesterday', 'thisWeek', 'lastWeek', 'pass7Days', 'thisMonth', 'lastMonth'];
  }, [authState.user?.money_type]);

  return (
    <div>
      <Grid container xs={12} spacing={2.5} mb={2}>
        <Grid xs={12} md={2}>
          <SelectOutline
            placeholder={t('report.room')}
            options={roomList}
            value={parentSearch.room_id || ''}
            setValue={(value: string) => {
              setParentSearch((prevState) => ({
                ...prevState,
                room_id: value,
              }));
            }}
          />
        </Grid>
        <Grid xs={12} md={5}>
          <SearchDateReportPicker
            views={['year', 'month', 'day', 'hours']}
            start={parentSearch.report_time1 || ''}
            end={parentSearch.report_time2 || ''}
            startKey={'report_time1'}
            endKey={'report_time2'}
            setValue={(key: string, value: string) => {
              setParentSearch((prevState) => ({
                ...prevState,
                [key]: value,
              }));
            }}
            shortcutsItemList={shortcutsItemList}
          />
        </Grid>
        <Grid xs={12} md={1}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setParentSearch((prevState) => ({
                ...prevState,
                forceUpdate: prevState.forceUpdate + 1,
              }));
            }}
          >
            {t('sys.search')}
          </Button>
        </Grid>
        <Grid my={2}>
          {t('sys.timeRange')}
          {parentSearch.report_time1}&nbsp; - &nbsp;
          {parentSearch.report_time2}
        </Grid>
      </Grid>
      {step === 'home' && authState.user?.backstage !== 2 && (
        <Home
          setStep={setStep}
          parentSearch={parentSearch}
          setParentSearch={setParentSearch}
          roomList={roomList}
          setRoomList={setRoomList}
        />
      )}
      {step === 'sub' && (
        <Sub
          setStep={setStep}
          parentSearch={parentSearch}
          setParentSearch={setParentSearch}
          roomList={roomList}
          setRoomList={setRoomList}
        />
      )}
    </div>
  );
};

export default withPageHoc(ReportAgent);
