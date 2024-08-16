import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList } from '@api/GameBetRecord';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/GameBetRecord/req';
import { IResInfo, IResFooter } from '@api/GameBetRecord/res';
import { getValueColor, getWinLostColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Link, Divider, Collapse, Typography } from '@mui/material';
//ant-design
import { CopyOutlined } from '@ant-design/icons';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@components/muiTable/MBase';
import { BetExcel } from '@pages/ReportOperation/excel/BetExcel';
import SearchOutLine from '@components/search/InputOutline';
import SelectOutline from '@components/search/SelectOutline';
import SearchDateRgPicker from '@components/search/DateRangePicker';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import GameInfo from '@pages/ReportOperation/feature/GameInfo';
import { fcMoneyFormat, fcMoneyDecimalFormat } from '@src/utils/method';
import { ReportTabProps } from '../index';

const Modal = new ModalController();

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
  const [winloseList, setWinloseList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  const [betareaList, setBetareaList] = useState<TbSelectProps[]>([]);
  const [footerObj, setFooterObj] = useState<IResFooter>({
    bet_real: 0,
    bet_total: 0,
    payoff: 0,
    payout: 0,
  });
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    bet_no: '',
    game_no: '',
  });

  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'id',
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
          const room = row.original.room_id;
          const roomObj = roomList.find((item) => item.value == room);
          const status = row.original.status;
          const statusObj = statusList.find((item) => item.value == status);
          const betareaId = row.original.betarea_id;
          const betareaObj = betareaList.find((item: any) => item.value == betareaId);
          return (
            <Grid
              container
              spacing={2}
              textAlign="left"
              alignItems="center"
              style={{ minWidth: '75vw' }}
            >
              <Grid xs={3} textAlign="center">
                <Grid>{row.original.id}</Grid>
              </Grid>
              <Grid container xs={9}>
                <Grid xs={6}>
                  <Grid>{t('report.game_no')}</Grid>
                  <Grid>
                    <Link
                      color="primary"
                      underline="always"
                      sx={{ cursor: 'pointer' }}
                      onClick={async () => {
                        await Modal.open(GameInfo, {
                          infoData: {
                            ...row.original.record,
                            room_name: roomObj?.text,
                            game_no: row.original.game_no,
                          },
                        });
                      }}
                    >
                      {row.original.game_no}
                    </Link>
                  </Grid>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <Grid>{t('sys.username')}</Grid>
                  <Grid>{row.original.username}</Grid>
                </Grid>

                <Grid xs={6}>
                  <Grid>{t('report.betarea')}</Grid>
                  <Grid>
                    <Typography sx={{ color: theme.palette.info.main }}>
                      {betareaObj?.text}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid xs={6} textAlign="right">
                  <Grid>{t('sys.status')}</Grid>
                  <Grid>
                    <Button variant="outlined" color={getValueColor(theme, status)}>
                      {statusObj?.text}
                    </Button>
                  </Grid>
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
              <Grid container xs={6.9}>
                <Grid xs={6}>
                  <Grid>{t('report.bet_total')}</Grid>
                  <Grid>{fcMoneyFormat(footerObj.bet_total)}</Grid>
                </Grid>
                <Grid xs={6}>
                  <Grid>{t('report.bet_real')}</Grid>
                  <Grid>{fcMoneyDecimalFormat(footerObj.bet_real)}</Grid>
                </Grid>
                <Grid xs={6}>
                  <Grid>{t('report.payout')}</Grid>
                  <Grid>{fcMoneyDecimalFormat(footerObj.payout)}</Grid>
                </Grid>
                <Grid xs={6}>
                  <Grid>{t('report.payoff')}</Grid>
                  <Grid
                    style={{
                      color:
                        footerObj.payoff > 0 ? theme.palette.error.main : theme.palette.info.main,
                    }}
                  >
                    {fcMoneyDecimalFormat(footerObj.payoff)}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        },
      },
    ],
    [
      t,
      theme,
      allPermission,
      editLoading,
      searchCfg,
      roomList,
      winloseList,
      statusList,
      betareaList,
    ],
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
      const betareaList: TbSelectProps[] = Object.entries(refer.betarea).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const winloseList: TbSelectProps[] = Object.entries(refer.is_lose_win).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const statusList: TbSelectProps[] = Object.entries(refer.status).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      //Search Cfg
      setFooterObj(footer);
      setRoomList(roomList);
      setWinloseList(winloseList);
      setStatusList(statusList);
      setBetareaList(betareaList);

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
        bet_real: 0,
        bet_total: 0,
        payoff: 0,
        payout: 0,
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
          flag: allPermission.includes('report.bet.export'),
          excelHeader: BetExcel,
          title: `${t('reportOperation.bet')} ${parentSearch.report_date1} - ${
            parentSearch.report_date2
          }`,
          fileName: `${t('reportOperation.bet')} ${parentSearch.report_date1}`,
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
              excelData.map((item: any) => {
                item.status = statusList.find((status) => status.value == item.status)?.text;
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
                placeholder={t('reportOperation.room')}
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
            <Grid xs={12} mt={0.5}>
              <SearchOutLine
                placeholder={t('gameBetRc.game_no')}
                value={searchCfg.game_no || ''}
                setValue={(value: string) => {
                  setSearchCfg((prevState) => ({
                    ...prevState,
                    game_no: value,
                  }));
                }}
              />
            </Grid>
            <Grid xs={12} mt={0.5}>
              <SearchOutLine
                placeholder={t('gameBetRc.bet_no')}
                value={searchCfg.bet_no || ''}
                setValue={(value: string) => {
                  setSearchCfg((prevState) => ({
                    ...prevState,
                    bet_no: value,
                  }));
                }}
              />
            </Grid>
            <Grid xs={12} md={1}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  if (pgCfg.pageIndex > 0) {
                    setPgCfg((prevState: PgCfgProps) => ({
                      ...prevState,
                      pageIndex: 0,
                    }));
                    return;
                  }
                  fcGetList({ ...pgCfg, searchCfg: { ...searchCfg, ...tSearchCfg } });
                }}
              >
                {t('sys.search')}
              </Button>
            </Grid>
          </Grid>
        }
        renderDetailPanel={({ row }: { row: any }) => {
          const winLose = row.original.is_lose_win;
          const winLoseObj = winloseList.find((item) => item.value == winLose);
          return (
            <Grid container p={0.5}>
              <Grid xs={4} my={1}>
                {t('report.bet_no')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                <CopyToClipboard text={row.original.bet_no}>
                  <Grid p={0}>
                    {row.original.bet_no}
                    <CopyOutlined />
                  </Grid>
                </CopyToClipboard>
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
                {t('report.odds')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                {fcMoneyFormat(row.original.odds)}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('report.payout')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                <Typography
                  sx={{
                    color:
                      row.original.payout >= 0 ? theme.palette.error.main : theme.palette.info.main,
                  }}
                >
                  {fcMoneyDecimalFormat(row.original.payout)}
                </Typography>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('report.payoff')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                <Typography
                  sx={{
                    color:
                      row.original.payoff >= 0 ? theme.palette.error.main : theme.palette.info.main,
                  }}
                >
                  {fcMoneyDecimalFormat(row.original.payoff)}
                </Typography>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('report.is_lose_win')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                <Typography color={getWinLostColor(theme, winLose)}>{winLoseObj?.text}</Typography>{' '}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('report.report_time')}
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                {row.original.report_time}
              </Grid>
            </Grid>
          );
        }}
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(ReportOperationUser);
