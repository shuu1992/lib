import { useState, useMemo, useEffect } from 'react';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/GameManage';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/GameManage/req';
import { IResInfo } from '@api/GameManage/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Stack, Tooltip, Divider } from '@mui/material';
// ant-design
import { EditTwoTone, DeleteTwoTone, CopyOutlined } from '@ant-design/icons';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PageTable from '@components/muiTable/MBase';
import SearchOutLine from '@components/search/InputOutline';
import SelectOutline from '@components/search/SelectOutline';
import LoadingButton from '@components/@extended/LoadingButton';
import Add from '@pages/GameManage/feature/Add';
import Edit from '@pages/GameManage/feature/Edit';
import Del from '@pages/GameManage/feature/Del';

const Modal = new ModalController();
const MGameManage = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    name: '',
    status: '',
  });
  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'username',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
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
              <Grid container xs={9.5} display="flex" alignItems="center">
                <Grid xs={6}>
                  <Grid>{t('sys.name')}</Grid>
                  <Grid>
                    <CopyToClipboard text={row.original.name}>
                      <Grid p={0}>
                        {row.original.name}
                        <CopyOutlined style={{ marginLeft: '0.5rem' }} />
                      </Grid>
                    </CopyToClipboard>
                  </Grid>
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
    [t, theme, allPermission, editLoading, searchCfg, statusList],
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
      const statusList: TbSelectProps[] = Object.entries(refer.status).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      //Search Cfg
      setStatusList(statusList);
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
          flag: allPermission.includes('game.store'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            Modal.open(Add, {
              defautSort: pgCfg.pageTotal + 1,
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
          return (
            <Grid container p={0.5}>
              <Grid xs={4} p={0}>
                {t('sys.created_at')}:
              </Grid>
              <Grid xs={8} mb={1} textAlign="right">
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
              <Grid xs={4} mt={1}>
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
                {t('sys.sort')}:
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                <div>{row.original.sort}</div>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('sys.action')}:
              </Grid>
              <Grid xs={8} textAlign="right">
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                  {allPermission.includes('game.update') && (
                    <Tooltip title={t('sys.edit')}>
                      <LoadingButton
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="primary"
                        onClick={async () => {
                          const infoData = await fcGetInfo({ id: row.original.id });
                          await Modal.open(Edit, {
                            infoData,
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

                  {allPermission.includes('game.destroy') && (
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
                                searchCfg: { ...searchCfg, ...tSearchCfg },
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

export default withPageHoc(MGameManage);
