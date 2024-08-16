import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList } from '@api/ReportUser';
import { IResInfo, IResFooter } from '@api/ReportUser/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Link, Divider, Collapse } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // custom Components
import PageTable from '@components/muiTable/MBase';
import { UserExcel } from '@pages/ReportOperation/excel/UserExcel';
import SelectOutline from '@components/search/SelectOutline';
import SelectMultiple from '@components/search/SelectMultiple';
import SearchDateRgPicker from '@components/search/DateRangePicker';
import { fcMoneyFormat, fcMoneyDecimalFormat } from '@src/utils/method';
import { ReportTabProps } from '../index';

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
  const [searchCfg, setSearchCfg] = useState({});

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
              <Grid xs={4} textAlign="center">
                <Grid>{row.original.uid}</Grid>
              </Grid>
              <Grid container xs={8}>
                <Grid xs={6}>
                  <Grid>{t('sys.username')}</Grid>
                  <Grid>
                    <Link
                      underline="always"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setParentSearch((prevState) => ({
                          ...prevState,
                          username: row.original.username,
                        }));
                        setStep('bet');
                      }}
                    >
                      {row.original.username}
                    </Link>
                  </Grid>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <Grid>{t('report.bet_count')}</Grid>
                  <Grid>{fcMoneyFormat(row.original.bet_count)}</Grid>
                </Grid>
                <Grid xs={6}>
                  <Grid>{t('report.payout')}</Grid>
                  <Grid>{fcMoneyDecimalFormat(row.original.payout)}</Grid>
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
              <Grid xs={3.3} textAlign="center">
                {t('sys.total')}
              </Grid>
              <Grid container xs={6}>
                <Grid xs={6}>
                  <Grid>{t('report.payout')}</Grid>
                  <Grid>{fcMoneyDecimalFormat(footerObj.payout)}</Grid>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <Grid>{t('report.bet_count')}</Grid>
                  <Grid>{fcMoneyFormat(footerObj.bet_count)}</Grid>
                </Grid>
              </Grid>

              <Grid
                xs={2.7}
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
                    <Grid xs={4} my={1}>
                      {t('report.bet_real')}
                    </Grid>
                    <Grid xs={8} my={1} textAlign="right">
                      {fcMoneyFormat(footerObj.bet_real)}
                    </Grid>
                    <Grid xs={12}>
                      <Divider />
                    </Grid>
                    <Grid xs={4} my={1}>
                      {t('report.bet_total')}
                    </Grid>
                    <Grid xs={8} my={1} textAlign="right">
                      {fcMoneyFormat(footerObj.bet_total)}
                    </Grid>
                    <Grid xs={12}>
                      <Divider />
                    </Grid>

                    <Grid xs={4} my={1}>
                      {t('report.payoff')}
                    </Grid>
                    <Grid
                      xs={8}
                      my={1}
                      textAlign="right"
                      style={{
                        color:
                          footerObj.payoff > 0 ? theme.palette.error.main : theme.palette.info.main,
                      }}
                    >
                      {fcMoneyDecimalFormat(footerObj.payoff)}
                    </Grid>
                    <Grid xs={12}>
                      <Divider />
                    </Grid>
                    <Grid xs={4} my={1}>
                      {t('report.rebate')}
                    </Grid>
                    <Grid xs={8} my={1} textAlign="right">
                      {fcMoneyDecimalFormat(footerObj.rebate)}
                    </Grid>
                    <Grid xs={4} my={1}>
                      {t('report.donate')}
                    </Grid>
                    <Grid xs={8} my={1} textAlign="right">
                      {fcMoneyFormat(footerObj.donate)}
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
        ...parentSearch,
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
          flag: allPermission.includes('report.user.export'),
          excelHeader: UserExcel,
          title: `${t('reportOperation.user')} ${parentSearch.report_date1} - ${
            parentSearch.report_date2
          }`,
          fileName: `${t('reportOperation.user')} ${parentSearch.report_date1}`,
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
            <Grid xs={12} md={3}>
              <SelectMultiple
                placeholder={t('report.room_type')}
                options={roomTypeList}
                value={parentSearch.room_type || ''}
                setValue={(value: string) => {
                  setParentSearch((prevState) => ({
                    ...prevState,
                    room_type: value,
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
        renderDetailPanel={({ row }: { row: any }) => {
          return (
            <Grid container p={0.5}>
              <Grid xs={4} my={1}>
                {t('report.bet_count')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                {fcMoneyFormat(row.original.bet_count)}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('report.bet_total')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                {fcMoneyFormat(row.original.bet_total)}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('report.bet_real')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                {fcMoneyFormat(row.original.bet_real)}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>

              <Grid xs={4} my={1}>
                {t('report.payoff')}
              </Grid>
              <Grid
                xs={8}
                my={1}
                textAlign="right"
                style={{
                  color:
                    row.original.payoff > 0 ? theme.palette.error.main : theme.palette.info.main,
                }}
              >
                {fcMoneyDecimalFormat(row.original.payoff)}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('report.rakeback')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                {fcMoneyDecimalFormat(row.original.rakeback)}%
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('report.rebate')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                {fcMoneyDecimalFormat(row.original.rebate)}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('report.donate')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                {fcMoneyFormat(row.original.donate)}
              </Grid>
            </Grid>
          );
        }}
      />
    </Grid>
  );
};

export default withPageHoc(ReportOperationUser);
