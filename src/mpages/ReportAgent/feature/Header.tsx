import { useState, useMemo, useEffect, useRef } from 'react';
import { PgListProps } from '@type/page';
import usePage from '@hooks/usePage';
import useAuth from '@hooks/useAuth';
import { apiList } from '@src/api/ReportAgent';
import { apiList as reportUserApiList } from '@api/ReportUser';
import { IResInfo } from '@src/api/ReportAgent/res';
// ant-design
import { HomeOutlined } from '@ant-design/icons';
// material-ui
import { useTheme } from '@mui/material/styles';
import SimpleTable from '@components/muiTable/MSimple';
import {
  Stack,
  Breadcrumbs,
  Link,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import GroupIcon from '@mui/icons-material/Group';
import { fcMoneyFormat, fcMoneyDecimalFormat } from '@src/utils/method';
import { StepType, ParentSearchType } from '../index';

const Header = ({
  parentSearch,
  setStep,
  setParentSearch,
}: {
  parentSearch: ParentSearchType;
  setStep: (step: StepType) => void;
  setParentSearch: (cb: (value: ParentSearchType) => ParentSearchType) => void;
}) => {
  const theme = useTheme();
  const { authState } = useAuth();
  const { t } = usePage();
  //Header Data
  const [bcList, setbcList] = useState<{ id: number; name: string }[]>([]);
  const [headerObj, setHeaderLObj] = useState<IResInfo | any>(null);
  const [agnetObj, setAgnetObj] = useState<IResInfo | any>(null);
  const [playerObj, setPlayerObj] = useState<IResInfo | any>(null);
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [betUserCount, setBetUserCount] = useState<number>(0);

  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'id',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          const total = (row.original.payoff / row.original.bet_real) * 100;
          const money_total = row.original.payoff + row.original.rebate;
          return (
            <Grid container textAlign="right">
              {/* <Grid xs={12} py={1} textAlign="left" ml={4}>
                <Grid>{t('sys.username')}</Grid>
                <Grid>{row.original.username}</Grid>
              </Grid> */}
              <Grid xs={12}>
                <Grid>{t('reportAgent.currency')}</Grid>
                <Grid>
                  {row.original.currencyMulti
                    ? t('reportAgent.currencyMulti')
                    : row.original.currency}
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.bet_real')}</Grid>
                <Grid>
                  {' '}
                  {row.original.currencyMulti ? '-' : fcMoneyFormat(row.original.bet_real)}
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.payoff')}</Grid>
                <Grid display="flex" justifyContent="right">
                  <Grid
                    style={{
                      color:
                        row.original.payoff > 0
                          ? theme.palette.error.main
                          : theme.palette.info.main,
                    }}
                  >
                    {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(row.original.payoff)}
                  </Grid>
                  <Grid
                    style={{
                      color: total > 0 ? theme.palette.error.main : theme.palette.info.main,
                      fontSize: '0.6rem',
                      lineHeight: 2.5,
                    }}
                  >
                    &nbsp;
                    {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(total.toFixed(2))}%
                  </Grid>
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.rebate')}</Grid>
                <Grid>
                  {' '}
                  {row.original.currencyMulti ? '-' : fcMoneyFormat(row.original.rebate)}
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.money_total')}</Grid>
                <Grid>
                  <div
                    style={{
                      color: money_total > 0 ? theme.palette.error.main : theme.palette.info.main,
                    }}
                  >
                    {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(money_total)}
                  </div>
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.donate')}</Grid>
                <Grid>
                  {' '}
                  {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(row.original.donate)}
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.turn_in')}</Grid>
                <Grid>
                  <div
                    style={{
                      color:
                        row.original.turn_in > 0
                          ? theme.palette.error.main
                          : theme.palette.info.main,
                    }}
                  >
                    {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(row.original.turn_in)}
                  </div>
                </Grid>
              </Grid>
              {/* <Grid xs={6}>
                <Grid>{t('report.bite_total')}</Grid>
                <Grid>
                  <div
                    style={{
                      color: total > 0 ? theme.palette.error.main : theme.palette.info.main,
                    }}
                  >
                    {fcMoneyDecimalFormat(total.toFixed(2))}%
                  </div>
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.rakeback')}</Grid>
                <Grid> {fcMoneyDecimalFormat(row.original.rakeback)}%</Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.bet_count')}</Grid>
                <Grid> {fcMoneyFormat(row.original.bet_count)}</Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.share')}</Grid>
                <Grid> {fcMoneyFormat(row.original.share)}%</Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.receivable')}</Grid>
                <Grid>
                  <div
                    style={{
                      color:
                        row.original.receivable > 0
                          ? theme.palette.error.main
                          : theme.palette.info.main,
                    }}
                  >
                    {fcMoneyDecimalFormat(row.original.receivable)}
                  </div>
                </Grid>
              </Grid> */}
            </Grid>
          );
        },
      },
    ],
    [t, theme, parentSearch, bcList, betUserCount],
  );
  // 合計
  const columnsTotal = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'id',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          const total = (row.original.payoff / row.original.bet_real) * 100;
          const money_total = row.original.payoff + row.original.rebate;
          return (
            <Grid container textAlign="right">
              <Grid xs={6}>
                <Grid>{t('report.bet_real')}</Grid>
                <Grid>
                  {' '}
                  {row.original.currencyMulti ? '-' : fcMoneyFormat(row.original.bet_real)}
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.payoff')}</Grid>
                <Grid display="flex" justifyContent="right">
                  <Grid
                    style={{
                      color:
                        row.original.payoff > 0
                          ? theme.palette.error.main
                          : theme.palette.info.main,
                    }}
                  >
                    {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(row.original.payoff)}
                  </Grid>
                  <Grid
                    style={{
                      color: total > 0 ? theme.palette.error.main : theme.palette.info.main,
                      fontSize: '0.6rem',
                      lineHeight: 2.5,
                    }}
                  >
                    &nbsp;
                    {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(total.toFixed(2))}%
                  </Grid>
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.rebate')}</Grid>
                <Grid>
                  {' '}
                  {row.original.currencyMulti ? '-' : fcMoneyFormat(row.original.rebate)}
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.money_total')}</Grid>
                <Grid>
                  <div
                    style={{
                      color: money_total > 0 ? theme.palette.error.main : theme.palette.info.main,
                    }}
                  >
                    {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(money_total)}
                  </div>
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.donate')}</Grid>
                <Grid>
                  {' '}
                  {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(row.original.donate)}
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.turn_in')}</Grid>
                <Grid>
                  <div
                    style={{
                      color:
                        row.original.turn_in > 0
                          ? theme.palette.error.main
                          : theme.palette.info.main,
                    }}
                  >
                    {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(row.original.turn_in)}
                  </div>
                </Grid>
              </Grid>

              <Grid xs={6}>
                <Grid> {t('reportAgent.betUserCount')}</Grid>
                <Grid>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={async () => {
                      try {
                        const agentPath = bcList
                          .filter((item) => item.id !== 0)
                          .map((item) => item.id)
                          .join(',');
                        const { meta } = await reportUserApiList({
                          agent_path: agentPath,
                          report_time1: parentSearch.report_time1,
                          report_time2: parentSearch.report_time2,
                          per_page: 1,
                        });
                        setBetUserCount(meta.total);
                      } catch (error: any) {
                        return Promise.reject(error);
                      }
                    }}
                  >
                    <GroupIcon />
                    {betUserCount > 0 ? betUserCount : ''}
                  </Button>
                </Grid>
              </Grid>
              <Grid xs={6}>
                <Grid>{t('report.profit')}</Grid>
                <Grid>
                  <div
                    style={{
                      color:
                        row.original.profit > 0
                          ? theme.palette.error.main
                          : theme.palette.info.main,
                    }}
                  >
                    {row.original.currencyMulti ? '-' : fcMoneyFormat(row.original.profit)}
                  </div>
                </Grid>
              </Grid>
            </Grid>
          );
        },
      },
    ],
    [t, theme, parentSearch, bcList, betUserCount],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    try {
      setLoadingFlag(true);
      const { breadcrumbs, header, header_detail } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      //Base setting
      setbcList(breadcrumbs);
      setHeaderLObj(header);
      // 1是直屬代理 2是直屬會員
      setAgnetObj(header_detail[1]);
      setPlayerObj(header_detail[2]);
      setLoadingFlag(false);
    } catch (error: any) {
      setLoadingFlag(false);
      throw error;
    }
  };
  useEffect(() => {
    fcGetList({ pageIndex: 0, pageSize: 1, searchCfg: { ...parentSearch } });
    setBetUserCount(0);
  }, [parentSearch.pid]);

  useEffect(() => {
    if (parentSearch.forceUpdate === 0) return;
    fcGetList({ pageIndex: 0, pageSize: 1, searchCfg: { ...parentSearch } });
  }, [parentSearch.forceUpdate]);

  return (
    <Grid my={3} spacing={2}>
      <Stack my={2}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          {bcList.map((item, index) => {
            return bcList.length === index + 1 ? (
              <Typography key={index} color="text.primary">
                {item.name}
              </Typography>
            ) : item.id === 0 ? (
              <Link
                key={index}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  if (authState.user?.backstage === 2) return;
                  setParentSearch((prevState) => ({
                    ...prevState,
                    pid: '',
                  }));
                  setStep('home');
                }}
              >
                <HomeOutlined />
              </Link>
            ) : (
              <Link
                key={index}
                style={{ cursor: 'pointer' }}
                underline="hover"
                color="inherit"
                onClick={() => {
                  setParentSearch((prevState) => ({
                    ...prevState,
                    pid: item.id.toString(),
                  }));
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Stack>
      {agnetObj && (
        <Accordion defaultExpanded style={{ border: 'none ' }}>
          <AccordionSummary expandIcon={null}>
            <Grid xs={12} display="flex" justifyContent="space-between" style={{ width: '100%' }}>
              <Typography>{t('reportAgent.agentWinlose')}</Typography>
              <ExpandMoreIcon />
            </Grid>
          </AccordionSummary>
          <AccordionDetails style={{ border: 'none ', padding: 0 }}>
            <Grid mt={0.5} spacing={2}>
              <SimpleTable
                columns={columns}
                data={[agnetObj]}
                loadingFlag={loadingFlag}
                detailPanelCfg={{
                  enableExpandAll: false,
                  enableExpanding: false,
                }}
              />
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
      {playerObj && (
        <Accordion defaultExpanded style={{ border: 'none ' }}>
          <AccordionSummary expandIcon={null}>
            <Grid xs={12} display="flex" justifyContent="space-between" style={{ width: '100%' }}>
              <Typography>{t('reportAgent.playerWinlose')} </Typography>
              <ExpandMoreIcon />
            </Grid>
          </AccordionSummary>
          <AccordionDetails style={{ border: 'none ', padding: 0 }}>
            <Grid mt={0.5} spacing={2}>
              <SimpleTable
                columns={columns}
                data={[playerObj]}
                loadingFlag={loadingFlag}
                detailPanelCfg={{
                  enableExpandAll: false,
                  enableExpanding: false,
                }}
              />
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
      {headerObj && (
        <Accordion defaultExpanded style={{ border: 'none ' }}>
          <AccordionSummary expandIcon={null}>
            <Grid xs={12} display="flex" justifyContent="space-between" style={{ width: '100%' }}>
              <Typography>{t('sys.total')}</Typography>
              <ExpandMoreIcon />
            </Grid>
          </AccordionSummary>
          <AccordionDetails style={{ border: 'none ', padding: 0 }}>
            <Grid mt={0.5} spacing={2}>
              <SimpleTable
                columns={columnsTotal}
                data={[headerObj]}
                loadingFlag={loadingFlag}
                detailPanelCfg={{
                  enableExpandAll: false,
                  enableExpanding: false,
                }}
              />
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </Grid>
  );
};

export default Header;
