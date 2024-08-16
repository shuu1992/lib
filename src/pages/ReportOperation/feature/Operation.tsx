import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList } from '@api/ReportOperation';
import { IResInfo, IResFooter } from '@api/ReportOperation/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Link } from '@mui/material';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import dayjs from 'dayjs';
import PageTable from '@src/components/muiTable/Base';
import SearchSelect from '@components/search/ReportSelect';
import SelectMultiple from '@components/search/SelectMultiple';
import SearchDateRgPicker from '@components/search/DateRangePicker';
import { fcMoneyFormat, fcMoneyDecimalFormat } from '@src/utils/method';
import { ReportTabProps } from '../index';
import Chart from '../chart/Operation';
import { OperationExcel } from '../excel/OperationExcel';

const Modal = new ModalController();
const ReportOperation = ({
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
  const [typeList, setTypeList] = useState<TbSelectProps[]>([
    {
      text: t('reportOperation.dayReport'),
      value: '1',
    },
    {
      text: t('reportOperation.weekReport'),
      value: '2',
    },
    {
      text: t('reportOperation.monthReport'),
      value: '3',
    },
  ]);
  const [roomTypeList, setRoomTypeList] = useState<TbSelectProps[]>([]);
  const [footerObj, setFooterObj] = useState<IResFooter>({
    bet_count: 0,
    bet_real: 0,
    bet_total: 0,
    bet_user: 0,
    payoff: 0,
    payout: 0,
    rebate: 0,
    donate: 0,
  });
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    type: '1',
  });

  const columns = useMemo(
    () => [
      {
        header: t('report.report_date'),
        accessorKey: 'report_date',
        enableColumnFilter: false,
        muiTableFooterCellProps: {
          align: 'center',
        },
        Cell: ({ row }: { row: any }) => {
          let rowText = '';
          let startDate = '';
          let endDate = '';
          switch (searchCfg.type) {
            case '1':
              rowText = row.getValue('report_date');
              startDate = dayjs(rowText).format('YYYY-MM-DD');
              endDate = dayjs(rowText).format('YYYY-MM-DD');
              break;
            case '2':
              rowText = `${row.original.week_start} ~ ${row.original.week_end}`;
              startDate = dayjs(row.original.week_start).format('YYYY-MM-DD');
              endDate = dayjs(row.original.week_end).format('YYYY-MM-DD');
              break;
            case '3':
              rowText = `${row.original.year} - ${row.original.month}`;
              startDate = dayjs(row.original.year + '-' + row.original.month).format('YYYY-MM-DD');
              endDate = dayjs(row.original.year + '-' + row.original.month)
                .endOf('month')
                .format('YYYY-MM-DD');
              break;
          }
          return (
            <Link
              underline="always"
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setParentSearch((prevState) => ({
                  ...prevState,
                  report_date1: startDate,
                  report_date2: endDate,
                }));
                setStep('room');
              }}
            >
              {rowText}
            </Link>
          );
        },
        Footer: () => <div>{t('sys.sum')}</div>,
      },
      {
        header: t('report.bet_count'),
        accessorKey: 'bet_count',
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('bet_count'))}</div>;
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.bet_count)}</div>,
      },
      {
        header: t('report.bet_user'),
        accessorKey: 'bet_user',
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('bet_user'))}</div>;
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.bet_user)}</div>,
      },
      {
        header: t('report.bet_total'),
        accessorKey: 'bet_total',
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
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('bet_real'))}</div>;
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.bet_real)}</div>,
      },
      {
        header: t('report.payout'),
        accessorKey: 'payout',
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
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return (
            <div
              style={{
                textAlign: 'right',
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
        header: t('report.rebate'),
        accessorKey: 'rebate',
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyDecimalFormat(row.getValue('rebate'))}</div>;
        },
        Footer: () => <div>{fcMoneyDecimalFormat(footerObj.rebate)}</div>,
      },
      {
        header: t('report.donate'),
        accessorKey: 'donate',
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('donate'))}</div>;
        },
        Footer: () => (
          <div
            style={{
              textAlign: 'right',
            }}
          >
            {fcMoneyFormat(footerObj.donate)}
          </div>
        ),
      },
    ],
    [t, theme, allPermission, roomTypeList, footerObj],
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
      const roomTypeList: TbSelectProps[] = Object.entries(refer.room_type).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      //Search Cfg
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
        bet_user: 0,
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
          flag: allPermission.includes('report.general_operations.export'),
          excelHeader: OperationExcel,
          title: `${t('menu.reportOperation')} ${parentSearch.report_date1} - ${
            parentSearch.report_date2
          }`,
          fileName: `${t('menu.reportOperation')} ${parentSearch.report_date1}`,
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
              switch (searchCfg.type) {
                case '2':
                  excelData.map((item: any) => {
                    item.report_date = `${item.week_start} ~ ${item.week_end}`;
                  });
                  break;
                case '3':
                  excelData.map((item: any) => {
                    item.report_date = `${item.year} - ${item.month}`;
                  });
                  break;
              }
              return Promise.resolve({ excelData });
            } catch (error) {
              throw error;
            }
          },
        }}
        searchComponent={
          <Grid container xs={12} spacing={2.5}>
            <Grid xs={12} md={2}>
              <SearchSelect
                placeholder={t('sys.type')}
                options={typeList}
                value={searchCfg.type || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, type: value });
                }}
              />
            </Grid>
            <Grid xs={12} md={2}>
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
                placeholder={t('sys.report_date')}
                start={parentSearch.report_date1 || ''}
                end={parentSearch.report_date2 || ''}
                startKey={'report_date1'}
                endKey={'report_date2'}
                defaultType={'thisWeek'}
                setValue={(key: string, value: string) => {
                  setParentSearch((prevState) => ({
                    ...prevState,
                    [key]: value,
                  }));
                }}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
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
            <Grid xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                color="error"
                onClick={() => {
                  Modal.open(Chart, {});
                }}
              >
                {t('sys.chart')}
              </Button>
            </Grid>
          </Grid>
        }
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(ReportOperation);
