import { useState, useMemo, useEffect, useRef } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo, apiEdit } from '@src/api/UserAgent';
import { IInfo } from '@src/api/UserAgent/req';
import { IResInfo } from '@src/api/UserAgent/res';
import { getValueColor } from '@utils/setColors';
// ant-design
import { EditTwoTone } from '@ant-design/icons';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Stack, Tooltip, Link, Divider } from '@mui/material';
// ant-design
import { CopyOutlined } from '@ant-design/icons';

// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SearchOutLine from '@components/search/InputOutline';
import SelectOutline from '@components/search/SelectOutline';
import PageTable from '@src/components/muiTable/MBase';
import LoadingButton from '@components/@extended/LoadingButton';
import Edit from '@pages/UserAgent/subagent/feature/Edit';
import SubAccAdd from '@pages/UserAgent/subagent/feature/Add';
import EditStatus from '@pages/UserAgent/subagent/feature/EditStatus';
import { ParentSearchProps, ParentSearchType } from './index';

const Modal = new ModalController();

const SubUserTabAgnet = ({
  parentSearch,
  step,
  setStep,
  setParentSearch,
  pageHocProps = defaultPageHocProps,
}: WithPageHocProps & ParentSearchProps) => {
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
  // 是否初始或過
  const initRef = useRef(false);
  const [groupList, setGroupList] = useState<TbSelectProps[]>([]);
  const [moneyTypeList, setmoneyTypeList] = useState<TbSelectProps[]>([]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  //Header Data
  const [headerObj, setHeaderLObj] = useState<IResInfo | any>(null);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    sub: 1,
    username: '',
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
            >
              <Grid xs={2.5} textAlign="center">
                {row.original.id}
              </Grid>
              <Grid container xs={9.5}>
                <Grid xs={6}>
                  <Grid>
                    <CopyToClipboard text={row.original.username}>
                      <Grid p={0}>
                        {row.original.username}
                        <CopyOutlined />
                      </Grid>
                    </CopyToClipboard>
                  </Grid>
                  <Grid> ({row.original.name})</Grid>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <LoadingButton
                    loading={editLoading === row.original.id}
                    variant="outlined"
                    color={getValueColor(theme, status)}
                    onClick={async () => {
                      if (allPermission.includes('agent.update') === false) return;
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
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          );
        },
      },
    ],
    [t, theme, allPermission, editLoading, searchCfg, groupList, moneyTypeList, statusList],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, refer, meta, header } = await apiList({
        ...parentSearch,
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      data.map((item: IResInfo) => {
        item.action = item.id as number;
      });
      const groupList: TbSelectProps[] = Object.entries(refer.group_id).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const moneyTypeList: TbSelectProps[] = Object.entries(refer.money_type).map(
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
      const statusList: TbSelectProps[] = Object.entries(refer.status).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      initRef.current = true;
      //Search Cfg
      setGroupList(groupList);
      setmoneyTypeList(moneyTypeList);
      setTypeList(typeList);
      setStatusList(statusList);
      //Base setting
      setHeaderLObj(header);
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
    if (initRef.current === false) return;
    if (parentSearch.nopid === 1) return;
    if (pgCfg.pageIndex > 0) {
      setPgCfg((prevState: PgCfgProps) => ({
        ...prevState,
        pageIndex: 0,
      }));
      return;
    }

    fcGetList({
      ...pgCfg,
      searchCfg: { ...parentSearch, ...searchCfg, ...tSearchCfg },
    });
  }, [parentSearch.pid, parentSearch.nopid]);

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
        searchExpandCfg={{ flag: false }}
        fetchData={fcGetList}
        loadingCfg={{
          flag: true,
          anim: loadingFlag,
          setFlag: () => {
            setParentSearch((prevState) => ({
              ...prevState,
              forceUpdate: prevState.forceUpdate + 1,
            }));
            fcGetList({
              ...pgCfg,
              searchCfg: { ...parentSearch, ...searchCfg, ...tSearchCfg },
            });
          },
        }}
        addCfg={{
          flag: allPermission.includes('agent.store'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            Modal.open(SubAccAdd, {
              parentData: {
                pid: parentSearch.pid as string,
              },
              fetchData: async () => {
                fcGetList({
                  pageIndex: 0,
                  pageSize: 25,
                  searchCfg: { ...parentSearch, ...searchCfg, ...tSearchCfg },
                });
              },
            });
          },
        }}
        searchComponent={
          <Grid container xs={12} spacing={2}>
            <Grid xs={12}>
              <SearchOutLine
                placeholder={t('sys.username')}
                value={searchCfg.username || ''}
                setValue={(value: string) => {
                  setSearchCfg((prevState) => ({
                    ...prevState,
                    username: value,
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
              <Grid xs={4} mt={1} mb={1}>
                <Grid>{t('sys.created_at')}:</Grid>
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <Grid>{row.original.created_at}</Grid>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('sys.action')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                  {/* 編輯 */}
                  {allPermission.includes('agent.update') && (
                    <Tooltip title={t('sys.edit')}>
                      <LoadingButton
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="primary"
                        onClick={async () => {
                          const infoData = await fcGetInfo({ id: row.original.id });
                          await Modal.open(Edit, {
                            parentData: { ...headerObj },
                            infoData,
                            groupList,
                            moneyTypeList,
                            typeList,
                            statusList,
                            fetchData: async () => {
                              setParentSearch((prevState) => ({
                                ...prevState,
                                forceUpdate: prevState.forceUpdate + 1,
                              }));
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

export default withPageHoc(SubUserTabAgnet);
