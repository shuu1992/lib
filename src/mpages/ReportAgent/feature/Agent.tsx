import { useState, useMemo, useEffect, useRef } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList } from '@api/ReportAgent';
import { IResInfo, IResFooter } from '@api/ReportAgent/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Link, Divider } from '@mui/material';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';

// custom Components
import PageTable from '@components/muiTable/MBase';
import { AgentExcel } from '@pages/ReportAgent/excel/AgentExcel';
import { fcMoneyFormat, fcMoneyDecimalFormat } from '@src/utils/method';
import { ParentSearchProps } from '../index';

interface ICustomerResFooter extends IResFooter {
  money_total: number;
  bite_total: number;
}
const ReportTabAgent = ({
  parentSearch,
  setStep,
  setParentSearch,
  pageHocProps = defaultPageHocProps,
}: WithPageHocProps & ParentSearchProps) => {
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
  // 是否初始或過
  const initRef = useRef(false);
  const [footerObj, setFooterObj] = useState<ICustomerResFooter>({
    bet_count: 0,
    bet_real: 0,
    bet_total: 0,
    donate: 0,
    payoff: 0,
    profit: 0,
    rebate: 0,
    receivable: 0,
    turn_in: 0,
    money_total: 0,
    bite_total: 0,
  });
  // 小計
  const [subFooterObj, setSubFooterObj] = useState<ICustomerResFooter>({
    bet_count: 0,
    bet_real: 0,
    bet_total: 0,
    donate: 0,
    payoff: 0,
    profit: 0,
    rebate: 0,
    receivable: 0,
    turn_in: 0,
    money_total: 0,
    bite_total: 0,
  });
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({});

  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'agent_id',
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
          const total = (row.original.payoff / row.original.bet_real) * 100;
          const money_total = row.original.payoff + row.original.rebate;
          return (
            <Grid
              container
              spacing={2}
              textAlign="right"
              alignItems="center"
              style={{ minWidth: '75vw' }}
            >
              <Grid container xs={12}>
                <Grid xs={6}>
                  <Grid display="flex" alignItems="center">
                    <Person2OutlinedIcon />
                    <Link
                      underline="always"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setParentSearch((prevState) => ({
                          ...prevState,
                          pid: row.original.agent_id,
                        }));
                      }}
                    >
                      {row.original.username}
                    </Link>
                    &nbsp; ({row.original.name})
                  </Grid>
                </Grid>
                <Grid xs={6}>
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
                  <Grid display="flex" justifyContent="end">
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
                    {row.original.currencyMulti ? '-' : fcMoneyFormat(row.original.rebate)}
                  </Grid>
                </Grid>
                {/* <Grid xs={6}>
                  <Grid>{t('report.bet_count')}</Grid>
                  <Grid> {fcMoneyFormat(row.original.bet_count)}</Grid>
                </Grid>
                <Grid xs={6}>
                  <Grid>{t('report.bet_total')}</Grid>
                  <Grid> {fcMoneyFormat(row.original.bet_total)}</Grid>
                </Grid> */}

                <Grid xs={6}>
                  <Grid> {t('report.money_total')}</Grid>
                  <Grid
                    style={{
                      color: money_total > 0 ? theme.palette.error.main : theme.palette.info.main,
                    }}
                  >
                    {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(money_total)}
                  </Grid>
                </Grid>
                <Grid xs={6}>
                  <Grid>{t('report.donate')}</Grid>
                  <Grid>
                    {' '}
                    {row.original.currencyMulti ? '-' : fcMoneyFormat(row.original.donate)}
                  </Grid>
                </Grid>
                <Grid xs={6}>
                  <Grid>{t('report.turn_in')}</Grid>
                  <Grid
                    style={{
                      color:
                        row.original.turn_in > 0
                          ? theme.palette.error.main
                          : theme.palette.info.main,
                    }}
                  >
                    {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(row.original.turn_in)}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        },
        Footer: ({ table }: { table: any }) => {
          return (
            <Grid container spacing={2} textAlign="center" alignItems="center">
              <Grid
                container
                spacing={2}
                py={1}
                alignItems="center"
                style={{
                  width: '100%',
                }}
              >
                <Grid xs={12} textAlign="left">
                  {t('sys.subtotal')}
                </Grid>
                <Grid xs={12}>
                  <Divider />
                </Grid>
                <Grid container xs={12}>
                  {/* <Grid xs={5}>
                    <Grid>{t('report.bet_total')}</Grid>
                    <Grid
                      style={{
                        color: subFooterObj.bet_total >= 0 ? '' : theme.palette.error.main,
                      }}
                    >
                      {fcMoneyFormat(subFooterObj.bet_total)}
                    </Grid>
                  </Grid> */}
                  {/* <Grid xs={5}>
                    <Grid> {t('report.payoff')}</Grid>
                    <Grid
                      style={{
                        color:
                          subFooterObj.payoff > 0
                            ? theme.palette.error.main
                            : theme.palette.info.main,
                      }}
                    >
                      {fcMoneyDecimalFormat(subFooterObj.payoff)}
                    </Grid>
                  </Grid> */}

                  <Grid xs={3.5} xsOffset={2.5}>
                    <Grid>{t('report.bet_real')}</Grid>
                    <Grid>
                      <div>{fcMoneyFormat(subFooterObj.bet_real)}</div>
                    </Grid>
                  </Grid>
                  <Grid xs={5} xsOffset={1}>
                    <Grid> {t('report.money_total')}</Grid>
                    <Grid
                      style={{
                        color:
                          subFooterObj.money_total > 0
                            ? theme.palette.error.main
                            : theme.palette.info.main,
                      }}
                    >
                      {fcMoneyDecimalFormat(subFooterObj.money_total)}
                    </Grid>
                  </Grid>
                  {/* <Grid xs={5}>
                    <Grid>{t('report.rebate')}</Grid>
                    <Grid>
                      <div> -&nbsp;/&nbsp;{fcMoneyFormat(subFooterObj.rebate)}</div>
                    </Grid>
                  </Grid> */}
                  <Grid xs={3.5} xsOffset={2.5}>
                    <Grid>{t('report.donate')}</Grid>
                    <Grid>{fcMoneyFormat(subFooterObj.donate)}</Grid>
                  </Grid>
                  <Grid xs={5} xsOffset={1}>
                    <Grid>{t('report.turn_in')}</Grid>
                    <Grid
                      style={{
                        color:
                          subFooterObj.turn_in > 0
                            ? theme.palette.error.main
                            : theme.palette.info.main,
                      }}
                    >
                      {fcMoneyDecimalFormat(subFooterObj.turn_in)}
                    </Grid>
                  </Grid>

                  {/* <Grid xs={5}>
                    <Grid>{t('report.profit')}</Grid>
                    <Grid
                      style={{
                        color:
                          subFooterObj.profit > 0
                            ? theme.palette.error.main
                            : theme.palette.info.main,
                      }}
                    >
                      {fcMoneyFormat(subFooterObj.profit)}
                    </Grid>
                  </Grid> */}
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                py={1}
                alignItems="center"
                style={{
                  width: '100%',
                }}
              >
                <Grid xs={12} textAlign="left">
                  {t('sys.total')}
                </Grid>
                <Grid xs={12}>
                  <Divider />
                </Grid>
                <Grid container xs={12}>
                  {/* <Grid xs={6}>
                    <Grid>{t('report.bet_total')}</Grid>
                    <Grid
                      style={{
                        color: footerObj.bet_total >= 0 ? '' : theme.palette.error.main,
                      }}
                    >
                      {fcMoneyFormat(footerObj.bet_total)}
                    </Grid>
                  </Grid> */}
                  {/* <Grid xs={6}>
                    <Grid> {t('report.payoff')}</Grid>
                    <Grid
                      style={{
                        color:
                          footerObj.payoff > 0 ? theme.palette.error.main : theme.palette.info.main,
                      }}
                    >
                      {fcMoneyDecimalFormat(footerObj.payoff)}
                    </Grid>
                  </Grid> */}
                  <Grid xs={3.5} xsOffset={2.5}>
                    <Grid>{t('report.bet_real')}</Grid>
                    <Grid>
                      <div>{fcMoneyFormat(footerObj.bet_real)}</div>
                    </Grid>
                  </Grid>
                  <Grid xs={5} xsOffset={1}>
                    <Grid> {t('report.money_total')}</Grid>
                    <Grid
                      style={{
                        color:
                          footerObj.money_total > 0
                            ? theme.palette.error.main
                            : theme.palette.info.main,
                      }}
                    >
                      {fcMoneyDecimalFormat(footerObj.money_total)}
                    </Grid>
                  </Grid>
                  {/* <Grid xs={6}>
                    <Grid>{t('report.rebate')}</Grid>
                    <Grid>
                      <div> -&nbsp;/&nbsp;{fcMoneyFormat(footerObj.rebate)}</div>
                    </Grid>
                  </Grid> */}

                  <Grid xs={3.5} xsOffset={2.5}>
                    <Grid>{t('report.donate')}</Grid>
                    <Grid>{fcMoneyFormat(footerObj.donate)}</Grid>
                  </Grid>
                  <Grid xs={5} xsOffset={1}>
                    <Grid>{t('report.turn_in')}</Grid>
                    <Grid
                      style={{
                        color:
                          footerObj.turn_in > 0
                            ? theme.palette.error.main
                            : theme.palette.info.main,
                      }}
                    >
                      {fcMoneyDecimalFormat(footerObj.turn_in)}
                    </Grid>
                  </Grid>
                  {/* <Grid xs={6}>
                    <Grid>{t('report.profit')}</Grid>
                    <Grid
                      style={{
                        color:
                          footerObj.profit > 0 ? theme.palette.error.main : theme.palette.info.main,
                      }}
                    >
                      {fcMoneyFormat(footerObj.profit)}
                    </Grid>
                  </Grid> */}
                </Grid>
              </Grid>
            </Grid>
          );
        },
      },
    ],
    [t, theme, allPermission, parentSearch, footerObj],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, meta, footer } = await apiList({
        ...parentSearch,
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      const subFooter: ICustomerResFooter = {
        bet_count: 0,
        bet_real: 0,
        bet_total: 0,
        donate: 0,
        payoff: 0,
        profit: 0,
        rebate: 0,
        receivable: 0,
        turn_in: 0,
        money_total: 0,
        bite_total: 0,
      };
      data.map((item: any) => {
        subFooter.bet_count += item.bet_count;
        subFooter.bet_real += item.bet_real;
        subFooter.bet_total += item.bet_total;
        subFooter.donate += item.donate;
        subFooter.payoff += item.payoff;
        subFooter.profit += item.profit;
        subFooter.rebate += item.rebate;
        subFooter.receivable += item.receivable;
        subFooter.turn_in += item.turn_in;
      });
      subFooter.money_total = subFooter.payoff + subFooter.rebate;
      subFooter.bite_total =
        subFooter.bet_real > 0
          ? parseFloat(((subFooter.payoff / subFooter.bet_real) * 100).toFixed(2))
          : 0;
      footer.bite_total =
        footer.bet_real > 0 ? parseFloat(((footer.payoff / footer.bet_real) * 100).toFixed(2)) : 0;
      footer.money_total = footer.payoff + footer.rebate;
      //Base setting
      setFooterObj(footer);
      setSubFooterObj(subFooter);
      initRef.current = true;
      setPgCfg((prevState: PgCfgProps) => ({
        ...prevState,
        pageTotal: meta.total,
      }));
      setDataList((prevState: IResInfo[]) => data);
      setLoadingFlag(false);
    } catch (error: any) {
      setLoadingFlag(false);
      setFooterObj((prevState: ICustomerResFooter) => ({
        ...prevState,
        bet_count: 0,
        bet_real: 0,
        bet_total: 0,
        donate: 0,
        payoff: 0,
        profit: 0,
        rebate: 0,
        receivable: 0,
        turn_in: 0,
        money_total: 0,
        bite_total: 0,
      }));
      setSubFooterObj((prevState: ICustomerResFooter) => ({
        ...prevState,
        bet_count: 0,
        bet_real: 0,
        bet_total: 0,
        donate: 0,
        payoff: 0,
        profit: 0,
        rebate: 0,
        receivable: 0,
        turn_in: 0,
        money_total: 0,
        bite_total: 0,
      }));
      throw error;
    }
  };

  useEffect(() => {
    if (!initRef.current) return;
    setPgCfg((prevState: PgCfgProps) => ({
      ...prevState,
      pageIndex: 0,
    }));
    fcGetList({
      ...pgCfg,
      searchCfg: { ...searchCfg, ...tSearchCfg },
    });
  }, [parentSearch.pid]);

  useEffect(() => {
    if (parentSearch.forceUpdate === 0) return;
    fcGetList({ ...pgCfg, searchCfg: { ...searchCfg, ...tSearchCfg } });
  }, [parentSearch.forceUpdate]);

  return (
    <Grid>
      <PageTable
        columns={columns}
        data={dataList}
        loadingFlag={loadingFlag}
        searchExpandCfg={{ flag: true, enable: false }}
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
          flag: allPermission.includes('report.agent.export'),
          excelHeader: AgentExcel,
          title: `${t('menu.reportAgent')} ${parentSearch.report_time1} - ${
            parentSearch.report_time2
          }`,
          fileName: `${t('menu.reportAgent')} ${parentSearch.report_time1}`,
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
              excelData.forEach((item: any) => {
                item.bite_total = ((item.payoff / item.bet_real) * 100).toFixed(2) + '%';
                item.money_total = item.payoff + item.rebate;
              });
              return Promise.resolve({ excelData });
            } catch (error) {
              throw error;
            }
          },
        }}
        renderDetailPanel={({ row }: { row: any }) => {
          return (
            <Grid container p={0.5}>
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
                {t('report.share')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                {fcMoneyFormat(row.original.share)}%
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
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('report.profit')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                <div
                  style={{
                    color:
                      row.original.profit > 0 ? theme.palette.error.main : theme.palette.info.main,
                  }}
                >
                  {fcMoneyFormat(row.original.profit)}
                </div>
              </Grid>
            </Grid>
          );
        }}
      />
    </Grid>
  );
};

export default withPageHoc(ReportTabAgent);
