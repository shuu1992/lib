import { useState, useMemo, useEffect, useRef } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo, apiEdit } from '@src/api/UserMember';
import { IList, IInfo, IAdd, IEdit, IDel } from '@src/api/UserMember/req';
import { IResInfo } from '@src/api/UserMember/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import { Button, Stack, Tooltip } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
// ant-design
import {
  EditTwoTone,
  DollarOutlined,
  ClearOutlined,
  DownloadOutlined,
  CopyOutlined,
} from '@ant-design/icons';
// custom Components
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@components/muiTable/Base';
import LoadingButton from '@components/@extended/LoadingButton';
import { fcMoneyFormat } from '@src/utils/method';
import { ParentSearchProps } from '../index';
import Add from './feature/Add';
import Edit from './feature/Edit';
import Money from './feature/Money';
import ResetLose from './feature/ResetLose';
import Recycle from './feature/Recycle';
import EditStatus from './feature/EditStatus';

const Modal = new ModalController();

const UserAgetnTabMember = ({
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
  const [flagList, setFlagList] = useState<TbSelectProps[]>([]);
  const [groupList, setGroupList] = useState<TbSelectProps[]>([]);
  const [moneyTypeList, setmoneyTypeList] = useState<TbSelectProps[]>([]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  //Header Data
  const [headerObj, setHeaderLObj] = useState<IResInfo | any>(null);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    agent_id: parentSearch.pid,
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
        enableClickToCopy: true,
        muiFilterTextFieldProps: { placeholder: t('sys.username') },
      },
      {
        header: t('sys.name'),
        accessorKey: 'name',
        enableSorting: false,
        enableClickToCopy: true,
        muiFilterTextFieldProps: { placeholder: t('sys.name') },
      },
      {
        header: t('userAgent.money_type'),
        accessorKey: 'money_type',
        enableSorting: false,
        enableColumnFilter: false,
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
        header: t('userAgent.money'),
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
          return <div> {fcMoneyFormat(row.getValue('rakeback'))}%</div>;
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
                if (allPermission.includes('user.update') === false) return;
                await Modal.open(EditStatus, {
                  infoData: row.original,
                  fetchData: async () => {
                    dataList.find((item: any) => item.id === row.getValue('id')).status =
                      status === 1 ? 2 : 1;
                    setDataList((prevState: IResInfo[]) => [...prevState]);
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
              {statusObj?.text}
            </LoadingButton>
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
              {/* 一鍵轉回 */}
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
                      <DownloadOutlined />
                    </LoadingButton>
                  </Tooltip>
                )}
              {/* 儲值 */}
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
                      const infoData = await fcGetInfo({ id: row.getValue('id') });
                      await Modal.open(Edit, {
                        parentData: {
                          ...headerObj,
                        },
                        infoData,
                        flagList,
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
              {/* copy */}
              <CopyToClipboard
                text={`${t('userAgent.gameUrl')}: rglivebc.com\n\n${t('userAgent.player')}\n${t(
                  'sys.name',
                )}: ${row.original.name}\n${t('sys.username')}: ${row.original.username}\n${t(
                  'sys.password',
                )}:\n${t('userAgent.money')}: ${fcMoneyFormat(row.original.money)}\n${t(
                  'userAgent.money_limit',
                )}: ${fcMoneyFormat(row.original.money_limit)}\n${t('userAgent.group_id')}: ${
                  groupList.find((item) => item.value == row.original.group_id)?.text
                }\n\n${t('userAgent.copyTxt3')}\n${t(
                  'userAgent.copyTxt4',
                )}\nhttps://t.me/+ZjBtTEPxS_o0NWQ9`}
              >
                <LoadingButton shape="rounded" style={{ color: theme.palette.text.primary }}>
                  <CopyOutlined />
                </LoadingButton>
              </CopyToClipboard>
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
      parentSearch,
      groupList,
      moneyTypeList,
      statusList,
      flagList,
    ],
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
      initRef.current = true;
      //Search Cfg
      setFlagList(flagList);
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
    searchCfg.agent_id = parentSearch.pid;
    if (initRef.current === false) return;
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
          flag: allPermission.includes('user.store'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            Modal.open(Add, {
              parentData: {
                ...headerObj,
                agent_id: parentSearch.pid,
              },
              flagList,
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
                  searchCfg: { ...parentSearch, ...searchCfg, ...tSearchCfg },
                });
              },
            });
          },
        }}
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(UserAgetnTabMember);
