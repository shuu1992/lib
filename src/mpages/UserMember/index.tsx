import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo, apiEdit } from '@api/UserMember';
import { apiInfo as apiAgInfo } from '@api/UserAgent';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/UserMember/req';
import { IResInfo } from '@api/UserMember/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Stack, Tooltip, Link, Divider, Typography } from '@mui/material';
// ant-design
import { EditTwoTone, DollarOutlined, ClearOutlined, DownloadOutlined } from '@ant-design/icons';
// custom Component
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/MBase';
import LoadingButton from '@components/@extended/LoadingButton';
import SearchOutLine from '@components/search/InputOutline';
import SelectOutline from '@components/search/SelectOutline';
import Edit from '@pages/UserMember/feature/Edit';
import Money from '@pages/UserMember/feature/Money';
import ResetLose from '@pages/UserMember/feature/ResetLose';
import Recycle from '@pages/UserMember/feature/Recycle';
import EditStatus from '@pages/UserMember/feature/EditStatus';
import BetRecord from '@mpages/GameBetRecord/component/BetRecord';
import { fcMoneyFormat } from '@src/utils/method';
import Agent from './feature/Agent';

const Modal = new ModalController();
const MUserMember = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const [flagList, setFlagList] = useState<TbSelectProps[]>([]);
  const [groupList, setGroupList] = useState<TbSelectProps[]>([]);
  const [moneyTypeList, setmoneyTypeList] = useState<TbSelectProps[]>([]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    username: '',
    name: '',
    flag: '',
    status: '',
    type: '',
    created_at1: '',
    created_at2: '',
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
          const betpermission = allPermission.includes('bet_record.index');
          const agentpermission = allPermission.includes('agent.index');

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
                  <Grid>{t('sys.username')}</Grid>
                  <Grid>
                    <Link
                      color={betpermission ? 'primary' : 'inherit'}
                      underline={betpermission ? 'always' : 'none'}
                      sx={{ cursor: betpermission ? 'pointer' : 'default' }}
                      onClick={async () => {
                        if (betpermission === false) return;
                        if (editLoading) return;
                        await Modal.open(BetRecord, {
                          defaultSearchProps: {
                            username: row.original.username,
                          },
                        });
                      }}
                    >
                      {row.original.username}
                    </Link>
                  </Grid>
                </Grid>

                <Grid xs={6} textAlign="right">
                  <Grid>{t('sys.credit')}</Grid>
                  <Grid>{fcMoneyFormat(row.original.money)}</Grid>
                </Grid>
                <Grid xs={6}>
                  <Grid>{t('sys.name')}</Grid>
                  <Grid>
                    <Link
                      color={agentpermission ? 'error' : 'inherit'}
                      underline={agentpermission ? 'always' : 'none'}
                      sx={{ cursor: agentpermission ? 'pointer' : 'default' }}
                      onClick={async () => {
                        if (editLoading) return;
                        await Modal.open(Agent, {
                          agent_path: row.original.agent_path,
                        });
                      }}
                    >
                      {row.original.name}
                    </Link>
                  </Grid>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <Grid>{t('userAgent.payoff')}</Grid>
                  <Grid>
                    <Typography
                      style={{
                        color:
                          row.original.payoff >= 0
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                      }}
                    >
                      {fcMoneyFormat(row.original.payoff)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid xs={6}>
                  <Grid>{t('sys.created_at')}:</Grid>
                  <Grid>{row.original.created_at}</Grid>
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
    [
      t,
      theme,
      allPermission,
      editLoading,
      searchCfg,
      flagList,
      groupList,
      moneyTypeList,
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
        item.action = item.id as number;
      });
      const flagList: TbSelectProps[] = Object.entries(refer.flag).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
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
      //Search Cfg
      setFlagList(flagList);
      setGroupList(groupList);
      setmoneyTypeList(moneyTypeList);
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

  const fcGetInfo = async ({ id, agent_id }: { id: number; agent_id: number }) => {
    setEditLoading(id);
    try {
      const [infoData, agentData] = await Promise.all([
        apiInfo({ id }),
        apiAgInfo({ id: agent_id }),
      ]);
      setEditLoading(null);
      return Promise.resolve({ infoData: infoData.data, agentData: agentData.data });
    } catch (error: any) {
      setEditLoading(null);
      throw error;
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
              <SearchOutLine
                placeholder={t('sys.name')}
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
                placeholder={t('sys.type')}
                options={typeList}
                value={searchCfg.type || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, type: value });
                }}
              />
            </Grid>
            <Grid xs={12} mt={0.5}>
              <SelectOutline
                placeholder={t('userMember.flag')}
                options={flagList}
                value={searchCfg.flag || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, flag: value });
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
            <Grid xs={12} mt={0.5}>
              <SearchDateTimeRgPicker
                showShortcutsItems={false}
                start={searchCfg.created_at1 || ''}
                end={searchCfg.created_at2 || ''}
                placeholderI18nKey="sys.created_at"
                startKey={'created_at1'}
                endKey={'created_at2'}
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
        renderDetailPanel={({ row }: { row: any }) => {
          const moneyType = row.original.type;
          const moneyTypeObj = moneyTypeList.find((item) => item.value == moneyType);
          const flag = row.original.flag;
          const flagObj = flagList.find((item) => item.value == flag);
          return (
            <Grid container p={0.5}>
              <Grid xs={4} mt={1} mb={1}>
                {t('userAgent.money_type')}
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                {moneyTypeObj?.text}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>

              <Grid xs={4} mt={1} mb={1}>
                {t('userAgent.money_limit')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <div>{fcMoneyFormat(row.original.money_limit)}</div>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('userAgent.lose_limit')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <div>{fcMoneyFormat(row.original.lose_limit)}</div>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('userAgent.rakeback')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <div>{fcMoneyFormat(row.original.rakeback)}%</div>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('sys.action')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                  {/* 一鍵轉回 */}
                  {allPermission.includes('user.money_update') &&
                    row.original.money_type === 2 &&
                    (row.original.status === 2 || row.original.status === 3) && (
                      <Tooltip title={t('sys.recycle')}>
                        <LoadingButton
                          loading={editLoading === row.original.id}
                          shape="rounded"
                          color="error"
                          onClick={async () => {
                            await Modal.open(Recycle, {
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
                          <DownloadOutlined />
                        </LoadingButton>
                      </Tooltip>
                    )}
                  {/* 上下分 */}
                  {allPermission.includes('user.money_update') && (
                    <Tooltip title={t('sys.storage')}>
                      <LoadingButton
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="warning"
                        onClick={async () => {
                          await Modal.open(Money, {
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
                        <DollarOutlined />
                      </LoadingButton>
                    </Tooltip>
                  )}
                  {/* 重置輸贏 */}
                  {allPermission.includes('user.reset_lose') && row.original.payoff !== 0 && (
                    <Tooltip title={t('sys.reset_lose')}>
                      <LoadingButton
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="info"
                        onClick={async () => {
                          await Modal.open(ResetLose, {
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
                        <ClearOutlined />
                      </LoadingButton>
                    </Tooltip>
                  )}
                  {/* 編輯 */}
                  {allPermission.includes('user.update') && (
                    <Tooltip title={t('sys.edit')}>
                      <LoadingButton
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="primary"
                        onClick={async () => {
                          const { infoData, agentData } = await fcGetInfo({
                            id: row.original.id,
                            agent_id: row.original.agent_id,
                          });
                          await Modal.open(Edit, {
                            parentData: agentData,
                            infoData: infoData,
                            flagList,
                            groupList,
                            moneyTypeList,
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
export default withPageHoc(MUserMember);
