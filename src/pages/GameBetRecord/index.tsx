import { useState, useMemo, useEffect } from 'react';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import usePage from '@hooks/usePage';
import { apiList } from '@api/GameBetRecord';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/GameBetRecord/req';
import { IResInfo, IResFooter } from '@api/GameBetRecord/res';
import { getValueColor, getWinLostColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Link, Button, Stack, Tooltip, Typography } from '@mui/material';
// custom Components
import { getDateRange } from '@utils/date';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@components/muiTable/Base';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import LoadingButton from '@components/@extended/LoadingButton';
import RefundIcon from '@src/components/@svgIcon/Refund';
import RestoreIcon from '@src/components/@svgIcon/Restore';
import RiskHedging from '@pages/RiskHedging/component/RiskHedging';
import { fcMoneyFormat } from '@src/utils/method';
import Refund from './feature/Refund';
import Restore from './feature/Restore';
import GameInfo from './feature/GameInfo';
import { GameBetExcel } from './excel/GameBetExcel';

const Modal = new ModalController();

const GameBetRecord = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const { sysTime } = globalState;
  // refer list
  const [betareaList, setBetareaList] = useState<TbSelectProps[]>([]);
  const [roomList, setRoomList] = useState<TbSelectProps[]>([]);
  const [winloseList, setWinloseList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  const [footerObj, setFooterObj] = useState<IResFooter>({
    bet_real: 0,
    bet_total: 0,
    payoff: 0,
    payout: 0,
  });
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    report_time1: getDateRange(sysTime, 'today')[0].format('YYYY-MM-DD HH:mm:ss'),
    report_time2: getDateRange(sysTime, 'today')[1].format('YYYY-MM-DD HH:mm:ss'),
  });

  const columns = useMemo(
    () => [
      {
        header: t('sys.id'),
        accessorKey: 'id',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Link
              underline="always"
              sx={{ cursor: 'pointer', color: theme.palette.info.main }}
              onClick={async () => {
                await Modal.open(RiskHedging, {
                  defaultSearchProps: {
                    game_no: row.getValue('game_no'),
                    username: row.getValue('username'),
                    report_time1: searchCfg.report_time1,
                    report_time2: searchCfg.report_time2,
                  },
                });
              }}
            >
              {row.getValue('id')}
            </Link>
          );
        },
        Footer: () => <div>{t('sys.sum')}</div>,
      },
      {
        header: t('gameBetRc.room_id'),
        accessorKey: 'room_id',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('gameBetRc.room_id') },
        filterSelectOptions: roomList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const room = row.getValue('room_id');
          const roomObj = roomList.find((item) => item.value == room);
          return <div>{roomObj?.text}</div>;
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('gameBetRc.game_no'),
        accessorKey: 'game_no',
        muiFilterTextFieldProps: { placeholder: t('gameBetRc.game_no') },
        Cell: ({ row }: { row: any }) => {
          const room = row.getValue('room_id');
          const roomObj = roomList.find((item) => item.value == room);
          return (
            <Link
              color="primary"
              underline="always"
              sx={{ cursor: 'pointer' }}
              onClick={async () => {
                await Modal.open(GameInfo, {
                  infoData: {
                    ...row.original.record,
                    room_name: roomObj?.text,
                    game_no: row.getValue('game_no'),
                  },
                });
              }}
            >
              {row.getValue('game_no')}
            </Link>
          );
        },
        Footer: () => <div>-</div>,
      },

      {
        header: t('sys.username'),
        accessorKey: 'username',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('sys.username') },
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setTSearchCfg((prevState) => ({
                  ...prevState,
                  username: row.getValue('username'),
                }));
              }}
            >
              {row.getValue('username')}
            </Typography>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('gameBetRc.agent'),
        accessorKey: 'agent',
        enableColumnFilter: false,
        Footer: () => <div>-</div>,
      },
      {
        header: t('gameBetRc.bet_no'),
        accessorKey: 'bet_no',
        enableClickToCopy: true,
        muiFilterTextFieldProps: { placeholder: t('gameBetRc.bet_no') },
        Cell: ({ row }: { row: any }) => {
          return <div className="nowrap">{row.getValue('bet_no')}</div>;
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('gameBetRc.betarea_id'),
        accessorKey: 'betarea_id',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('gameBetRc.betarea_id') },
        filterSelectOptions: betareaList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const betareaId = row.getValue('betarea_id');
          const betareaObj = betareaList.find((item: any) => item.value == betareaId);
          return (
            <Typography sx={{ color: theme.palette.info.main }}>{betareaObj?.text}</Typography>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        Header: ({ column }: { column: any }) => (
          <div>
            <div>{t('gameBetRc.bet_total')}</div>
            <div>{t('gameBetRc.bet_real')}</div>
          </div>
        ),
        header: t('gameBetRc.bet_total'),
        accessorKey: 'bet_real',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div>{fcMoneyFormat(row.original.bet_total)}</div>
              <div
                style={{
                  color: theme.palette.error.main,
                }}
              >
                {fcMoneyFormat(row.getValue('bet_real'))}
              </div>
            </div>
          );
        },
        Footer: () => (
          <div>
            <div>{fcMoneyFormat(footerObj.bet_total)}</div>
            <div
              style={{
                color: theme.palette.error.main,
              }}
            >
              {fcMoneyFormat(footerObj.bet_real)}
            </div>
          </div>
        ),
      },
      {
        header: t('gameBetRc.odds'),
        accessorKey: 'odds',
        enableColumnFilter: false,
        Footer: () => <div>-</div>,
      },
      // {
      //   header: t('gameBetRc.payout'),
      //   accessorKey: 'payout',
      //   enableColumnFilter: false,
      //   Cell: ({ row }: { row: any }) => {
      //     return (
      //       <Typography
      //         sx={{
      //           color:
      //             row.getValue('payout') > 0 ? theme.palette.error.main : theme.palette.info.main,
      //         }}
      //       >
      //         {fcMoneyFormat(row.getValue('payout'))}
      //       </Typography>
      //     );
      //   },
      //   Footer: () => (
      //     <div
      //       style={{
      //         color: footerObj.payout >= 0 ? theme.palette.error.main : theme.palette.info.main,
      //       }}
      //     >
      //       {fcMoneyFormat(footerObj.payout)}
      //     </div>
      //   ),
      // },
      {
        header: t('gameBetRc.payoff'),
        accessorKey: 'payoff',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{
                color:
                  row.getValue('payoff') >= 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {fcMoneyFormat(row.getValue('payoff'))}
            </Typography>
          );
        },
        Footer: () => (
          <div
            style={{
              color: footerObj.payoff >= 0 ? theme.palette.error.main : theme.palette.info.main,
            }}
          >
            {fcMoneyFormat(footerObj.payoff)}
          </div>
        ),
      },
      {
        header: t('gameBetRc.is_lose_win'),
        accessorKey: 'is_lose_win',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('gameBetRc.is_lose_win') },
        filterSelectOptions: winloseList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const winLose = row.getValue('is_lose_win');
          const winLoseObj = winloseList.find((item) => item.value == winLose);
          return (
            <Typography color={getWinLostColor(theme, winLose)}>{winLoseObj?.text}</Typography>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('sys.status'),
        accessorKey: 'status',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('sys.status') },
        filterSelectOptions: statusList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const status = row.getValue('status');
          const statusObj = statusList.find((item) => item.value == status);
          return (
            <Button variant="outlined" color={getValueColor(theme, status)}>
              {statusObj?.text}
            </Button>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        Header: ({ column }: { column: any }) => (
          <div>
            <div>{t('gameBetRc.report_time')}</div>
            <div>{t('gameBetRc.payout_time')}</div>
          </div>
        ),
        header: t('gameBetRc.report_time'),
        accessorKey: 'report_time',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div>{row.getValue('report_time')}</div>
              <div
                style={{
                  color: theme.palette.info.main,
                }}
              >
                {row.original.payout_time}
              </div>
            </div>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('sys.action'),
        accessorKey: 'action',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {/* Restore */}
              {allPermission.includes('bet_record.restore') && (
                <Tooltip title={t('gameBetRc.restore')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="info"
                    onClick={async () => {
                      await Modal.open(Restore, {
                        id: row.getValue('id'),
                        fetchData: async () => {
                          fcGetList({
                            ...pgCfg,
                            searchCfg: { ...searchCfg, ...tSearchCfg },
                          });
                        },
                      });
                    }}
                  >
                    <RestoreIcon
                      style={{
                        position: 'absolute',
                        width: '20px',
                        height: '20px',
                        fill: theme.palette.info.main,
                      }}
                    />
                  </LoadingButton>
                </Tooltip>
              )}
              {/* Refund */}
              {allPermission.includes('bet_record.refund') && (
                <Tooltip title={t('gameBetRc.refund')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="error"
                    onClick={async () => {
                      await Modal.open(Refund, {
                        id: row.getValue('id'),
                        fetchData: async () => {
                          fcGetList({
                            ...pgCfg,
                            searchCfg: { ...searchCfg, ...tSearchCfg },
                          });
                        },
                      });
                    }}
                  >
                    <RefundIcon
                      style={{
                        position: 'absolute',
                        width: '20px',
                        height: '20px',
                        fill: theme.palette.error.main,
                      }}
                    />
                  </LoadingButton>
                </Tooltip>
              )}
            </Stack>
          );
        },
        Footer: () => <div>-</div>,
      },
    ],
    [t, theme, allPermission, editLoading, betareaList, roomList, winloseList, statusList],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, refer, meta, footer } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      data.map((item: IResInfo) => {
        item.action = item.id;
      });
      const betareaList: TbSelectProps[] = Object.entries(refer.betarea).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const roomList: TbSelectProps[] = Object.entries(refer.room).map(
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
      setBetareaList(betareaList);
      setRoomList(roomList);
      setWinloseList(winloseList);
      setStatusList(statusList);
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
        tSearchCfg={tSearchCfg}
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
          flag: false,
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            return;
          },
        }}
        exportCfg={{
          flag: true,
          excelHeader: GameBetExcel,
          title: `${t('menu.gameBetRecord')} ${searchCfg.report_time1} `,
          fileName: `${t('menu.gameBetRecord')} ${searchCfg.report_time1} `,
          fcExportData: async (page: number, pageSize: number) => {
            try {
              const { data: excelData } = await apiList({
                ...searchCfg,
                ...tSearchCfg,
                page: page,
                per_page: pageSize,
                export: 1,
              });
              excelData.map((item: any) => {
                item.room_id = roomList.find((room) => room.value == item.room_id)?.text;
                item.betarea_id = betareaList.find(
                  (betarea) => betarea.value == item.betarea_id,
                )?.text;
                item.is_lose_win = winloseList.find(
                  (winlose) => winlose.value == item.is_lose_win,
                )?.text;
                item.status = statusList.find((status) => status.value == item.status)?.text;
              });
              return Promise.resolve({ excelData });
            } catch (error) {
              throw error;
            }
          },
        }}
        searchComponent={
          <Grid container xs={12} spacing={2}>
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
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(GameBetRecord);
