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
import { Button, Stack, Tooltip, Link } from '@mui/material';
// ant-design
import { EditTwoTone, DollarOutlined, ClearOutlined, DownloadOutlined } from '@ant-design/icons';
// custom Component
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import LoadingButton from '@components/@extended/LoadingButton';
import BetRecord from '@pages/GameBetRecord/component/BetRecord';
import { fcMoneyFormat } from '@src/utils/method';
import Edit from './feature/Edit';
import Money from './feature/Money';
import Agent from './feature/Agent';
import ResetLose from './feature/ResetLose';
import Recycle from './feature/Recycle';
import EditStatus from './feature/EditStatus';

const Modal = new ModalController();
const UserMember = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
    created_at1: '',
    created_at2: '',
  });

  const columns = useMemo(
    () => [
      {
        header: t('sys.id'),
        accessorKey: 'id',
        enableColumnFilter: false,
      },
      {
        header: t('sys.username'),
        accessorKey: 'username',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('sys.username') },
        Cell: ({ row }: { row: any }) => {
          const betpermission = allPermission.includes('bet_record.index');
          return (
            <Link
              color={betpermission ? 'primary' : 'inherit'}
              underline={betpermission ? 'always' : 'none'}
              sx={{ cursor: betpermission ? 'pointer' : 'default' }}
              onClick={async () => {
                if (betpermission === false) return;
                if (editLoading) return;
                await Modal.open(BetRecord, {
                  defaultSearchProps: {
                    username: row.getValue('username'),
                  },
                });
              }}
            >
              {row.getValue('username')}
            </Link>
          );
        },
      },
      {
        header: t('sys.name'),
        accessorKey: 'name',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('sys.name') },
        Cell: ({ row }: { row: any }) => {
          const agentpermission = allPermission.includes('agent.index');
          return (
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
              {row.getValue('name')}
            </Link>
          );
        },
      },
      {
        header: t('userAgent.money_type'),
        accessorKey: 'money_type',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('userAgent.money_type') },
        filterSelectOptions: moneyTypeList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const moneyType = row.getValue('money_type');
          const moneyTypeObj = moneyTypeList.find((item) => item.value == moneyType);
          return (
            <Button variant="contained" color={getValueColor(theme, moneyType)}>
              {moneyTypeObj?.text}
            </Button>
          );
        },
      },
      {
        header: t('sys.credit'),
        accessorKey: 'money',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('money'))}</div>;
        },
      },
      {
        header: t('userAgent.money_limit'),
        accessorKey: 'money_limit',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('money_limit'))}</div>;
        },
      },
      {
        header: t('userAgent.lose_limit'),
        accessorKey: 'lose_limit',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('lose_limit'))}</div>;
        },
      },
      {
        header: t('userAgent.payoff'),
        accessorKey: 'payoff',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('payoff'))}</div>;
        },
      },
      {
        header: t('userAgent.rakeback'),
        accessorKey: 'rakeback',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('rakeback'))}%</div>;
        },
      },
      {
        header: t('sys.status'),
        accessorKey: 'status',
        muiFilterTextFieldProps: { placeholder: t('sys.status') },
        filterSelectOptions: statusList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const status = row.getValue('status');
          const statusObj = statusList.find((item) => item.value == status);
          return (
            <LoadingButton
              loading={editLoading === row.getValue('id')}
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
          );
        },
      },
      {
        header: t('sys.created_at'),
        accessorKey: 'created_at',
        enableColumnFilter: false,
      },
      {
        header: t('sys.action'),
        accessorKey: 'action',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {/* 一鍵轉回*/}
              {allPermission.includes('user.money_update') &&
                row.getValue('money_type') === 2 &&
                (row.getValue('status') === 2 || row.getValue('status') === 3) && (
                  <Tooltip title={t('sys.recycle')}>
                    <LoadingButton
                      loading={editLoading === row.getValue('id')}
                      shape="rounded"
                      color="error"
                      onClick={async () => {
                        await Modal.open(Recycle, {
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
                      <DownloadOutlined />
                    </LoadingButton>
                  </Tooltip>
                )}
              {/* 上下分 */}
              {allPermission.includes('user.money_update') && (
                <Tooltip title={t('sys.storage')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="warning"
                    onClick={async () => {
                      await Modal.open(Money, {
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
                    <DollarOutlined />
                  </LoadingButton>
                </Tooltip>
              )}
              {/* 重置輸贏 */}
              {allPermission.includes('user.reset_lose') && row.getValue('payoff') !== 0 && (
                <Tooltip title={t('sys.reset_lose')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="info"
                    onClick={async () => {
                      await Modal.open(ResetLose, {
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
                    <ClearOutlined />
                  </LoadingButton>
                </Tooltip>
              )}
              {/* 編輯 */}
              {allPermission.includes('user.update') && (
                <Tooltip title={t('sys.edit')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="primary"
                    onClick={async () => {
                      const { infoData, agentData } = await fcGetInfo({
                        id: row.getValue('id'),
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
            <Grid xs={12} md={5}>
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
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};
export default withPageHoc(UserMember);
