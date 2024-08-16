import { useEffect, useState, useMemo, useCallback } from 'react';
import usePage from '@hooks/usePage';
import { useModalWindow } from 'react-modal-global';

// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { TextField, Stack, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';

// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import SelectBase from '@components/form/BaseSelect';
import Table from '@src/components/muiTable/Simple';
import BoxingSetting from '../component/BoxingSetting';

// api
import { apiGetOddsList, apiSetOdd } from '@api/RiskManage';
import { IResInfo } from '@api/RiskManage/res';

import Subtract from '@src/components/@svgIcon/Subtract';
import Plus from '@src/components/@svgIcon/Plus';

const timeList = [
  {
    text: '10',
    value: '10',
  },
  {
    text: '20',
    value: '20',
  },
  {
    text: '30',
    value: '30',
  },
  {
    text: '40',
    value: '40',
  },
  {
    text: '50',
    value: '50',
  },
  {
    text: '60',
    value: '60',
  },
];
const ControlOddsDialog = ({ infoData }: { infoData: IResInfo }) => {
  const modal = useModalWindow();

  const { t, fcShowMsg } = usePage();
  const [time, setTime] = useState('10');
  const [seconds, setSeconds] = useState(10);
  const [oddsList, setOddsList] = useState([]);
  const [oddsRange, setOddsRange] = useState(0.1);

  const getOddsList = useCallback(async () => {
    try {
      const { data } = await apiGetOddsList({
        room_id: infoData.room_id,
        game_no: infoData.game_no,
      });
      setOddsList(data);
      return Promise.resolve(data);
    } catch (error: any) {
      fcShowMsg({ type: 'error', msg: error.message });
      return Promise.reject(error);
    }
  }, [fcShowMsg, infoData.game_no, infoData.room_id]);

  //取得賠率列表
  useEffect(() => {
    getOddsList();
  }, [getOddsList]);

  const setOdd = useCallback(
    async (id: number, isPlus: boolean) => {
      try {
        const postData = {
          game_no: infoData.game_no,
          room_id: infoData.room_id,
          betarea_id: id,
          adjust: isPlus ? Number(oddsRange.toFixed(2)) : Number(-oddsRange.toFixed(2)),
        };
        const { data } = await apiSetOdd(postData);
        return Promise.resolve(data.odds);
      } catch (error: any) {
        fcShowMsg({ type: 'error', msg: error.message });
        //重新取得賠率列表
        getOddsList();
        return Promise.reject(error);
      }
    },
    [fcShowMsg, getOddsList, infoData.game_no, infoData.room_id, oddsRange],
  );

  const columns = useMemo(
    () => [
      {
        header: t('riskManage.controlOdds'),
        accessorKey: 'values',
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        enableSorting: false,
        header: t('riskManage.odds'),
        accessorKey: 'odds',
        Cell: ({ row }: { row: any }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <IconButton
                aria-label="Subtract"
                onClick={async () => {
                  const odds = await setOdd(row.original.id, false);
                  row.original.odds = odds;
                }}
              >
                <Subtract
                  style={{
                    position: 'absolute',
                    width: '20px',
                    height: '20px',
                    fill: 'red',
                  }}
                />
              </IconButton>

              <div>{row.original.odds}</div>
              <IconButton
                aria-label="Plus"
                onClick={async () => {
                  const odds = await setOdd(row.original.id, true);
                  row.original.odds = odds;
                }}
              >
                <Plus
                  style={{
                    position: 'absolute',
                    width: '20px',
                    height: '20px',
                    fill: 'green',
                  }}
                />
              </IconButton>
            </Stack>
          );
        },
      },
      {
        enableSorting: false,
        header: t('riskManage.totalBet'),
        accessorKey: 'bet_total',
        enableColumnFilter: false,
      },
    ],
    [setOdd, t],
  );

  const fcCloseDialog = () => {
    modal.close();
  };

  //當下拉選單的值改變時，將時間設定到秒數
  useEffect(() => {
    setSeconds(Number(time));
  }, [time]);

  //倒數計時
  useEffect(() => {
    if (Number(seconds) > 0) {
      const timerId = setTimeout(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      setSeconds(Number(time));
      getOddsList();
    }
  }, [seconds, time, getOddsList]);

  return (
    <div>
      <CustomizedDialog
        flag={!modal.closed}
        title={t('riskManage.controlOdds')}
        confirmCfg={{
          flag: false,
        }}
        cancelCfg={{
          flag: false,
        }}
        fcChangeDialog={fcCloseDialog}
      >
        <Grid container spacing={2} p={1} alignItems="center">
          <BoxingSetting value={infoData} readOnly={true} />
          <Grid xs={12} md={12}>
            <Divider />
          </Grid>

          <Grid xs={12} md={6}>
            <Alert
              variant="outlined"
              severity="info"
              sx={{
                justifyItems: 'center',
                alignItems: 'center',
                '& .MuiAlert-message': {
                  display: 'inline-flex',
                  justifyItems: 'center',
                  alignItems: 'center',
                },
              }}
            >
              <div>
                {t('riskManage.countDownText')}:{seconds} {t('riskManage.autoControlOddsTime')}
              </div>
              <div>
                <SelectBase
                  options={timeList}
                  value={time}
                  setValue={(value: string) => {
                    setTime(value);
                  }}
                />
              </div>
            </Alert>
          </Grid>
          <Grid xs={12} md={6}>
            <Alert
              variant="outlined"
              severity="info"
              sx={{
                justifyItems: 'center',
                alignItems: 'center',
                '& .MuiAlert-message': {
                  display: 'inline-flex',
                  justifyItems: 'center',
                  alignItems: 'center',
                },
              }}
            >
              <div style={{ flexShrink: 0 }}>{t('riskManage.setRangeText')}:</div>
              <div>
                <TextField
                  type="number"
                  name="range"
                  fullWidth
                  onChange={(event) => {
                    const newValue = event.target.value;
                    setOddsRange(newValue ? Number(newValue) : 0.1);
                  }}
                  value={oddsRange}
                />
              </div>
            </Alert>
          </Grid>
          <Grid xs={12} md={12}>
            <Table columns={columns} data={oddsList}></Table>
          </Grid>
        </Grid>
      </CustomizedDialog>
    </div>
  );
};
export default ControlOddsDialog;
