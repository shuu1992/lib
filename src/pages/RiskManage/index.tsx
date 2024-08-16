import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/RiskManage';
import { IInfo } from '@api/RiskManage/req';
import { IResInfo } from '@api/RiskManage/res';
import { getValueColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Stack, Tooltip, Link } from '@mui/material';
// ant-design
import { EditTwoTone } from '@ant-design/icons';
// custom Components
import dayjs from 'dayjs';
import { getDateRange } from '@utils/date';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import LoadingButton from '@components/@extended/LoadingButton';
import RefundIcon from '@src/components/@svgIcon/Refund';
import PayoutIcon from '@src/components/@svgIcon/Payout';
import RestoreIcon from '@src/components/@svgIcon/Restore';
import UpdownIcon from '@src/components/@svgIcon/Updown';

import BetRecord from '@pages/GameBetRecord/component/BetRecord';
import { fcMoneyFormat } from '@src/utils/method';
import Edit from './feature/Edit'; //修改開獎號碼
import Refund from './feature/Refund';
import Payout from './feature/Payout';
import Restore from './feature/Restore';
import GameInfo from './feature/GameInfo';
import Add from './feature/Add';
import BaccaratResultTableColumn from './component/BaccaratResultTableColumn';
import BoxingResultTableColumn from './component/BoxingResultTableColumn';
import NuiResultTableColumn from './component/NuiResultTableColumn';
import EditStatus from './feature/EditStatus';
import ControlOdds from './feature/ControlOdds';

const Modal = new ModalController();
export type RoomType = {
  id: string;
  name: string;
  game_id: number;
};

const RiskManage = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const [count, setCount] = useState(30);
  // refer list
  const [roomList, setRoomList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  const [gameList, setGameList] = useState<TbSelectProps[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    end_time1: getDateRange(sysTime, 'thisWeek')[0].format('YYYY-MM-DD HH:mm:ss'),
    end_time2: getDateRange(sysTime, 'thisWeek')[1].format('YYYY-MM-DD HH:mm:ss'),
  });

  const columns = useMemo(
    () => [
      {
        header: t('sys.id'),
        accessorKey: 'id',
        enableColumnFilter: false,
      },
      {
        header: t('riskManage.room_id'),
        accessorKey: 'room_id',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('riskManage.room_id') },
        filterSelectOptions: roomList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const room = row.getValue('room_id');
          const roomObj = roomList.find((item) => item.value == room);
          return (
            <Button variant="outlined" color={getValueColor(theme, room)}>
              {roomObj?.text}
            </Button>
          );
        },
      },
      {
        header: `${t('riskManage.game_no')}/${t('sys.rounds')}`,
        accessorKey: 'game_no',
        enableClickToCopy: false,
        muiFilterTextFieldProps: { placeholder: t('riskManage.game_no') },
        Cell: ({ row }: { row: any }) => {
          const room = row.getValue('room_id');
          const roomObj = roomList.find((item) => item.value == room);
          const betpermission = allPermission.includes('bet_record.index');
          return (
            <div>
              <Link
                color="primary"
                underline="always"
                sx={{ cursor: 'pointer' }}
                onClick={async () => {
                  if (editLoading) return;
                  await Modal.open(GameInfo, {
                    infoData: {
                      numbers: row.getValue('numbers'),
                      rounds: row.original.rounds,
                      rounds_no: row.original.rounds_no,
                      room_name: roomObj?.text as string,
                      game_no: row.original.game_no,
                      video: row.original.video,
                    },
                  });
                }}
              >
                {row.original.game_no}
              </Link>
              <div>
                <Link
                  color={betpermission ? 'error' : 'inherit'}
                  underline={betpermission ? 'always' : 'none'}
                  sx={{ cursor: betpermission ? 'pointer' : 'default' }}
                  onClick={async () => {
                    if (betpermission === false) return;
                    if (editLoading) return;
                    await Modal.open(BetRecord, {
                      defaultSearchProps: {
                        room_id: row.getValue('room_id'),
                        game_no: row.original.game_no,
                      },
                    });
                  }}
                >
                  {row.original.rounds} ／ {row.original.rounds_no}
                </Link>
              </div>
            </div>
          );
        },
      },
      {
        header: t('riskManage.numbers'),
        accessorKey: 'numbers',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          if (row.getValue('numbers') === undefined) return;
          const gameType = rooms.find((item: RoomType) => {
            return item.id == row.getValue('room_id');
          })?.game_id;
          //Baccarat
          if (gameType === 1) {
            return <BaccaratResultTableColumn row={row} />;
          }
          if (gameType === 3) {
            return <NuiResultTableColumn row={row} />;
          }
          if (gameType === 5) {
            return <BoxingResultTableColumn row={row} />;
          }
        },
      },
      {
        Header: () => (
          <div>
            <div>{`${t('riskManage.bet_count')} `}</div>
            <div>{`${t('riskManage.win_bet_count')}`}</div>
          </div>
        ),
        header: t('riskManage.bet_count'),
        accessorKey: 'bet_count',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div
                style={{
                  color: theme.palette.primary.main,
                }}
              >
                {fcMoneyFormat(row.getValue('bet_count'))}
              </div>
              <div
                style={{
                  color:
                    row.original.win_bet_count > row.getValue('bet_count')
                      ? theme.palette.primary.main
                      : theme.palette.error.main,
                }}
              >
                {fcMoneyFormat(row.original.win_bet_count)}
              </div>
            </div>
          );
        },
      },
      {
        Header: () => (
          <div>
            <div>{`${t('riskManage.bet_number')} `}</div>
            <div>{`${t('riskManage.bet_total')}`}</div>
          </div>
        ),
        header: t('riskManage.bet_number'),
        accessorKey: 'bet_number',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div
                style={{
                  color: theme.palette.primary.main,
                }}
              >
                {fcMoneyFormat(row.getValue('bet_number'))}
              </div>
              <div
                style={{
                  color: theme.palette.error.main,
                }}
              >
                {fcMoneyFormat(row.original.bet_total)}
              </div>
            </div>
          );
        },
      },
      {
        Header: () => (
          <div>
            <div>{`${t('riskManage.payout')} `}</div>
            <div>{`${t('riskManage.payoff')}`}</div>
          </div>
        ),
        header: t('riskManage.payout'),
        accessorKey: 'payout',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div
                style={{
                  color: theme.palette.primary.main,
                }}
              >
                {fcMoneyFormat(row.getValue('payout'))}
              </div>
              <div
                style={{
                  color: theme.palette.error.main,
                }}
              >
                {fcMoneyFormat(row.original.payoff)}
              </div>
            </div>
          );
        },
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
            <Button
              variant="outlined"
              color={getValueColor(theme, status)}
              onClick={async () => {
                //status 0:投注中, 只有投注中才能修改狀態
                if (
                  allPermission.includes('game_record.update') === false ||
                  row.original.status !== 0
                ) {
                  return;
                }

                await Modal.open(EditStatus, {
                  infoData: row.original,
                  fetchData: async () => {
                    fcGetList({
                      ...pgCfg,
                      searchCfg: { ...searchCfg, ...tSearchCfg },
                    });
                  },
                });
              }}
            >
              {statusObj?.text}
            </Button>
          );
        },
      },
      {
        header: t('sys.end_time'),
        accessorKey: 'end_time',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div>{row.original.start_time}</div>
              <div>{row.getValue('end_time')}</div>
            </div>
          );
        },
      },
      {
        header: t('sys.action'),
        accessorKey: 'action',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          //有輸入numbers AND 現在時間 > end_time 就可以派彩還原退款
          const now = sysTime
            ? dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss')
            : dayjs().format('YYYY-MM-DD HH:mm:ss');
          const checkFlag = row.getValue('numbers') !== '' && now > row.getValue('end_time');

          const gameType = rooms.find((item) => {
            return item.id == row.getValue('room_id');
          })?.game_id;
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {/* Edit */}
              {allPermission.includes('game_record.update') && (
                <Tooltip title={t('sys.edit')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="primary"
                    onClick={async () => {
                      const infoData = await fcGetInfo({ id: row.getValue('id') });
                      await Modal.open(Edit, {
                        infoData: { ...infoData, gameType: gameType as number },
                        fetchData: async () => {
                          fcGetList({
                            ...pgCfg,
                            searchCfg: { ...searchCfg, ...tSearchCfg },
                          });
                        },
                      });
                    }}
                  >
                    <EditTwoTone twoToneColor={theme.palette.primary.main} />
                  </LoadingButton>
                </Tooltip>
              )}
              {/* Payout */}
              {allPermission.includes('game_record.payout') && checkFlag && (
                <Tooltip title={t('riskManage.pay')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="primary"
                    onClick={async () => {
                      await Modal.open(Payout, {
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
                    <PayoutIcon
                      style={{
                        position: 'absolute',
                        width: '15px',
                        height: '15px',
                        fill: theme.palette.text.primary,
                      }}
                    />
                  </LoadingButton>
                </Tooltip>
              )}
              {/* Restore */}
              {allPermission.includes('game_record.restore') && checkFlag && (
                <Tooltip title={t('riskManage.restore')}>
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
              {allPermission.includes('game_record.refund') && (
                <Tooltip title={t('riskManage.refund')}>
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
              {/* 拳賽控盤 */}
              {allPermission.includes('game_record.update') && gameType === 5 && (
                <Tooltip title={t('riskManage.controlOdds')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="primary"
                    onClick={async () => {
                      const infoData = await fcGetInfo({ id: row.getValue('id') });
                      await Modal.open(ControlOdds, {
                        infoData: infoData,
                      });
                    }}
                  >
                    <UpdownIcon
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
      },
    ],
    [t, theme, allPermission, editLoading, searchCfg, roomList, statusList, sysTime],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, refer, meta } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      data.map((item: IResInfo) => {
        item.action = item.id;
      });
      const roomList: TbSelectProps[] = Object.entries(refer.room).map(
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
      const gameList: TbSelectProps[] = Object.entries(refer.game).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      setGameList(gameList);
      setRooms(refer.rooms);
      //Search Cfg
      setRoomList(roomList);
      setStatusList(statusList);
      //Base setting
      setPgCfg((prevState: PgCfgProps) => ({
        ...prevState,
        pageTotal: meta.total,
      }));
      setDataList(() => data);
      setLoadingFlag(false);
    } catch (error: any) {
      setLoadingFlag(false);
      throw error;
    }
  };

  const fcGetInfo = async ({ id }: IInfo) => {
    setEditLoading(id);
    try {
      const { data } = await apiInfo({
        id,
      });
      setEditLoading(null);
      return Promise.resolve(data);
    } catch (error: any) {
      setEditLoading(null);
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    setDataList(() => []);
    const interval = setInterval(() => {
      setCount((prevStatus) => prevStatus - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 0 || count < 0) {
      setCount(30);
      fcGetList({ ...pgCfg, searchCfg: { ...searchCfg, ...tSearchCfg } });
    }
  }, [count]);

  return (
    <Grid>
      <PageTable
        columns={columns}
        data={dataList}
        defaultColumnFilters={[{ id: 'room_id', value: roomList[0]?.value || '' }]}
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
          flag: allPermission.includes('game_record.store'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            Modal.open(Add, {
              gameList,
              rooms,
              fetchData: async () => {
                fcGetList({ ...pgCfg, searchCfg: { ...searchCfg, ...tSearchCfg } });
              },
            });
          },
        }}
        searchComponent={
          <Grid container xs={12} spacing={2}>
            <Grid xs={12} md={5}>
              <SearchDateTimeRgPicker
                start={searchCfg.end_time1 || ''}
                end={searchCfg.end_time2 || ''}
                startKey={'end_time1'}
                endKey={'end_time2'}
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
                {count}
              </Button>
            </Grid>
          </Grid>
        }
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};
export default withPageHoc(RiskManage);
