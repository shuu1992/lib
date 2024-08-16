import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiDetail } from '@api/RiskHedging';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/RiskHedging/req';
import { IResDetail } from '@api/RiskHedging/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Typography } from '@mui/material';
// custom Components
import { useModalWindow } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import CustomizedDialog from '@components/dialog/FormDialog';
import { fcMoneyFormat } from '@src/utils/method';

export interface IDetailSearchProps {
  username: string;
  uid: number;
  target_uid: number;
  report_time1: string;
  report_time2: string;
}

const Detail = ({
  defaultSearchProps,
  pageHocProps = defaultPageHocProps,
}: WithPageHocProps & { defaultSearchProps: IDetailSearchProps }) => {
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
  const { allPermission } = menuState;
  const [betareaList, setBetareaList] = useState<TbSelectProps[]>([]);
  const [roomList, setRoomList] = useState<TbSelectProps[]>([]);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    uid: defaultSearchProps.uid,
    target_uid: defaultSearchProps.target_uid,
    report_time1: defaultSearchProps.report_time1,
    report_time2: defaultSearchProps.report_time2,
  });

  const columns = useMemo(
    () => [
      {
        header: t('riskHedging.room_id'),
        accessorKey: 'room_id',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          const room = row.getValue('room_id');
          const roomObj = roomList.find((item) => item.value == room);
          return <div>{roomObj?.text}</div>;
        },
      },
      {
        header: t('riskHedging.game_no'),
        accessorKey: 'game_no',
        enableColumnFilter: false,
      },
      {
        Header: ({ column }: { column: any }) => (
          <div>
            <div>{t('sys.username')}</div>
            <div>{t('riskHedging.target_username')}</div>
          </div>
        ),
        header: t('sys.username'),
        accessorKey: 'username',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <Typography
                sx={{
                  color: theme.palette.info.main,
                }}
              >
                {row.original.username}
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.error.main,
                }}
              >
                {row.original.target_username}
              </Typography>
            </div>
          );
        },
      },
      {
        Header: ({ column }: { column: any }) => (
          <div>
            <div>{t('riskHedging.betarea_id')}</div>
            <div>{t('riskHedging.target_betarea_id')}</div>
          </div>
        ),
        header: t('riskHedging.betarea_id'),
        accessorKey: 'betarea_id',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          const betareaId = row.getValue('betarea_id');
          const target_betarea_id = row.original.target_betarea_id;
          const betareaObj = betareaList.find((item: any) => item.value == betareaId);
          const target_betareaObj = betareaList.find(
            (item: any) => item.value == target_betarea_id,
          );
          return (
            <div>
              <Typography
                sx={{
                  color: theme.palette.info.main,
                }}
              >
                {betareaObj?.text}
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.error.main,
                }}
              >
                {target_betareaObj?.text}
              </Typography>
            </div>
          );
        },
      },
      {
        Header: ({ column }: { column: any }) => (
          <div>
            <div>{t('report.bet_total')}</div>
            <div>{t('riskHedging.target_bet_total')}</div>
          </div>
        ),
        header: t('report.bet_total'),
        accessorKey: 'bet_total',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <Typography
                sx={{
                  color: theme.palette.info.main,
                }}
              >
                {fcMoneyFormat(row.original.bet_total)}
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.error.main,
                }}
              >
                {fcMoneyFormat(row.original.target_bet_total)}
              </Typography>
            </div>
          );
        },
      },
      {
        Header: ({ column }: { column: any }) => (
          <div>
            <div>{t('report.bet_real')}</div>
            <div>{t('riskHedging.target_bet_real')}</div>
          </div>
        ),
        header: t('report.bet_real'),
        accessorKey: 'bet_real',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <Typography
                sx={{
                  color: theme.palette.info.main,
                }}
              >
                {fcMoneyFormat(row.original.bet_real)}
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.error.main,
                }}
              >
                {fcMoneyFormat(row.original.target_bet_real)}
              </Typography>
            </div>
          );
        },
      },
      {
        Header: ({ column }: { column: any }) => (
          <div>
            <div>{t('sys.ip')}</div>
            <div>{t('riskHedging.target_ip')}</div>
          </div>
        ),
        header: t('sys.ip'),
        accessorKey: 'ip',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <Typography
                sx={{
                  color: theme.palette.info.main,
                }}
              >
                {row.original.ip}
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.error.main,
                }}
              >
                {row.original.target_ip}
              </Typography>
            </div>
          );
        },
      },
      {
        Header: ({ column }: { column: any }) => (
          <div>
            <div>{t('riskHedging.report_time')}</div>
            <div>{t('riskHedging.target_report_time')}</div>
          </div>
        ),
        header: t('riskHedging.report_time'),
        accessorKey: 'report_time',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <Typography
                sx={{
                  color: theme.palette.info.main,
                }}
              >
                {row.original.report_time}
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.error.main,
                }}
              >
                {row.original.target_report_time}
              </Typography>
            </div>
          );
        },
      },
    ],
    [t, theme, allPermission, editLoading, betareaList, roomList],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, meta, refer } = await apiDetail({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      const betareaList: TbSelectProps[] = Object.entries(refer.betarea).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const roomList: TbSelectProps[] = Object.entries(refer.room).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      //Search Cfg
      setBetareaList(betareaList);
      setRoomList(roomList);
      //Base setting
      setPgCfg((prevState: PgCfgProps) => ({
        ...prevState,
        pageTotal: meta.total,
      }));
      setDataList((prevState: IResDetail[]) => data);
      setLoadingFlag(false);
    } catch (error: any) {
      setLoadingFlag(false);
      throw error;
    }
  };

  return (
    <PageTable
      columns={columns}
      data={dataList}
      loadingFlag={loadingFlag}
      pgCfg={pgCfg}
      searchCfg={searchCfg}
      setPgCfg={setPgCfg}
      setSearchCfg={setSearchCfg}
      setTSearchCfg={setTSearchCfg}
      fetchData={fcGetList}
      loadingCfg={{
        flag: true,
        anim: loadingFlag,
        setFlag: () => {
          fcGetList({ ...pgCfg, searchCfg: { ...searchCfg, ...tSearchCfg } });
        },
      }}
    />
  );
};

export default function DetailDialog({
  defaultSearchProps,
}: {
  defaultSearchProps: IDetailSearchProps;
}) {
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();
  const DetalComp = withPageHoc(Detail);
  const fcCloseDialog = () => {
    modal.close();
  };

  return (
    <CustomizedDialog
      className="xl"
      flag={!modal.closed}
      title={t('sys.notice')}
      confirmCfg={{
        flag: false,
        txt: t('sys.confirm'),
        fcConfirm: async () => {
          return Promise.resolve();
        },
      }}
      fcChangeDialog={fcCloseDialog}
    >
      <Grid container spacing={2} p={1} alignItems="center">
        <Grid xs={12} m={2}>
          <DetalComp defaultSearchProps={defaultSearchProps} />
        </Grid>
      </Grid>
    </CustomizedDialog>
  );
}
