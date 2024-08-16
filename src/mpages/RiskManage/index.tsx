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
import { Button, Stack, Tooltip, Link, Divider } from '@mui/material';
// ant-design
import { EditTwoTone } from '@ant-design/icons';
// custom Components
import dayjs from 'dayjs';
import { getDateRange } from '@utils/date';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/MBase';
import SearchOutLine from '@components/search/InputOutline';
import SelectOutline from '@components/search/SelectOutline';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import LoadingButton from '@components/@extended/LoadingButton';
import RefundIcon from '@src/components/@svgIcon/Refund';
import PayoutIcon from '@src/components/@svgIcon/Payout';
import RestoreIcon from '@src/components/@svgIcon/Restore';
import Edit from '@pages/RiskManage/feature/Edit'; //修改開獎號碼
import Refund from '@pages/RiskManage/feature/Refund';
import Payout from '@pages/RiskManage/feature/Payout';
import Restore from '@pages/RiskManage/feature/Restore';
import GameInfo from '@pages/RiskManage/feature/GameInfo';
import BetRecord from '@pages/GameBetRecord/component/BetRecord';
import Add from '@pages/RiskManage/feature/Add';
import BoxingResultTableColumn from '@pages/RiskManage/component/BoxingResultTableColumn';
import NuiResultTableColumn from '@pages/RiskManage/component/NuiResultTableColumn';
import ControlOdds from '@src/pages/RiskManage/feature/ControlOdds';
import UpdownIcon from '@src/components/@svgIcon/Updown';
import EditStatus from '@src/pages/RiskManage/feature/EditStatus';
import { RoomType } from '@src/pages/RiskManage';
import { fcMoneyFormat } from '@src/utils/method';
import BaccaratResultTableColumn from './component/BaccaratResultTableColumn';

const Modal = new ModalController();

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
    game_no: '',
    room_id: '',
    status: '',
    end_time1: getDateRange(sysTime, 'thisWeek')[0].format('YYYY-MM-DD HH:mm:ss'),
    end_time2: getDateRange(sysTime, 'thisWeek')[1].format('YYYY-MM-DD HH:mm:ss'),
  });

  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'id',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          const room = row.original.room_id;
          const roomObj = roomList.find((item) => item.value == room);
          const status = row.original.status;
          const statusObj = statusList.find((item) => item.value == status);
          const betpermission = allPermission.includes('bet_record.index');

          const gameType = rooms.find((item: RoomType) => {
            return item.id == room;
          })?.game_id;

          return (
            <Grid
              container
              spacing={2}
              textAlign="left"
              alignItems="center"
              style={{ minWidth: '75vw' }}
            >
              <Grid xs={3} textAlign="center">
                {row.original.id}
              </Grid>
              <Grid container xs={9}>
                <Grid xs={6}>
                  <Grid>{t('riskManage.room_id')}</Grid>
                  <Grid>
                    <Button variant="outlined" color={getValueColor(theme, room)}>
                      {roomObj?.text}
                    </Button>
                  </Grid>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <Grid>{t('riskManage.game_no')}</Grid>
                  <Grid>
                    <Link
                      color="primary"
                      underline="always"
                      sx={{ cursor: 'pointer' }}
                      onClick={async () => {
                        if (editLoading) return;
                        await Modal.open(GameInfo, {
                          infoData: {
                            numbers: row.original.numbers,
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
                  </Grid>
                </Grid>
                <Grid xs={6} p={0}>
                  <Grid>{t('sys.start_time')}</Grid>
                  <Grid>{row.original.start_time}</Grid>
                </Grid>
                <Grid xs={6} p={0} textAlign="right">
                  <Grid>
                    {t('gameBetRc.rounds')} ／ {t('gameBetRc.rounds_no')}
                  </Grid>
                  <Link
                    color={betpermission ? 'error' : 'inherit'}
                    underline={betpermission ? 'always' : 'none'}
                    sx={{ cursor: betpermission ? 'pointer' : 'default' }}
                    onClick={async () => {
                      if (betpermission === false) return;
                      if (editLoading) return;
                      await Modal.open(BetRecord, {
                        defaultSearchProps: {
                          game_no: row.original.game_no,
                        },
                      });
                    }}
                  >
                    {row.original.rounds} ／ {row.original.rounds_no}
                  </Link>
                </Grid>
                <Grid xs={6} p={0} pt={1}>
                  <Grid>{t('sys.end_time')}</Grid>
                  <Grid>{row.original.end_time}</Grid>
                </Grid>
                <Grid xs={6} p={0} pt={1} textAlign="right">
                  <Button
                    variant="outlined"
                    size="small"
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
                </Grid>
                {gameType === 1 && <BaccaratResultTableColumn row={row} />}
                {gameType === 3 && <NuiResultTableColumn row={row} />}
                {gameType === 5 && <BoxingResultTableColumn row={row} />}
              </Grid>
            </Grid>
          );
        },
      },
    ],
    [roomList, statusList, allPermission, rooms, t, theme, editLoading, searchCfg],
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
          flag: true,
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
            <Grid xs={12}>
              <SearchOutLine
                placeholder={t('riskManage.game_no')}
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
              <SelectOutline
                placeholder={t('riskManage.room_id')}
                options={roomList}
                value={searchCfg.room_id || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, room_id: value });
                }}
              />
            </Grid>
            <Grid xs={12} mt={0.5}>
              <SelectOutline
                placeholder={t('sys.status')}
                options={statusList}
                value={searchCfg.status || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, status: value });
                }}
              />
            </Grid>
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
        renderDetailPanel={({ row }: { row: any }) => {
          const gameType = rooms.find((item) => {
            return item.id == row.original.room_id;
          })?.game_id;
          //有輸入numbers AND 現在時間 > end_time 就可以派彩還原退款
          const now = sysTime
            ? dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss')
            : dayjs().format('YYYY-MM-DD HH:mm:ss');
          const checkFlag = row.original.numbers !== '' && now > row.original.end_time;
          return (
            <Grid container p={0.5}>
              <Grid xs={4} mt={1}>
                {t('riskManage.bet_count')}:
              </Grid>
              <Grid xs={8} mb={1} textAlign="right">
                <Grid
                  style={{
                    color: theme.palette.primary.main,
                  }}
                >
                  {fcMoneyFormat(row.original.bet_count)}
                </Grid>
              </Grid>

              <Grid xs={4} mt={1}>
                {t('riskManage.win_bet_count')}:
              </Grid>
              <Grid xs={8} mb={1} textAlign="right">
                <Grid
                  style={{
                    color:
                      row.original.win_bet_count > row.original.bet_count
                        ? theme.palette.primary.main
                        : theme.palette.error.main,
                  }}
                >
                  {fcMoneyFormat(row.original.win_bet_count)}
                </Grid>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>

              <Grid xs={4} mt={1}>
                {t('riskManage.bet_number')}:
              </Grid>
              <Grid xs={8} mb={1} textAlign="right">
                <Grid
                  style={{
                    color: theme.palette.primary.main,
                  }}
                >
                  {fcMoneyFormat(row.original.bet_number)}
                </Grid>
              </Grid>

              <Grid xs={4} mt={1} mb={1}>
                {t('riskManage.bet_total')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <Grid
                  style={{
                    color: theme.palette.error.main,
                  }}
                >
                  {fcMoneyFormat(row.original.bet_total)}
                </Grid>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1}>
                {t('riskManage.payout')}:
              </Grid>
              <Grid xs={8} mb={1} textAlign="right">
                <Grid
                  style={{
                    color: theme.palette.primary.main,
                  }}
                >
                  {fcMoneyFormat(row.original.payout)}
                </Grid>
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('riskManage.payoff')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <Grid
                  style={{
                    color: theme.palette.error.main,
                  }}
                >
                  {fcMoneyFormat(row.original.payoff)}
                </Grid>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('sys.action')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                  {/* Edit */}
                  {allPermission.includes('game_record.update') && (
                    <Tooltip title={t('sys.edit')}>
                      <LoadingButton
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="primary"
                        onClick={async () => {
                          const infoData = await fcGetInfo({ id: row.original.id });

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
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="primary"
                        onClick={async () => {
                          await Modal.open(Payout, {
                            id: row.original.id,
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
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="info"
                        onClick={async () => {
                          await Modal.open(Restore, {
                            id: row.original.id,
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
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="error"
                        onClick={async () => {
                          await Modal.open(Refund, {
                            id: row.original.id,
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
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="primary"
                        onClick={async () => {
                          const infoData = await fcGetInfo({ id: row.original.id });

                          await Modal.open(ControlOdds, {
                            infoData: { ...infoData },
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
              </Grid>
            </Grid>
          );
        }}
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};
export default withPageHoc(RiskManage);
