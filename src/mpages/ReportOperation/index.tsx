import { useState, useEffect } from 'react';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import dayjs from 'dayjs';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Breadcrumbs, Link } from '@mui/material';
// ant-design
import { HomeOutlined } from '@ant-design/icons';
// custom Components
import { getDateRange } from '@utils/date';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Operation from './feature/Operation';
import Room from './feature/Room';
import User from './feature/User';
import Bet from './feature/Bet';

export type StepType = 'operation' | 'room' | 'user' | 'bet'; // operation: 營運報表 room: 房間報表 user: 會員報表 bet: 投注報表
export interface ParentSearchType {
  room_id: string;
  room_type: string;
  username: string;
  report_date1: string;
  report_date2: string;
}

export interface ReportTabProps {
  parentSearch: ParentSearchType;
  setStep: (step: StepType) => void;
  setParentSearch: (cb: (value: ParentSearchType) => ParentSearchType) => void;
}

const ReportOperation = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const { t } = usePage();
  const { sysTime } = globalState;
  const [step, setStep] = useState('operation');
  const [parentSearch, setParentSearch] = useState<ParentSearchType>({
    room_id: '',
    room_type: '',
    username: '',
    report_date1: getDateRange(sysTime, 'thisWeek')[0].format('YYYY-MM-DD HH:mm:ss'),
    report_date2: getDateRange(sysTime, 'thisWeek')[1].format('YYYY-MM-DD HH:mm:ss'),
  }); // 父層搜尋條件
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['operation', 'room', 'user', 'bet']); // 麵包屑

  return (
    <Grid sx={{ mt: 2 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        {breadcrumbs.map((item, index) => {
          if (breadcrumbs.indexOf(step) >= index) {
            const txtColor = step === item ? 'primary' : 'textSecondary';
            return (
              <Link
                color={txtColor}
                key={`breadcrumbs${index}`}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  if (item === 'operation') {
                    setParentSearch((prevState) => ({
                      ...prevState,
                      room_id: '',
                      username: '',
                      report_date1: dayjs(sysTime)
                        .startOf('week')
                        .add(1, 'day')
                        .format('YYYY-MM-DD'),
                      report_date2: dayjs(sysTime).endOf('week').add(1, 'day').format('YYYY-MM-DD'),
                    }));
                  }
                  setStep(item);
                }}
              >
                {item === 'operation' ? (
                  <HomeOutlined />
                ) : (
                  <div>{t(`reportOperation.${item}`)}</div>
                )}
              </Link>
            );
          }
        })}
      </Breadcrumbs>
      <Grid sx={{ mt: 2 }}>
        {step === 'operation' && (
          <Operation
            parentSearch={parentSearch}
            setStep={setStep}
            setParentSearch={setParentSearch}
          />
        )}
        {step === 'room' && (
          <Room parentSearch={parentSearch} setStep={setStep} setParentSearch={setParentSearch} />
        )}
        {step === 'user' && (
          <User parentSearch={parentSearch} setStep={setStep} setParentSearch={setParentSearch} />
        )}
        {step === 'bet' && (
          <Bet parentSearch={parentSearch} setStep={setStep} setParentSearch={setParentSearch} />
        )}
      </Grid>
    </Grid>
  );
};

export default withPageHoc(ReportOperation);
