import { useState, useMemo, useEffect, useImperativeHandle } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import usePage from '@hooks/usePage';
import useAuth from '@hooks/useAuth';
import { apiList } from '@src/api/ReportAgent';
import { IList, IInfo, IAdd, IEdit, IDel } from '@src/api/ReportAgent/req';
import { IResInfo } from '@src/api/ReportAgent/res';
// ant-design
import { HomeOutlined } from '@ant-design/icons';
// material-ui
import { useTheme } from '@mui/material/styles';
import SimpleTable from '@src/components/muiTable/Simple';
import { Stack, Breadcrumbs, Link, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
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
  const columns = useMemo(
    () => [
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
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          return <div> {fcMoneyFormat(row.getValue('bet_count'))}</div>;
        },
      },
      {
        header: t('report.bet_total'),
        accessorKey: 'bet_total',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              {' '}
              {row.original.currencyMulti ? '-' : fcMoneyFormat(row.getValue('bet_total'))}
            </div>
          );
        },
      },
      {
        header: t('report.payoff'),
        accessorKey: 'payoff',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                color:
                  row.getValue('payoff') > 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(row.getValue('payoff'))}
            </div>
          );
        },
      },
      {
        header: t('report.bite_total'),
        enableColumnFilter: false,
        enableSorting: false,
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
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div> {row.original.currencyMulti ? '-' : fcMoneyFormat(row.getValue('bet_real'))}</div>
          );
        },
      },
      {
        header: `${t('report.rakeback')}/${t('report.rebate')}`,
        accessorKey: 'rebate',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              {fcMoneyDecimalFormat(row.original.rakeback)}%&nbsp;/&nbsp;
              {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(row.getValue('rebate'))}
            </div>
          );
        },
      },
      {
        header: t('report.money_total'),
        enableColumnFilter: false,
        enableSorting: false,
        accessorFn: (row: any) => {
          const total = parseInt(row.payoff) + parseInt(row.rebate);
          return total;
        },
        Cell: ({ row }: { row: any }) => {
          const money_total = row.getValue('payoff') + row.getValue('rebate');
          return (
            <div
              style={{
                color: money_total > 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(money_total)}
            </div>
          );
        },
      },
      {
        header: t('report.share'),
        accessorKey: 'share',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('share'))}%</div>;
        },
      },
      {
        header: t('report.receivable'),
        accessorKey: 'receivable',
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                color:
                  row.getValue('receivable') > 0
                    ? theme.palette.error.main
                    : theme.palette.info.main,
              }}
            >
              {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(row.getValue('receivable'))}
            </div>
          );
        },
      },
      {
        header: t('report.turn_in'),
        accessorKey: 'turn_in',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                color:
                  row.getValue('turn_in') > 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(row.getValue('turn_in'))}
            </div>
          );
        },
      },
      {
        header: t('report.donate'),
        accessorKey: 'donate',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              {row.original.currencyMulti ? '-' : fcMoneyDecimalFormat(row.getValue('donate'))}
            </div>
          );
        },
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
      },
    ],
    [t, theme, parentSearch],
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
        <div>
          <Grid xs={12}>
            <h3>{t('reportAgent.agentWinlose')}</h3>
          </Grid>
          <SimpleTable columns={columns} data={[agnetObj]} loadingFlag={loadingFlag} />
        </div>
      )}
      {playerObj && (
        <div>
          <Grid xs={12}>
            <h3>{t('reportAgent.playerWinlose')}</h3>
          </Grid>
          <SimpleTable columns={columns} data={[playerObj]} loadingFlag={loadingFlag} />
        </div>
      )}
      {headerObj && (
        <div>
          <Grid xs={12}>
            <h3>{t('sys.total')}</h3>
          </Grid>
          <SimpleTable columns={columns} data={[headerObj]} loadingFlag={loadingFlag} />
        </div>
      )}
    </Grid>
  );
};

export default Header;
