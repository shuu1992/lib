import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList } from '@api/ReportAgent';
import { IResInfo, IResFooter } from '@api/ReportAgent/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Link, Button } from '@mui/material';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import SelectOutline from '@components/search/SelectOutline';
import SearchDateReportPicker from '@components/search/DateReportPicker';
import { fcMoneyFormat, fcMoneyDecimalFormat } from '@src/utils/method';
import { AgentExcel } from './excel/AgentExcel';
import { ParentSearchProps } from './index';

const Modal = new ModalController();

const ReportAgentHome = ({
  setStep,
  parentSearch,
  setParentSearch,
  roomList,
  setRoomList,
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
  const [footerObj, setFooterObj] = useState<IResFooter>({
    bet_count: 0,
    bet_real: 0,
    bet_total: 0,
    donate: 0,
    payoff: 0,
    profit: 0,
    rebate: 0,
    receivable: 0,
    turn_in: 0,
  });
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({});

  const columns = useMemo(
    () => [
      {
        header: t('sys.id'),
        accessorKey: 'agent_id',
        enableColumnFilter: false,
        Footer: () => (
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {t('sys.sum')}
          </div>
        ),
      },
      {
        header: t('sys.username'),
        accessorKey: 'username',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Link
              underline="always"
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setParentSearch((prevState) => ({
                  ...prevState,
                  pid: row.getValue('agent_id'),
                }));
                setStep('sub');
              }}
            >
              {row.getValue('username')}
            </Link>
          );
        },
        Footer: () => (
          <div
            style={{
              textAlign: 'center',
            }}
          >
            -
          </div>
        ),
      },
      {
        header: t('reportAgent.currency'),
        accessorKey: 'currency',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return row.original.currencyMulti
            ? t('reportAgent.currencyMulti')
            : row.original.currency;
        },
      },
      {
        header: t('report.bet_count'),
        accessorKey: 'bet_count',
        enableColumnFilter: false,
        enableClickToCopy: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                textAlign: 'right',
              }}
            >
              {fcMoneyFormat(row.getValue('bet_count'))}
            </div>
          );
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.bet_count)}</div>,
      },
      {
        header: t('report.bet_total'),
        accessorKey: 'bet_total',
        enableColumnFilter: false,
        enableClickToCopy: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                textAlign: 'right',
              }}
            >
              {row.original.currencyMulti ? '-' : fcMoneyFormat(row.getValue('bet_total'))}
            </div>
          );
        },
        Footer: () => (
          <div
            style={{
              color: footerObj.bet_total >= 0 ? '' : theme.palette.error.main,
            }}
          >
            {fcMoneyFormat(footerObj.bet_total)}
          </div>
        ),
      },
      {
        header: t('report.payoff'),
        accessorKey: 'payoff',
        enableColumnFilter: false,
        enableClickToCopy: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                textAlign: 'right',
                color:
                  row.getValue('payoff') > 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(row.getValue('payoff'))}
            </div>
          );
        },
        Footer: () => (
          <div
            style={{
              color: footerObj.payoff > 0 ? theme.palette.error.main : theme.palette.info.main,
            }}
          >
            {fcMoneyDecimalFormat(footerObj.payoff)}
          </div>
        ),
      },
      {
        header: t('report.bite_total'),
        enableColumnFilter: false,
        enableClickToCopy: true,
        muiTableBodyCellProps: {
          align: 'right',
        },
        accessorFn: (row: any) => {
          const total = (row.payoff / row.bet_real) * 100;
          return total;
        },
        Cell: ({ row }: { row: any }) => {
          const total = (row.getValue('payoff') / row.getValue('bet_real')) * 100;
          return (
            <div
              style={{
                color: total > 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {row.original.currencyMulti ? '-' : `${fcMoneyDecimalFormat(total.toFixed(2))}%`}
            </div>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('report.bet_real'),
        accessorKey: 'bet_real',
        enableColumnFilter: false,
        enableClickToCopy: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                textAlign: 'right',
              }}
            >
              {row.original.currencyMulti ? '-' : fcMoneyFormat(row.getValue('bet_real'))}
            </div>
          );
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.bet_real)}</div>,
      },
      {
        header: `${t('report.rakeback')} / ${t('report.rebate')}`,
        accessorKey: 'rebate',
        enableColumnFilter: false,
        enableClickToCopy: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                textAlign: 'right',
              }}
            >
              {fcMoneyDecimalFormat(row.original.rakeback)}%&nbsp;/&nbsp;
              {row.original.currencyMulti ? '-' : fcMoneyFormat(row.getValue('rebate'))}
            </div>
          );
        },
        Footer: () => <div> -&nbsp;/&nbsp;{fcMoneyFormat(footerObj.rebate)}</div>,
      },
      {
        header: t('report.money_total'),
        enableColumnFilter: false,
        enableClickToCopy: false,
        accessorFn: (row: any) => {
          const total = parseFloat(row.payoff) - parseFloat(row.rebate);
          return total;
        },
        Cell: ({ row }: { row: any }) => {
          const money_total = row.getValue('payoff') + row.getValue('rebate');
          return (
            <div
              style={{
                textAlign: 'right',
                color: money_total > 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(money_total)}
            </div>
          );
        },
        Footer: () => (
          <div
            style={{
              textAlign: 'center',
            }}
          >
            -
          </div>
        ),
      },
      {
        header: t('report.share'),
        accessorKey: 'share',
        enableColumnFilter: false,
        enableClickToCopy: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <div> {fcMoneyFormat(row.getValue('share'))}%</div>
            </div>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('report.turn_in'),
        accessorKey: 'turn_in',
        enableColumnFilter: false,
        enableClickToCopy: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                textAlign: 'right',
                color:
                  row.getValue('turn_in') > 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(row.getValue('turn_in'))}
            </div>
          );
        },
        Footer: () => (
          <div
            style={{
              color: footerObj.turn_in > 0 ? theme.palette.error.main : theme.palette.info.main,
            }}
          >
            {fcMoneyDecimalFormat(footerObj.turn_in)}
          </div>
        ),
      },
      {
        header: t('report.donate'),
        accessorKey: 'donate',
        enableColumnFilter: false,
        enableClickToCopy: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                textAlign: 'right',
              }}
            >
              {row.original.currencyMulti ? '-' : fcMoneyFormat(row.getValue('donate'))}
            </div>
          );
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.donate)}</div>,
      },
      {
        header: t('report.profit'),
        accessorKey: 'profit',
        enableColumnFilter: false,
        enableClickToCopy: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                textAlign: 'right',
                color:
                  row.getValue('profit') > 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {row.original.currencyMulti ? '-' : fcMoneyFormat(row.getValue('profit'))}
            </div>
          );
        },
        Footer: () => (
          <div
            style={{
              color: footerObj.profit > 0 ? theme.palette.error.main : theme.palette.info.main,
            }}
          >
            {fcMoneyFormat(footerObj.profit)}
          </div>
        ),
      },
    ],
    [t, theme, allPermission, parentSearch, footerObj],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    setFooterObj((prevState: IResFooter) => ({
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
    }));
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
      setFooterObj(footer);
      //Search Cfg
      setRoomList(roomList);
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
        rebate: 0,
        receivable: 0,
        turn_in: 0,
        donate: 0,
      }));
      throw error;
    }
  };

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
          flag: allPermission.includes('report.general_agent.export'),
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
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(ReportAgentHome);
