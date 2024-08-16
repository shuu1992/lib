import { useState, useMemo, useEffect } from 'react';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/GameBet';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/GameBet/req';
import { IResInfo } from '@api/GameBet/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Tooltip } from '@mui/material';
// ant-design
import { EditTwoTone } from '@ant-design/icons';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import LoadingButton from '@components/@extended/LoadingButton';
import Edit from './feature/Edit';
const Modal = new ModalController();

const GameBet = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const [gameList, setGameList] = useState<TbSelectProps[]>([]);
  const [categoryList, setCategoryList] = useState<TbSelectProps[]>([]);
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
        header: t('gameBet.game_id'),
        accessorKey: 'game_id',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          const game = row.getValue('game_id');
          const gameObj = gameList.find((item) => item.value == game);
          return <div>{gameObj?.text}</div>;
        },
      },
      {
        header: t('gameBet.category'),
        accessorKey: 'category',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          const category = row.getValue('category');
          const categoryObj = categoryList.find((item) => item.value == category);
          return <div>{categoryObj?.text}</div>;
        },
      },
      {
        header: t('gameBet.values'),
        accessorKey: 'values',
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        header: `${t('gameBet.odds')} / ${t('gameBet.odds2')}`,
        accessorKey: 'odds',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          const odds2Txt = row.original.odds2 > 0 ? row.original.odds2 : '-';
          return (
            <div>
              {row.getValue('odds')} / {odds2Txt}
            </div>
          );
        },
      },
      {
        header: t('sys.created_at'),
        accessorKey: 'created_at',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div>{row.getValue('updated_at')}</div>
              <div
                style={{
                  color: theme.palette.info.main,
                }}
              >
                {row.original.created_by}
              </div>
            </div>
          );
        },
      },
      {
        header: t('sys.updated_at'),
        accessorKey: 'updated_at',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div>{row.getValue('updated_at')}</div>
              <div
                style={{
                  color: theme.palette.info.main,
                }}
              >
                {row.original.updated_by}
              </div>
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
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {allPermission.includes('game_betarea.update') && (
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
                        gameList,
                        categoryList,
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
            </Stack>
          );
        },
      },
    ],
    [t, theme, allPermission, editLoading, searchCfg, gameList, categoryList],
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
      const gameList: TbSelectProps[] = Object.entries(refer.game).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const categoryList: TbSelectProps[] = Object.entries(refer.category).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      //Search Cfg
      setGameList(gameList);
      setCategoryList(categoryList);
      //Base setting
      setPgCfg((prevState: PgCfgProps) => ({
        ...prevState,
        pageTotal: meta.total,
      }));
      setDataList((prevState: IResInfo[]) => data);
      setLoadingFlag(false);
      return;
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
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(GameBet);
