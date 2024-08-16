import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList } from '@api/ReportUser';
import { IResInfo, IResFooter } from '@api/ReportUser/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Divider, Collapse } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// ant-design
import { CopyOutlined } from '@ant-design/icons';
// custom Components
import { getDateRange } from '@utils/date';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PageTable from '@src/components/muiTable/MBase';
import { UserExcel } from '@pages/ReportUser/excel/UserExcel';
import SelectOutline from '@components/search/SelectOutline';
import SelectMultiple from '@components/search/SelectMultiple';
import SearchOutLine from '@components/search/InputOutline';
import SearchDateReportPicker from '@components/search/DateReportPicker';
import { fcMoneyFormat, fcMoneyDecimalFormat } from '@src/utils/method';
import useAuth from '@src/hooks/useAuth';

const MReportUser = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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

  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'uid',
        enableColumnFilter: false,
        enableSorting: false,
        muiTableFooterCellProps: ({ table }: { table: any }) => {
          const footer = table.refs.tableFooterRef.current;
          if (footer && footer.firstChild && footer.firstChild.children.length === 2) {
            footer.firstChild.removeChild(footer.firstChild.lastChild);
          }
          return {
            colSpan: 2,
          };
        },
        Cell: ({ row }: { row: any }) => {
          return (
            <Grid
              container
              spacing={2}
              textAlign="left"
              alignItems="center"
              style={{ minWidth: '75vw' }}
            >
              <Grid xs={2.5} textAlign="center">
                {row.original.uid}
              </Grid>
              <Grid container xs={9.5}>
                <Grid xs={6}>
                  <Grid>{t('sys.username')}</Grid>
                  <CopyToClipboard text={row.original.username}>
                    <Grid p={0}>
                      {row.original.username} <CopyOutlined />
                    </Grid>
                  </CopyToClipboard>
                  <Grid>{row.original.name}</Grid>
                </Grid>
                {/* 有效投注 */}
                <Grid xs={6} textAlign="right">
                  <Grid>{t('report.bet_real')}</Grid>
                  <span>{fcMoneyFormat(row.original.bet_real)}</span>
                </Grid>
                {/* 派彩 */}
                <Grid xs={6}>
                  <Grid>{t('report.payout')}</Grid>
                  <Grid p={0}>{fcMoneyFormat(row.original.payout)}</Grid>
                </Grid>
                {/* 輸贏 */}
                <Grid xs={6} textAlign="right">
                  <Grid>{t('report.payoff')}</Grid>
                  <span
                    style={{
                      color:
                        row.original.payoff > 0
                          ? theme.palette.error.main
                          : theme.palette.info.main,
                    }}
                  >
                    {fcMoneyFormat(row.original.payoff)}
                  </span>
                </Grid>
              </Grid>
            </Grid>
          );
        },
        Footer: ({ table }: { table: any }) => {
          const [expand, setExpand] = useState(false);
          return (
            <Grid
              container
              spacing={2}
              textAlign="left"
              alignItems="center"
              style={{ minWidth: '75vw' }}
            >
              <Grid xs={2} textAlign="center">
                {t('sys.total')}
              </Grid>
              <Grid container xs={8}>
                {/* 投注總量 */}
                <Grid xs={6}>
                  <Grid>{t('report.bet_total')}</Grid>
                  <span>{fcMoneyFormat(footerObj.bet_total)}</span>
                </Grid>
                {/* 有效投注 */}
                <Grid xs={6} textAlign="right">
                  <Grid>{t('report.bet_real')}</Grid>
                  <span>{fcMoneyFormat(footerObj.bet_real)}</span>
                </Grid>
                {/* 派彩 */}
                <Grid xs={6}>
                  <Grid>{t('report.payout')}</Grid>
                  <Grid p={0}>{fcMoneyFormat(footerObj.payout)}</Grid>
                </Grid>
                {/* 輸贏 */}
                <Grid xs={6} textAlign="right">
                  <Grid>{t('report.payoff')}</Grid>
                  <span
                    style={{
                      color:
                        footerObj.payoff > 0 ? theme.palette.error.main : theme.palette.info.main,
                    }}
                  >
                    {fcMoneyFormat(footerObj.payoff)}
                  </span>
                </Grid>
              </Grid>
              <Grid
                xs={2}
                sx={{ paddingRight: '0.75rem', textAlign: 'right' }}
                onClick={() => {
                  setExpand(!expand);
                }}
              >
                {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Grid>
              {/* 展開客制 */}
              <Grid
                xs={12}
                sx={{
                  display: expand ? 'block' : 'none',
                  backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff',
                }}
              >
                <Collapse in={expand} timeout={200}>
                  <Grid container p={0.5}>
                    {/* 投注量 */}
                    <Grid xs={5} mt={1} mb={1}>
                      {t('report.bet_count')}:
                    </Grid>
                    <Grid xs={7} mt={1} mb={1} textAlign="right">
                      {fcMoneyFormat(footerObj.bet_count)}
                    </Grid>
                    <Grid xs={12}>
                      <Divider />
                    </Grid>
                    {/* 反水 */}
                    <Grid xs={5} mt={1} mb={1}>
                      {`${t('report.rakeback')} / ${t('report.rebate')}`}:
                    </Grid>
                    <Grid xs={7} mt={1} mb={1} textAlign="right">
                      <div>-&nbsp;/&nbsp;{fcMoneyDecimalFormat(footerObj.rebate)}</div>
                    </Grid>
                    <Grid xs={12}>
                      <Divider />
                    </Grid>
                    {/* 打賞 */}
                    <Grid xs={5} mt={1} mb={1}>
                      {t('report.donate')}:
                    </Grid>
                    <Grid xs={7} mt={1} mb={1} textAlign="right">
                      {fcMoneyFormat(footerObj.donate)}
                    </Grid>
                    <Grid xs={12}>
                      <Divider />
                    </Grid>
                  </Grid>
                </Collapse>
              </Grid>
            </Grid>
          );
        },
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
        renderDetailPanel={({ row }: { row: any }) => {
          return (
            <Grid container p={0.5}>
              {/* 投注量 */}
              <Grid xs={5} mt={1} mb={1}>
                {t('report.bet_count')}:
              </Grid>
              <Grid xs={7} mt={1} mb={1} textAlign="right">
                {fcMoneyDecimalFormat(row.original.bet_count)}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              {/* 投注總額 */}
              <Grid xs={5} mt={1} mb={1}>
                {t('report.bet_total')}:
              </Grid>
              <Grid xs={7} mt={1} mb={1} textAlign="right">
                {fcMoneyDecimalFormat(row.original.bet_total)}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              {/* 反水比% / 反水 */}
              <Grid xs={5} mt={1} mb={1}>
                {`${t('report.rakeback')} / ${t('report.rebate')}`}:
              </Grid>
              <Grid xs={7} mt={1} mb={1} textAlign="right">
                {fcMoneyDecimalFormat(row.original.rakeback)}% &nbsp;/&nbsp;
                {fcMoneyDecimalFormat(row.original.rebate)}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              {/* 打賞 */}
              <Grid xs={5} mt={1} mb={1}>
                {t('report.donate')}:
              </Grid>
              <Grid xs={7} mt={1} mb={1} textAlign="right">
                {fcMoneyFormat(row.original.donate)}
              </Grid>
            </Grid>
          );
        }}
      />
    </Grid>
  );
};

export default withPageHoc(MReportUser);
