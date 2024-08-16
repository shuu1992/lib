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
import { Button, Typography, Link } from '@mui/material';
// custom Components
import dayjs from 'dayjs';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import SearchOutLine from '@components/search/InputOutline';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import { fcMoneyFormat } from '@src/utils/method';
import Detail from '../../feature/Detail';

export interface IRiskHedgingRcSearchProps {
  username?: string;
  game_no?: string;
  report_time1?: string;
  report_time2?: string;
}
const Modal = new ModalController();

const RiskHedging = ({
  defaultSearchProps,
  pageHocProps = defaultPageHocProps,
}: WithPageHocProps & { defaultSearchProps: IRiskHedgingRcSearchProps }) => {
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
    username: defaultSearchProps.username || '',
    game_no: defaultSearchProps.game_no || '',
    report_time1: defaultSearchProps.report_time1 || dayjs(sysTime).format('YYYY-MM-DD 00:00:00'),
    report_time2: defaultSearchProps.report_time2 || dayjs(sysTime).format('YYYY-MM-DD 23:59:59'),
  });

  const columns = useMemo(
    () => [
      {
        Header: ({ column }: { column: any }) => (
          <div>
            <div>{t('sys.uid')}</div>
            <div>{t('riskHedging.target_uid')}</div>
          </div>
        ),
        header: t('sys.uid'),
        accessorKey: 'uid',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <Typography
                sx={{
                  color: theme.palette.info.main,
                }}
              >
                {row.original.uid}
              </Typography>
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
            </div>
          );
        },
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
        header: t('sys.count'),
        accessorKey: 'count',
        enableColumnFilter: false,
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
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(RiskHedging);
