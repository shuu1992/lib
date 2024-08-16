import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiAnalyze } from '@api/RiskAnalysis';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/RiskAnalysis/req';
import { IResAnalyze, IResInfo } from '@api/RiskAnalysis/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// custom Components
import { omitBy } from 'lodash';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/MBase';
import SearchOutLine from '@components/search/InputOutline';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import PieChart from '@pages/RiskAnalysis/feature/PieChart';
import BarChart from '@pages/RiskAnalysis/feature/BarChart';
import Loader from '@components/loading/Circle';
import { fcMoneyFormat } from '@src/utils/method';

const Modal = new ModalController();

const RiskAnalysis = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const [collapse, setCollapse] = useState<boolean>(true);
  const [analyzeObj, setAnalyzeObj] = useState<IResAnalyze>({
    avg_total: 0,
    banker_count: 0,
    banker_total: 0,
    bet_count: 0,
    bet_total: 0,
    game_count: 0,
    lose_avg: 0,
    lose_count: 0,
    lose_total: 0,
    payoff: 0,
    player_count: 0,
    player_total: 0,
    win_avg: 0,
    win_count: 0,
    win_total: 0,
  });
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    username: '',
    game_rate: '10',
    total_rate: '10',
    report_time1: '',
    report_time2: '',
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
            >
              <Grid xs={2.5} textAlign="center">
                {row.original.id}
              </Grid>
              <Grid container xs={9.5}>
                <Grid xs={6}>
                  <Grid>{t('sys.username')}</Grid>
                  <Grid> {row.original.username}</Grid>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <Grid>{t('riskAnalysis.count')}</Grid>
                  <Grid>{fcMoneyFormat(row.original.count)}</Grid>
                </Grid>
                <Grid xs={6}>
                  <Grid>{t('riskAnalysis.same_count')}</Grid>
                  <Grid>{fcMoneyFormat(row.original.same_count)}</Grid>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <Grid>{t('riskAnalysis.same_bet_total')}</Grid>
                  <Grid>{fcMoneyFormat(row.original.same_bet_total)}</Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        },
      },
    ],
    [t, theme, allPermission],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    const requireParam = Object.keys(omitBy(searchCfg, (v: any) => v === '')).filter(
      (v) => v !== 'game_rate' && v !== 'total_rate',
    );
    if (requireParam.length === 0) {
      return;
    }
    setLoadingFlag(true);
    try {
      const { data, meta } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      if (pageIndex === 0) {
        const { data: analyzeData } = await apiAnalyze({
          ...searchCfg,
        });
        setAnalyzeObj((prevState: IResAnalyze) => analyzeData);
      }
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
    <div>
      {loadingFlag && <Loader />}
      <Grid container xs={12}>
        <Grid xs={12} my={1}>
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
        <Grid xs={6} my={1}>
          <SearchOutLine
            type="number"
            placeholder={t('riskAnalysis.game_rate')}
            value={searchCfg.game_rate || ''}
            setValue={(value: string) => {
              setSearchCfg((prevState) => ({
                ...prevState,
                game_rate: value,
              }));
            }}
          />
        </Grid>
        <Grid xs={6} my={1}>
          <SearchOutLine
            type="number"
            placeholder={t('riskAnalysis.total_rate')}
            value={searchCfg.total_rate || ''}
            setValue={(value: string) => {
              setSearchCfg((prevState) => ({
                ...prevState,
                total_rate: value,
              }));
            }}
          />
        </Grid>
        <Grid xs={12} my={1}>
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
        <Grid xs={12} my={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={async () => {
              if (
                Object.keys(omitBy(searchCfg, (v: any) => v === '')).length !==
                Object.keys(searchCfg).length
              ) {
                fcShowMsg({
                  type: 'error',
                  msg: t('vt.require', {
                    key: `${t('sys.username')},${t('sys.search_time')},${t(
                      'riskAnalysis.game_rate',
                    )},${t('riskAnalysis.total_rate')}`,
                  }),
                });
                return;
              }
              fcGetList({
                ...pgCfg,
                searchCfg: { ...searchCfg, ...tSearchCfg },
              });
            }}
          >
            {t('sys.search')}
          </Button>
        </Grid>
      </Grid>
      <Grid my={1}>
        <Accordion style={{ border: 'none ' }}>
          <AccordionSummary aria-controls="panel-content" id="panel-header" expandIcon={null}>
            <Grid container style={{ width: '100%' }}>
              <Grid xs={6}>{t('sys.chart')}</Grid>
              <Grid xs={6} textAlign="right">
                <ExpandMoreIcon />
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails style={{ border: 'none ' }}>
            <Grid container xs={12} spacing={0} mt={2} mb={4}>
              <Grid container xs={12} mb={2}>
                <Grid xs={6} md={3} p={2}>
                  <Typography variant="h5" textAlign="center">
                    {t('riskAnalysis.game_count')}
                  </Typography>
                  <Typography variant="h6" textAlign="center">
                    {fcMoneyFormat(analyzeObj.game_count)}
                  </Typography>
                </Grid>
                <Grid xs={6} md={3} p={2}>
                  <Typography variant="h5" textAlign="center">
                    {t('riskAnalysis.bet_count')}
                  </Typography>
                  <Typography variant="h6" textAlign="center">
                    {fcMoneyFormat(analyzeObj.bet_count)}
                  </Typography>
                </Grid>
                <Grid xs={6} md={3} p={2}>
                  <Typography variant="h5" textAlign="center">
                    {t('riskAnalysis.bet_total')}
                  </Typography>
                  <Typography variant="h6" textAlign="center">
                    {fcMoneyFormat(analyzeObj.bet_total)}
                  </Typography>
                </Grid>
                <Grid xs={6} md={3} p={2}>
                  <Typography variant="h5" textAlign="center">
                    {t('riskAnalysis.payoff')}
                  </Typography>
                  <Typography variant="h6" textAlign="center">
                    {fcMoneyFormat(analyzeObj.payoff)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                xs={12}
                md={6}
                sx={{
                  borderRight: `3px solid ${theme.palette.divider}`,
                }}
                p={2}
              >
                <Typography variant="h5">{t('riskAnalysis.betRatio')}</Typography>
                <PieChart bank={analyzeObj.banker_count} player={analyzeObj.player_count} />
              </Grid>
              <Grid xs={12} md={6} p={2}>
                <Typography variant="h5">{t('riskAnalysis.betAmountRatio')}</Typography>
                <PieChart bank={analyzeObj.banker_total} player={analyzeObj.player_total} />
              </Grid>
              <Grid
                xs={12}
                textAlign="center"
                m={2}
                p={2}
                sx={{
                  borderBottom: `3px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h5">
                  {t('sys.banker')} / {t('sys.player')} {t('riskAnalysis.avgBet')} :
                  <span style={{ marginLeft: '5px', color: theme.palette.error.main }}>
                    {analyzeObj.avg_total}
                  </span>
                </Typography>
              </Grid>
              <Grid xs={12} md={4} p={2}>
                <Typography variant="h5" textAlign="center">
                  {t('sys.banker')} / {t('sys.player')} {t('riskAnalysis.winloseBet')}:
                </Typography>
                <Grid xs={12} sx={{ height: '50px' }} mt={2}>
                  <BarChart win={analyzeObj.win_count} lose={analyzeObj.lose_count} />
                </Grid>
              </Grid>
              <Grid xs={12} md={4} p={2}>
                <Typography variant="h5" textAlign="center">
                  {t('sys.banker')} / {t('sys.player')} {t('riskAnalysis.winloseBetAmout')}:
                </Typography>
                <Grid xs={12} sx={{ height: '50px' }} mt={2}>
                  <BarChart
                    win={analyzeObj.win_avg}
                    lose={analyzeObj.lose_avg}
                    disableTotal={true}
                  />
                </Grid>
              </Grid>
              <Grid xs={12} md={4} p={2}>
                <Typography variant="h5" textAlign="center">
                  {t('sys.banker')} / {t('sys.player')} {t('riskAnalysis.payoffAmount')}:
                </Typography>
                <Grid xs={12} sx={{ height: '50px' }} mt={2}>
                  <BarChart win={analyzeObj.win_total} lose={analyzeObj.lose_total} />
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
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
        addCfg={{
          flag: allPermission.includes('copyPermisin.store'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {},
        }}
        renderDetailPanel={({ row }: { row: any }) => {
          return (
            <Grid container p={0.5}>
              <Grid xs={4} my={1}>
                {t('riskAnalysis.total_rate')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                {fcMoneyFormat(row.original.total_rate)}%
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('riskAnalysis.same_bet_total')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                {fcMoneyFormat(row.original.same_bet_total)}%
              </Grid>
            </Grid>
          );
        }}
      />
    </div>
  );
};

export default withPageHoc(RiskAnalysis);
