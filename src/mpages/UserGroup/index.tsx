import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/UserGroup';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/UserGroup/req';
import { IResInfo } from '@api/UserGroup/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Typography, Button, Stack, Tooltip, Divider } from '@mui/material';
// ant-design
import { CopyOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/MBase';
import LoadingButton from '@components/@extended/LoadingButton';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SearchOutLine from '@components/search/InputOutline';
import SelectOutline from '@components/search/SelectOutline';
import Add from '@pages/UserGroup/feature/Add';
import Edit from '@pages/UserGroup/feature/Edit';
import Del from '@pages/UserGroup/feature/Del';
import { fcMoneyFormat } from '@src/utils/method';

const Modal = new ModalController();

const MUserGroup = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    type: '',
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
          const status = row.original.status;
          const statusObj = statusList.find((item) => item.value == status);
          return (
            <Grid
              container
              spacing={2}
              textAlign="left"
              alignItems="center"
              style={{ minWidth: '75vw' }}
            >
              <Grid xs={2.5} textAlign="center">
                {row.original.id}
              </Grid>
              <Grid container xs={9.5}>
                <Grid xs={6}>
                  <Grid> {t('sys.type')}</Grid>
                  <Grid style={{ color: theme.palette.info.main }}> {typeObj?.text}</Grid>
                </Grid>

                <Grid xs={6} textAlign="right">
                  <Grid>{t('sys.bet_min')}</Grid>
                  <Grid>{fcMoneyFormat(row.original.bet_min)}</Grid>
                </Grid>
                <Grid xs={6}>
                  <Grid> {t('sys.name')}</Grid>
                  <Grid>{row.original.name}</Grid>
                </Grid>

                <Grid xs={6} textAlign="right">
                  <Grid>
                    {t('sys.bet_max')}
                    <div>{fcMoneyFormat(row.original.bet_max)}</div>
                  </Grid>
                </Grid>

                <Grid xs={6}>
                  <Grid>{t('sys.created_at')}:</Grid>
                  <Grid>{row.original.created_at}</Grid>
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
    [t, theme, allPermission, editLoading, searchCfg, typeList, statusList],
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
      const typeList: TbSelectProps[] = Object.entries(refer.type).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const statusList: TbSelectProps[] = refer.status.map((key: string, value: string) => ({
        text: key,
        value: value.toString(),
      }));
      //Search Cfg
      setTypeList(typeList);
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
          flag: allPermission.includes('user_group.store'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            Modal.open(Add, {
              defautSort: pgCfg.pageTotal + 1,
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
                placeholder={t('sys.status')}
                options={statusList}
                value={searchCfg.status || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, status: value });
                }}
              />
            </Grid>
            <Grid xs={12} mt={0.5}>
              <SelectOutline
                placeholder={t('sys.type')}
                options={typeList}
                value={searchCfg.type || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, type: value });
                }}
              />
            </Grid>

            <Grid xs={12}>
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
              <Grid xs={4} mt={1} mb={1}>
                {t('sys.sort')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                {row.original.sort}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('sys.updated_at')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                {row.original.updated_at}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('sys.action')}:
              </Grid>
              <Grid xs={8} textAlign="right">
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                  {allPermission.includes('user_group.update') && (
                    <Tooltip title={t('sys.edit')}>
                      <LoadingButton
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="primary"
                        onClick={async () => {
                          const infoData = await fcGetInfo({ id: row.original.id });
                          await Modal.open(Edit, {
                            infoData,
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
                  {allPermission.includes('user_group.destroy') && (
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

export default withPageHoc(MUserGroup);
