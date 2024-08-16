import { useState, useMemo, useEffect, useRef } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo, apiEdit, apiTreeView, apiChangeAg } from '@src/api/UserAgent';
import { IList, IInfo, IAdd, IEdit, IDel } from '@src/api/UserAgent/req';
import { IResInfo } from '@src/api/UserAgent/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Stack, Tooltip, Link } from '@mui/material';
// ant-design
import {
  KeyOutlined,
  EditTwoTone,
  PlusOutlined,
  DollarOutlined,
  DownloadOutlined,
  CopyOutlined,
  DeliveredProcedureOutlined,
} from '@ant-design/icons';
// custom Components
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import LoadingButton from '@components/@extended/LoadingButton';
import { fcMoneyFormat } from '@src/utils/method';
import { ParentSearchType, ParentSearchProps } from '../index';
import ChangeAgTree from '../feature/ChangeAgTree';
import Add from './feature/Add';
import Edit from './feature/Edit';
import Credit from './feature/Credit';
import Recycle from './feature/Recycle';
import EditStatus from './feature/EditStatus';
import AppInfo from './feature/AppInfo';

const Modal = new ModalController();

const UserTabAgnet = ({
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
  const { t, fcShowMsg } = usePage();
  const { allPermission } = menuState;
  // 是否初始或過
  const initRef = useRef(false);
  const [groupList, setGroupList] = useState<TbSelectProps[]>([]);
  const [moneyTypeList, setmoneyTypeList] = useState<TbSelectProps[]>([]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  const [currencyList, setCurrencyList] = useState<TbSelectProps[]>([]);
  const [walletTypeList, setWalletTypeList] = useState<TbSelectProps[]>([]);
  const [roomTypeList, setRoomTypeList] = useState<TbSelectProps[]>([]);
  const [flagList, setFlagList] = useState<TbSelectProps[]>([]);
  //Header Data
  const [headerObj, setHeaderLObj] = useState<IResInfo | any>(null);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({});

  const columns = useMemo(
    () => [
      {
        header: t('sys.id'),
        accessorKey: 'id',
        enableClickToCopy: true,
        enableColumnFilter: false,
      },
      {
        header: t('sys.username'),
        accessorKey: 'username',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Link
              underline="always"
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setParentSearch((prevState: ParentSearchType) => ({
                  ...parentSearch,
                  pid: row.getValue('id'),
                }));
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
        enableClickToCopy: true,
        enableSorting: false,
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
        header: t('userAgent.credit'),
        accessorKey: 'credit',
        muiFilterTextFieldProps: { placeholder: t('userAgent.credit') },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('credit'))}</div>;
        },
      },
      {
        header: t('userAgent.share'),
        accessorKey: 'share',
        muiFilterTextFieldProps: { placeholder: t('userAgent.share') },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('share'))}%</div>;
        },
      },
      {
        header: t('userAgent.rakeback'),
        accessorKey: 'rakeback',
        muiFilterTextFieldProps: { placeholder: t('userAgent.rakeback') },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('rakeback'))}%</div>;
        },
      },
      {
        header: t('userAgent.currency'),
        accessorKey: 'currency',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('userAgent.currency') },
        filterSelectOptions: currencyList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const currency = row.getValue('currency');
          const currencyObj = currencyList.find((item) => item.value == currency);
          return <div>{currencyObj?.text}</div>;
        },
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
        header: t('sys.action'),
        accessorKey: 'action',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center">
              {/* 回收(凍結狀態跟信用版才會有) */}
              {allPermission.includes('agent.credit_update') &&
                row.original.money_type === 2 &&
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
              {/* 上下分 */}
              {allPermission.includes('agent.credit_update') && (
                <Tooltip title={t('sys.storage')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="warning"
                    onClick={async () => {
                      await Modal.open(Credit, {
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
              {/* 新增 */}
              {allPermission.includes('agent.store') && (
                <Tooltip title={t('sys.add')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="success"
                    onClick={async () => {
                      // 往下建立代理
                      await Modal.open(Add, {
                        parentData: {
                          ...row.original,
                          pid: row.original.id,
                          money_type: row.original.money_type,
                          currency: row.original.currency,
                        },
                        groupList,
                        moneyTypeList,
                        typeList,
                        statusList,
                        currencyList,
                        walletTypeList,
                        roomTypeList,
                        flagList,
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
                    <PlusOutlined twoToneColor={theme.palette.primary.main} />
                  </LoadingButton>
                </Tooltip>
              )}
              {/* 編輯 */}
              {allPermission.includes('agent.update') && (
                <Tooltip title={t('sys.edit')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="primary"
                    onClick={async () => {
                      const infoData = await fcGetInfo({ id: row.getValue('id') });
                      await Modal.open(Edit, {
                        parentData: { ...headerObj },
                        infoData,
                        groupList,
                        moneyTypeList,
                        typeList,
                        statusList,
                        currencyList,
                        walletTypeList,
                        roomTypeList,
                        flagList,
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
              {allPermission.includes('agent.change') && (
                <Tooltip title={t('userAgent.changeAgent')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="error"
                    onClick={async () => {
                      try {
                        setEditLoading(0);
                        const { code, data } = await apiTreeView();
                        if (code === 200) {
                          setEditLoading(null);
                          await Modal.open(ChangeAgTree, {
                            dataList: data,
                            fetchData: async (selectId: number) => {
                              try {
                                const postData = {
                                  id: row.getValue('id'),
                                  pid: selectId,
                                };
                                console.log(postData);
                                const { code } = await apiChangeAg(postData);
                                if (code === 200) {
                                  await fcShowMsg({ type: 'success', msg: t('sys.editSuc') });
                                }
                              } catch (error: any) {
                                fcShowMsg({ type: 'error', msg: error.message });
                              }
                            },
                          });
                        }
                      } catch (error: any) {
                        fcShowMsg({ type: 'error', msg: error.message });
                        setEditLoading(null);
                      }
                    }}
                  >
                    <DeliveredProcedureOutlined twoToneColor={theme.palette.error.main} />
                  </LoadingButton>
                </Tooltip>
              )}
              {/* appInfo */}
              <Tooltip title={t('userAgent.app')}>
                <LoadingButton
                  loading={editLoading === row.getValue('id')}
                  shape="rounded"
                  color="info"
                  onClick={async () => {
                    const infoData = await fcGetInfo({ id: row.getValue('id') });
                    await Modal.open(AppInfo, {
                      infoData,
                    });
                  }}
                >
                  <KeyOutlined />
                </LoadingButton>
              </Tooltip>
              {/* copy */}
              <CopyToClipboard
                text={`${t('userAgent.agentAdminUrl')}: agent.rglivebc.com\n\n${t(
                  'sys.agent',
                )}\n${t('sys.name')}:${row.original.name}\n${t('sys.username')}:${
                  row.original.username
                }\n${t('sys.password')}:\n${t('userAgent.credit')}:${fcMoneyFormat(
                  row.original.credit,
                )}\n${t('userAgent.share')}:${row.original.share}%\n${t('userAgent.rakeback')}:${
                  row.original.rakeback
                }%\n${t('userAgent.copyTxt1')}\n${t(
                  'userAgent.copyTxt2',
                )}\nhttps://t.me/+ZjBtTEPxS_o0NWQ9
                  `}
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
      searchCfg,
      headerObj,
      groupList,
      moneyTypeList,
      statusList,
      roomTypeList,
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
      const currencyList: TbSelectProps[] = Object.entries(refer.currency).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const walletTypeList: TbSelectProps[] = Object.entries(refer.wallet_type).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const roomTypeList: TbSelectProps[] = Object.entries(refer.room_type).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const flagList: TbSelectProps[] = Object.entries(refer.flag).map(
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
      setCurrencyList(currencyList);
      setWalletTypeList(walletTypeList);
      setRoomTypeList(roomTypeList);
      setFlagList(flagList);
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
            Modal.open(Add, {
              parentData: {
                ...headerObj,
                pid: headerObj ? headerObj.id : 0, //建立同一層
                level: headerObj ? headerObj.level : 0,
              },
              groupList,
              moneyTypeList,
              typeList,
              statusList,
              currencyList,
              walletTypeList,
              roomTypeList,
              flagList,
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

export default withPageHoc(UserTabAgnet);
