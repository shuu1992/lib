import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiDetail } from '@api/RiskHedging';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/RiskHedging/req';
import { IResInfo } from '@api/RiskHedging/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Typography, Link, Divider } from '@mui/material';
// custom Components
import { getDateRange } from '@utils/date';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/MBase';
import SearchOutLine from '@components/search/InputOutline';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import { fcMoneyFormat } from '@src/utils/method';
import Detail from './feature/Detail';

const Modal = new ModalController();

const RiskHedging = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const { t, fcShowMsg } = usePage();
  const { allPermission } = menuState;
  const { sysTime } = globalState;
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
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
        Cell: ({ row }: { row: any }) => {
          return (
            <Grid
              container
              spacing={2}
              textAlign="left"
              alignItems="center"
              style={{ minWidth: '75vw' }}
              p={1}
            >
              <Grid xs={3} textAlign="center">
                <Grid xs={6}>
                  <Grid>{t('sys.uid')}</Grid>
                  <Grid>{t('riskHedging.target_uid')}</Grid>
                  <Grid>
                    <Typography
                      sx={{
                        color: theme.palette.info.main,
                      }}
                    >
                      {row.original.uid}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Link
                      underline="always"
                      sx={{
                        cursor: 'pointer',
                      }}
                      onClick={async () => {
                        await Modal.open(Detail, {
                          defaultSearchProps: {
                            username: row.original.username,
                            uid: row.original.uid,
                            target_uid: row.original.target_uid,
                            report_time1: searchCfg.report_time1,
                            report_time2: searchCfg.report_time2,
                          },
                        });
                      }}
                    >
                      {row.original.target_uid}
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container xs={9}>
                <Grid xs={6}>
                  <Grid>{t('sys.username')}</Grid>
                  <Grid>{t('riskHedging.target_username')}</Grid>
                  <Grid>
                    <Typography
                      sx={{
                        color: theme.palette.info.main,
                      }}
                    >
                      {row.original.username}
                    </Typography>
                  </Grid>
                  <Typography
                    sx={{
                      color: theme.palette.error.main,
                    }}
                  >
                    {row.original.target_username}
                  </Typography>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <Grid>{t('sys.ip')}</Grid>
                  <Grid>{t('riskHedging.target_ip')}</Grid>
                  <Grid>
                    <Typography
                      sx={{
                        color: theme.palette.info.main,
                      }}
                    >
                      {row.original.ip}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography
                      sx={{
                        color: theme.palette.error.main,
                      }}
                    >
                      {row.original.target_ip}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        },
      },
    ],
    [t, theme, allPermission, editLoading, searchCfg],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, refer, meta } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      //Search Cfg
      //Base setting
      setPgCfg((prevState: PgCfgProps) => ({
        ...prevState,
        pageTotal: meta.total,
      }));
      setDataList((prevState: IResInfo[]) => data);
      setLoadingFlag(false);
    } catch (error: any) {
      setLoadingFlag(false);
      fcShowMsg({ type: 'error', msg: error.message });
      throw error;
    }
  };

  return (
    <Grid>
      <PageTable
        defaultFilterFlag={true}
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
        searchComponent={
          <Grid container xs={12} spacing={2.5}>
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
              <SearchDateTimeRgPicker
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
              />
            </Grid>
            <Grid xs={12} md={1}>
              <Button
                fullWidth
                variant="contained"
                onClick={async () => {
                  if (searchCfg.username === '') {
                    fcShowMsg({
                      type: 'error',
                      msg: t('sys.search') + t('vt.require', { key: t('sys.username') }),
                    });
                    return;
                  }
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
              <Grid xs={4} my={1}>
                <Grid>{t('report.bet_total')}</Grid>
                <Grid>{t('riskHedging.target_bet_total')}</Grid>
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
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
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                <Grid> {t('report.bet_real')}</Grid>
                <Grid> {t('riskHedging.target_bet_real')}</Grid>
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
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
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                <Grid>{t('sys.count')}</Grid>
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                <Grid>{row.original.count}</Grid>
              </Grid>
            </Grid>
          );
        }}
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(RiskHedging);
