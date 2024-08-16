import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList } from '@src/api/ReportUser';
import { IList, IInfo, IAdd, IEdit, IDel } from '@src/api/ReportUser/req';
import { IResInfo, IResFooter } from '@src/api/ReportUser/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Typography, Link } from '@mui/material';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import BetRecord from '@pages/GameBetRecord/component/BetRecord';
import { fcMoneyFormat, fcMoneyDecimalFormat } from '@src/utils/method';
import { MemberExcel } from '../excel/MemberExcel';
import { ParentSearchProps } from '../index';

const Modal = new ModalController();
const Member = ({
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
  const [footerObj, setFooterObj] = useState<IResFooter>({
    bet_count: 0,
    bet_real: 0,
    bet_total: 0,
    donate: 0,
    payoff: 0,
    payout: 0,
    rebate: 0,
    turn_in: 0,
  });
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    agent_id: parentSearch.pid,
  });

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
        muiFilterTextFieldProps: { placeholder: t('sys.username') },
        muiTableFooterCellProps: {
          align: 'center',
        },
        Cell: ({ row }: { row: any }) => {
          return (
            <Link
              color={'primary'}
              underline={'always'}
              sx={{ cursor: 'pointer' }}
              onClick={async () => {
                if (editLoading) return;
                await Modal.open(BetRecord, {
                  defaultSearchProps: {
                    username: row.original.username,
                    report_time1: parentSearch.report_time1,
                    report_time2: parentSearch.report_time2,
                  },
                });
              }}
            >
              {row.original.username}
            </Link>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('sys.name'),
        accessorKey: 'name',
        enableColumnFilter: false,
        Footer: () => <div>-</div>,
      },
      {
        header: t('report.bet_count'),
        accessorKey: 'bet_count',
        enableClickToCopy: true,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{
                color:
                  row.getValue('bet_count') > 1000
                    ? theme.palette.error.main
                    : theme.palette.info.main,
              }}
            >
              {fcMoneyFormat(row.getValue('bet_count'))}
            </Typography>
          );
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.bet_count)}</div>,
      },
      {
        header: t('report.bet_total'),
        accessorKey: 'bet_total',
        enableClickToCopy: true,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
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
        enableClickToCopy: true,
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
        enableClickToCopy: true,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyDecimalFormat(row.getValue('payout'))}</div>;
        },
        Footer: () => <div>{fcMoneyDecimalFormat(footerObj.payout)}</div>,
      },
      {
        header: t('report.payoff'),
        accessorKey: 'payoff',
        enableClickToCopy: true,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                color:
                  row.getValue('payoff') > 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {fcMoneyDecimalFormat(row.getValue('payoff'))}
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
              {fcMoneyDecimalFormat(total.toFixed(2))}%
            </div>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        header: `${t('report.rakeback')} / ${t('report.rebate')}`,
        accessorKey: 'rebate',
        enableColumnFilter: false,
        enableClickToCopy: true,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              {fcMoneyDecimalFormat(row.original.rakeback)}%&nbsp;/&nbsp;
              {fcMoneyDecimalFormat(row.getValue('rebate'))}
            </div>
          );
        },
        Footer: () => <div> -&nbsp;/&nbsp;{fcMoneyDecimalFormat(footerObj.rebate)}</div>,
      },
      {
        header: t('report.turn_in'),
        accessorKey: 'turn_in',
        enableColumnFilter: false,
        enableClickToCopy: true,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                color:
                  row.getValue('turn_in') > 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {fcMoneyDecimalFormat(row.getValue('turn_in'))}
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
        enableClickToCopy: true,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('donate'))}</div>;
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.donate)}</div>,
      },
    ],
    [t, theme, allPermission, editLoading, parentSearch, footerObj],
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
      //Base setting
      setFooterObj(footer);
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
        donate: 0,
        payoff: 0,
        payout: 0,
        rebate: 0,
        turn_in: 0,
      }));
      throw error;
    }
  };

  useEffect(() => {
    if (parentSearch.forceUpdate === 0) return;
    fcGetList({ ...pgCfg, searchCfg: { ...parentSearch, ...searchCfg, ...tSearchCfg } });
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
          flag: allPermission.includes('report.member.export'),
          excelHeader: MemberExcel,
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
        addCfg={{
          flag: false,
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            return;
          },
        }}
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(Member);
