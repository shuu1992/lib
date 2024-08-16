import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo, apiEdit } from '@api/GameRoom';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/GameRoom/req';
import { IResInfo } from '@api/GameRoom/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Stack, Tooltip, FormControlLabel, Divider } from '@mui/material';
// ant-design
import { EditTwoTone, DeleteTwoTone, CopyOutlined } from '@ant-design/icons';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PageTable from '@components/muiTable/MBase';
import SearchOutLine from '@components/search/InputOutline';
import SelectOutline from '@components/search/SelectOutline';
import LoadingButton from '@components/@extended/LoadingButton';
import FireIcon from '@src/components/@svgIcon/Fire';
import UnFireIcon from '@src/components/@svgIcon/UnFire';
import Add from '@pages/GameRoom/feature/Add';
import Edit from '@pages/GameRoom//feature/Edit';
import Del from '@pages/GameRoom//feature/Del';

const Modal = new ModalController();
const MGameRoom = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  // refer list
  const [anchorList, setAnchorList] = useState<TbSelectProps[]>([]);
  const [gameList, setGameList] = useState<TbSelectProps[]>([]);
  const [hotList, setHotList] = useState<TbSelectProps[]>([]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    game_id: '',
    name: '',
    type: '',
    hot: '',
    status: '',
  });

  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'id',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          const type = row.original.type;
          const typeObj = typeList.find((item) => item.value == type);
          const game = row.original.game_id;
          const gameObj = gameList.find((item) => item.value == game);
          const status = row.original.status;
          const statusObj = statusList.find((item) => item.value == status);
          return (
            <Grid
              container
              spacing={2}
              textAlign="left"
              alignItems="center"
              style={{ minWidth: '75vw' }}
              p={1}
            >
              <Grid xs={2.5} textAlign="center">
                {row.original.id}
              </Grid>
              <Grid container xs={9.5}>
                <Grid xs={6}>
                  <Grid>{t('gameRoom.game_id')}:</Grid>
                  <Grid>{gameObj?.text}</Grid>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <Grid mr={4}>{t('gameRoom.name')}:</Grid>
                  <CopyToClipboard text={row.original.name}>
                    <Grid>
                      {row.original.name}
                      <CopyOutlined style={{ marginLeft: '0.5rem' }} />
                    </Grid>
                  </CopyToClipboard>
                </Grid>
                <Grid xs={6}>
                  <Grid>{t('gameRoom.type')}:</Grid>
                  <Grid> {typeObj?.text}</Grid>
                </Grid>

                <Grid xs={6} textAlign="right">
                  <Button size="small" variant="outlined" color={getValueColor(theme, status)}>
                    {statusObj?.text}
                  </Button>
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
      anchorList,
      gameList,
      hotList,
      typeList,
      statusList,
    ],
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
      // 新增一個下架主播的選項
      Object.assign(refer.anchor, {
        0: '____',
      });
      const anchorList: TbSelectProps[] = Object.entries(refer.anchor).map(
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
      const hotList: TbSelectProps[] = Object.entries(refer.hot).map(
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
      const typeList: TbSelectProps[] = Object.entries(refer.type).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      //Search Cfg
      setAnchorList(anchorList);
      setGameList(gameList);
      setHotList(hotList);
      setStatusList(statusList);
      setTypeList(typeList);
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
        addCfg={{
          flag: allPermission.includes('game_room.store'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            Modal.open(Add, {
              dataList,
              anchorList,
              gameList,
              hotList,
              typeList,
              statusList,
              fetchData: async () => {
                fcGetList({ ...pgCfg, searchCfg: { ...searchCfg, ...tSearchCfg } });
              },
            });
          },
        }}
        searchComponent={
          <Grid container xs={12} spacing={2}>
            <Grid xs={12}>
              <SelectOutline
                placeholder={t('gameRoom.game_id')}
                options={gameList}
                value={searchCfg.game_id || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, game_id: value });
                }}
              />
            </Grid>
            <Grid xs={12} mt={0.5}>
              <SelectOutline
                placeholder={t('gameRoom.type')}
                options={typeList}
                value={searchCfg.type || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, type: value });
                }}
              />
            </Grid>
            <Grid xs={12} mt={0.5}>
              <SearchOutLine
                placeholder={t('gameRoom.name')}
                value={searchCfg.name || ''}
                setValue={(value: string) => {
                  setSearchCfg((prevState) => ({
                    ...prevState,
                    name: value,
                  }));
                }}
              />
            </Grid>

            <Grid xs={12} mt={0.5}>
              <SelectOutline
                placeholder={t('gameRoom.hot')}
                options={hotList}
                value={searchCfg.hot || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, hot: value });
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
          const hot = row.original.hot;
          const cssStyle = { width: '25px', height: '25px', cursor: 'pointer' };
          return (
            <Grid container p={0.5}>
              <Grid xs={4} mt={1} mb={1}>
                {t('gameRoom.hot')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <Grid
                  onClick={async () => {
                    if (allPermission.includes('game_room.update') === false) return;
                    const postData = {
                      ...row.original,
                      hot: hot === 1 ? 0 : 1,
                    };
                    const { code } = await apiEdit(postData);
                    if (code === 200) {
                      fcGetList({ ...pgCfg, searchCfg: { ...searchCfg, ...tSearchCfg } });
                    }
                  }}
                >
                  {hot === 1 ? (
                    <FireIcon style={cssStyle} />
                  ) : (
                    <UnFireIcon style={{ ...cssStyle, fill: theme.palette.text.primary }} />
                  )}
                </Grid>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('sys.sort')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <div>{row.original.sort}</div>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('sys.action')}:
              </Grid>
              <Grid xs={8} textAlign="right">
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                  {allPermission.includes('game_room.update') && (
                    <Tooltip title={t('sys.edit')}>
                      <LoadingButton
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="primary"
                        onClick={async () => {
                          const infoData = await fcGetInfo({
                            id: row.original.id,
                          });
                          await Modal.open(Edit, {
                            infoData,
                            anchorList,
                            gameList,
                            hotList,
                            typeList,
                            statusList,
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

                  {allPermission.includes('game_room.destroy') && (
                    <Tooltip title={t('sys.del')}>
                      <LoadingButton
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="error"
                        onClick={async () => {
                          await Modal.open(Del, {
                            id: row.original.id,
                            fetchData: async () => {
                              fcGetList({
                                ...pgCfg,
                                searchCfg: {
                                  ...searchCfg,
                                  ...tSearchCfg,
                                },
                              });
                            },
                          });
                        }}
                      >
                        <DeleteTwoTone twoToneColor={theme.palette.error.main} />
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

export default withPageHoc(MGameRoom);
