import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList } from '@api/ReportUser';
import { IResInfo, IResFooter } from '@api/ReportUser/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button } from '@mui/material';
// custom Components
import { getDateRange } from '@utils/date';
import PageTable from '@src/components/muiTable/Base';
import SelectOutline from '@components/search/SelectOutline';
import SelectMultiple from '@components/search/SelectMultiple';
import SearchOutLine from '@components/search/InputOutline';
import SearchDateReportPicker from '@components/search/DateReportPicker';
import { fcMoneyFormat, fcMoneyDecimalFormat } from '@src/utils/method';
import useAuth from '@src/hooks/useAuth';
import { UserExcel } from './excel/UserExcel';

const ReportUser = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const { sysTime } = globalState;
  const { authState } = useAuth();

  const [roomList, setRoomList] = useState<TbSelectProps[]>([]);
  const [roomTypeList, setRoomTypeList] = useState<TbSelectProps[]>([]);
  const [footerObj, setFooterObj] = useState<IResFooter>({
    bet_count: 0,
    bet_real: 0,
    bet_total: 0,
    payoff: 0,
    payout: 0,
    rebate: 0,
    donate: 0,
    turn_in: 0,
  });
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    room_id: '',
    room_type: '',
    username: '',
    report_time1: getDateRange(sysTime, 'thisWeek')[0].format('YYYY-MM-DD HH:mm:ss'),
    report_time2: getDateRange(sysTime, 'thisWeek')[1].format('YYYY-MM-DD HH:mm:ss'),
  });

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

  const columns = useMemo(
    () => [
      {
        header: t('sys.uid'),
        accessorKey: 'uid',
        enableColumnFilter: false,
        muiTableFooterCellProps: {
          align: 'center',
        },
        Footer: () => <div>{t('sys.sum')}</div>,
      },
      {
        header: t('sys.username'),
        accessorKey: 'username',
        enableColumnFilter: false,
        muiTableFooterCellProps: {
          align: 'center',
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('sys.name'),
        accessorKey: 'name',
        enableColumnFilter: false,
        muiTableFooterCellProps: {
          align: 'center',
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('report.bet_count'),
        accessorKey: 'bet_count',
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return <div> {fcMoneyFormat(row.getValue('bet_count'))}</div>;
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.bet_count)}</div>,
      },
      {
        header: t('report.bet_total'),
        accessorKey: 'bet_total',
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return <div> {fcMoneyFormat(row.getValue('bet_total'))}</div>;
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
        Cell: ({ row }: { row: any }) => {
          return <div> {fcMoneyFormat(row.getValue('bet_real'))}</div>;
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.bet_real)}</div>,
      },
      {
        header: t('report.payout'),
        accessorKey: 'payout',
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return <div> {fcMoneyDecimalFormat(row.getValue('payout'))}</div>;
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
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                color:
                  row.getValue('payoff') >= 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {fcMoneyDecimalFormat(row.getValue('payoff'))}
            </div>
          );
        },
        Footer: () => (
          <div
            style={{
              color: footerObj.payoff >= 0 ? theme.palette.error.main : theme.palette.info.main,
            }}
          >
            {fcMoneyDecimalFormat(footerObj.payoff)}
          </div>
        ),
      },
      {
        header: `${t('report.rakeback')} / ${t('report.rebate')}`,
        accessorKey: 'rebate',
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              {fcMoneyDecimalFormat(row.original.rakeback)}% &nbsp;/&nbsp;
              {fcMoneyDecimalFormat(row.getValue('rebate'))}
            </div>
          );
        },
        Footer: () => <div>-&nbsp;/&nbsp;{fcMoneyDecimalFormat(footerObj.rebate)}</div>,
      },
      {
        header: t('report.donate'),
        accessorKey: 'donate',
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('donate'))}</div>;
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.donate)}</div>,
      },
    ],
    [t, theme, allPermission, editLoading, roomList, roomTypeList, footerObj],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, refer, meta, footer } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      const roomList: TbSelectProps[] = Object.entries(refer.room).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const roomTypeList: TbSelectProps[] = Object.entries(refer.room_type).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      //Search Cfg
      setRoomList(roomList);
      setRoomTypeList(roomTypeList);
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
        bet_count: 0,
        bet_real: 0,
        bet_total: 0,
        payoff: 0,
        payout: 0,
        rebate: 0,
        donate: 0,
      }));
      throw error;
    }
  };

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
          flag: allPermission.includes('report.user.export'),
          excelHeader: UserExcel,
          title: `${t('menu.reportUser')} ${searchCfg.report_time1} - ${searchCfg.report_time2}`,
          fileName: `${t('menu.reportUser')} ${searchCfg.report_time1}`,
          fcExportData: async (page: number, pageSize: number) => {
            try {
              const { data: excelData } = await apiList({
                ...searchCfg,
                page: page,
                per_page: pageSize,
                export: 1,
              });
              return Promise.resolve({ excelData });
            } catch (error) {
              throw error;
            }
          },
        }}
        searchComponent={
          <Grid container xs={12} spacing={2.5}>
            <Grid xs={12} md={1.5}>
              <SelectOutline
                placeholder={t('report.room')}
                options={roomList}
                value={searchCfg.room_id || ''}
                setValue={(value: string) => {
                  setSearchCfg((prevState) => ({
                    ...prevState,
                    room_id: value,
                  }));
                }}
              />
            </Grid>
            <Grid xs={12} md={1.5}>
              <SelectMultiple
                placeholder={t('report.room_type')}
                options={roomTypeList}
                value={searchCfg.room_type || ''}
                setValue={(value: string) => {
                  setSearchCfg((prevState) => ({
                    ...prevState,
                    room_type: value,
                  }));
                }}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <SearchOutLine
                placeholder={t('sys.username')}
                value={searchCfg.username || ''}
                setValue={(value: string) => {
                  setSearchCfg((prevState) => ({
                    ...prevState,
                    username: value,
                  }));
                }}
              />
            </Grid>
            <Grid xs={12} md={5}>
              <SearchDateReportPicker
                views={['year', 'month', 'day', 'hours']}
                start={searchCfg.report_time1 || ''}
                end={searchCfg.report_time2 || ''}
                startKey={'report_time1'}
                endKey={'report_time2'}
                setValue={(key: string, value: string) => {
                  setSearchCfg((prevState) => ({
                    ...prevState,
                    [key]: value,
                  }));
                }}
                shortcutsItemList={shortcutsItemList}
              />
            </Grid>
            <Grid xs={12} md={1}>
              <Button
                fullWidth
                variant="contained"
                onClick={async () => {
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
          </Grid>
        }
      />
    </Grid>
  );
};

export default withPageHoc(ReportUser);
