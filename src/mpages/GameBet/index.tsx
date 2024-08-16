import { useState, useMemo, useEffect } from 'react';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/GameBet';
import { IInfo } from '@api/GameBet/req';
import { IResInfo } from '@api/GameBet/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Tooltip, Divider } from '@mui/material';
// ant-design
import { EditTwoTone } from '@ant-design/icons';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/MBase';
import LoadingButton from '@components/@extended/LoadingButton';
import Edit from '@pages/GameBet/feature/Edit';

const Modal = new ModalController();

const MGameBet = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
  const {
    theme,
    menuState,
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
        header: '',
        accessorKey: 'id',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          const game = row.original.game_id;
          const gameObj = gameList.find((item) => item.value == game);
          const category = row.original.category;
          const categoryObj = categoryList.find((item) => item.value == category);
          const odds2Txt = row.original.odds2 > 0 ? row.original.odds2 : '-';
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
                  <Grid>{t('gameBet.game_id')}</Grid>
                  <Grid>{gameObj?.text}</Grid>
                </Grid>

                <Grid xs={6} textAlign="right">
                  <Grid>{t('gameBet.values')}</Grid>
                  <Grid>{row.original.values}</Grid>
                </Grid>
                <Grid xs={6}>
                  <Grid>{t('gameBet.category')}</Grid>
                  <Grid> {categoryObj?.text}</Grid>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <Grid>
                    {t('gameBet.odds')} / {t('gameBet.odds2')}
                  </Grid>
                  <Grid>
                    {row.original.odds} / {odds2Txt}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
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
        renderDetailPanel={({ row }: { row: any }) => {
          return (
            <Grid container p={0.5}>
              <Grid xs={4} my={1}>
                {t('sys.created_at')}:
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                <Grid>{row.original.created_at}</Grid>
                <Grid
                  style={{
                    color: theme.palette.info.main,
                  }}
                >
                  {row.original.created_by}
                </Grid>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('sys.updated_at')}:
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                <Grid>{row.original.updated_at}</Grid>
                <Grid
                  style={{
                    color: theme.palette.info.main,
                  }}
                >
                  {row.original.updated_by}
                </Grid>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('sys.action')}:
              </Grid>
              <Grid xs={8} my={0.1} textAlign="right">
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                  {allPermission.includes('game_betarea.update') && (
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
              </Grid>
            </Grid>
          );
        }}
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(MGameBet);
