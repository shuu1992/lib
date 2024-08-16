import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList } from '@api/GameBetRecord';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/GameBetRecord/req';
import { IResInfo, IResFooter } from '@api/GameBetRecord/res';
import { getValueColor, getWinLostColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Typography, Link } from '@mui/material';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import SelectOutline from '@components/search/SelectOutline';
import SearchDateRgPicker from '@components/search/DateRangePicker';
import { fcMoneyFormat, fcMoneyDecimalFormat } from '@src/utils/method';
import { BetExcel } from '../excel/BetExcel';
import { ReportTabProps } from '../index';
import GameInfo from './GameInfo';

const Modal = new ModalController();

const ReportOperationUser = ({
  parentSearch,
  setStep,
  setParentSearch,
  pageHocProps = defaultPageHocProps,
}: WithPageHocProps & ReportTabProps) => {
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
  const [winloseList, setWinloseList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);

  const [footerObj, setFooterObj] = useState<IResFooter>({
    bet_real: 0,
    bet_total: 0,
    payoff: 0,
    payout: 0,
  });
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({});

  const columns = useMemo(
    () => [
      {
        header: t('sys.id'),
        accessorKey: 'id',
        enableColumnFilter: false,
        muiTableFooterCellProps: {
          align: 'center',
        },
        Footer: () => <div>{t('sys.sum')}</div>,
      },
      {
        header: t('report.game_no'),
        accessorKey: 'game_no',
        muiFilterTextFieldProps: { placeholder: t('report.game_no') },
        muiTableFooterCellProps: {
          align: 'center',
        },
        Cell: ({ row }: { row: any }) => {
          const room = row.original.room_id;
          const roomObj = roomList.find((item) => item.value == room);
          return (
            <Link
              color="primary"
              underline="always"
              sx={{ cursor: 'pointer' }}
              onClick={async () => {
                await Modal.open(GameInfo, {
                  infoData: {
                    ...row.original.record,
                    room_name: roomObj?.text,
                    game_no: row.getValue('game_no'),
                  },
                });
              }}
            >
              {row.getValue('game_no')}
            </Link>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('sys.username'),
        accessorKey: 'username',
        enableSorting: false,
        enableColumnFilter: false,
        muiTableFooterCellProps: {
          align: 'center',
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('report.bet_no'),
        accessorKey: 'bet_no',
        enableClickToCopy: true,
        muiFilterTextFieldProps: { placeholder: t('report.bet_no') },
        muiTableFooterCellProps: {
          align: 'center',
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('report.r'),
        accessorKey: 'betarea',
        enableSorting: false,
        enableColumnFilter: false,
        muiTableFooterCellProps: {
          align: 'center',
        },
        Cell: ({ row }: { row: any }) => {
          const betareaId = row.original.betarea_id;
          const betareaObj = betareaList.find((item: any) => item.value == betareaId);
          return (
            <Typography sx={{ color: theme.palette.info.main }}>{betareaObj?.text}</Typography>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('report.bet_total'),
        accessorKey: 'bet_total',
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        muiTableFooterCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('bet_total'))}</div>;
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.bet_total)}</div>,
      },
      {
        header: t('report.bet_real'),
        accessorKey: 'bet_real',
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        muiTableFooterCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('bet_real'))}</div>;
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.bet_real)}</div>,
      },
      {
        header: t('report.odds'),
        accessorKey: 'odds',
        enableColumnFilter: false,
        muiTableFooterCellProps: {
          align: 'center',
        },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('odds'))}</div>;
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('report.payout'),
        accessorKey: 'payout',
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        muiTableFooterCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{
                color:
                  row.getValue('payout') >= 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {fcMoneyDecimalFormat(row.getValue('payout'))}
            </Typography>
          );
        },
        Footer: () => <div>{fcMoneyDecimalFormat(footerObj.payout)}</div>,
      },
      {
        header: t('report.payoff'),
        accessorKey: 'payoff',
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        muiTableFooterCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{
                color:
                  row.getValue('payoff') >= 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {fcMoneyDecimalFormat(row.getValue('payoff'))}
            </Typography>
          );
        },
        Footer: () => <div>{fcMoneyDecimalFormat(footerObj.payoff)}</div>,
      },
      {
        header: t('report.is_lose_win'),
        accessorKey: 'is_lose_win',
        enableSorting: false,
        filterSelectOptions: winloseList,
        filterVariant: 'select',
        muiFilterTextFieldProps: { placeholder: t('report.is_lose_win') },
        muiTableFooterCellProps: {
          align: 'center',
        },
        Cell: ({ row }: { row: any }) => {
          const winLose = row.getValue('is_lose_win');
          const winLoseObj = winloseList.find((item) => item.value == winLose);
          return (
            <Typography color={getWinLostColor(theme, winLose)}>{winLoseObj?.text}</Typography>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('sys.status'),
        accessorKey: 'status',
        enableSorting: false,
        filterSelectOptions: statusList,
        filterVariant: 'select',
        muiFilterTextFieldProps: { placeholder: t('sys.status') },
        muiTableFooterCellProps: {
          align: 'center',
        },
        Cell: ({ row }: { row: any }) => {
          const status = row.getValue('status');
          const statusObj = statusList.find((item) => item.value == status);
          return (
            <Button variant="outlined" color={getValueColor(theme, status)}>
              {statusObj?.text}
            </Button>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('report.report_time'),
        accessorKey: 'report_time',
        enableColumnFilter: false,
        muiTableFooterCellProps: {
          align: 'center',
        },
        Footer: () => <div>-</div>,
      },
    ],
    [
      t,
      theme,
      allPermission,
      editLoading,
      searchCfg,
      roomList,
      winloseList,
      statusList,
      betareaList,
      footerObj,
    ],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, refer, meta, footer } = await apiList({
        ...parentSearch,
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
      const winloseList: TbSelectProps[] = Object.entries(refer.is_lose_win).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const statusList: TbSelectProps[] = Object.entries(refer.status).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );

      //Search Cfg
      setBetareaList(betareaList);
      setRoomList(roomList);
      setWinloseList(winloseList);
      setStatusList(statusList);
      setFooterObj(footer);
      //Base setting
      setPgCfg((prevState: PgCfgProps) => ({
        ...prevState,
        pageTotal: meta.total,
      }));
      setDataList((prevState: IResInfo[]) => data);
      setLoadingFlag(false);
    } catch (error: any) {
      setLoadingFlag(false);
      setFooterObj((prevState: IResFooter) => ({
        ...prevState,
        bet_real: 0,
        bet_total: 0,
        payoff: 0,
        payout: 0,
      }));
      throw error;
    }
  };

  useEffect(() => {
    setDataList((prevState: IResInfo[]) => []);
  }, []);

  return (
    <Grid>
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
        exportCfg={{
          flag: allPermission.includes('report.bet.export'),
          excelHeader: BetExcel,
          title: `${t('reportOperation.bet')} ${parentSearch.report_date1} - ${
            parentSearch.report_date2
          }`,
          fileName: `${t('reportOperation.bet')} ${parentSearch.report_date1}`,
          fcExportData: async (page: number, pageSize: number) => {
            try {
              const { data: excelData } = await apiList({
                ...parentSearch,
                ...searchCfg,
                ...tSearchCfg,
                page: page,
                per_page: pageSize,
                export: 1,
              });
              excelData.map((item: any) => {
                item.status = statusList.find((status) => status.value == item.status)?.text;
              });
              return Promise.resolve({ excelData });
            } catch (error) {
              throw error;
            }
          },
        }}
        searchComponent={
          <Grid container xs={12} spacing={2.5}>
            <Grid xs={12} md={3}>
              <SelectOutline
                disabled={true}
                placeholder={t('reportOperation.room')}
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
            <Grid xs={12} md={3}>
              <SearchDateRgPicker
                disabled={true}
                placeholder={t('sys.report_date')}
                start={parentSearch.report_date1 || ''}
                end={parentSearch.report_date2 || ''}
                startKey={'report_date1'}
                endKey={'report_date2'}
                setValue={(key: string, value: string) => {
                  setParentSearch((prevState) => ({
                    ...prevState,
                    [key]: value,
                  }));
                }}
              />
            </Grid>
          </Grid>
        }
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(ReportOperationUser);
