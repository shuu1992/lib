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
import { Button, Stack, Tooltip, FormControlLabel } from '@mui/material';
// ant-design
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import LoadingButton from '@components/@extended/LoadingButton';
import FireIcon from '@src/components/@svgIcon/Fire';
import UnFireIcon from '@src/components/@svgIcon/UnFire';
import Add from './feature/Add';
import Edit from './feature/Edit';
import Del from './feature/Del';
const Modal = new ModalController();
const GameRoom = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const [searchCfg, setSearchCfg] = useState({});

  const columns = useMemo(
    () => [
      {
        header: t('sys.id'),
        accessorKey: 'id',
        enableColumnFilter: false,
      },
      {
        header: t('gameRoom.game_id'),
        accessorKey: 'game_id',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('gameRoom.game_id') },
        filterSelectOptions: gameList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const game = row.getValue('game_id');
          const gameObj = gameList.find((item) => item.value == game);
          return <div>{gameObj?.text}</div>;
        },
      },
      {
        header: t('gameRoom.type'),
        accessorKey: 'type',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('gameRoom.type') },
        filterSelectOptions: typeList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const type = row.getValue('type');
          const typeObj = typeList.find((item) => item.value == type);
          return <div>{typeObj?.text}</div>;
        },
      },
      {
        header: t('gameRoom.name'),
        accessorKey: 'name',
        enableSorting: false,
        enableClickToCopy: true,
        muiFilterTextFieldProps: { placeholder: t('gameRoom.name') },
      },
      {
        header: t('gameRoom.hot'),
        accessorKey: 'hot',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('gameRoom.hot') },
        filterSelectOptions: hotList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const hot = row.getValue('hot');
          const cssStyle = { width: '25px', height: '25px', cursor: 'pointer' };
          return (
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
          );
        },
      },
      {
        header: t('sys.sort'),
        accessorKey: 'sort',
        enableColumnFilter: false,
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
      },
      {
        header: t('sys.action'),
        accessorKey: 'action',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {allPermission.includes('game_room.update') && (
                <Tooltip title={t('sys.edit')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="primary"
                    onClick={async () => {
                      const infoData = await fcGetInfo({
                        id: row.getValue('id'),
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
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="error"
                    onClick={async () => {
                      await Modal.open(Del, {
                        id: row.getValue('id'),
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
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(GameRoom);
