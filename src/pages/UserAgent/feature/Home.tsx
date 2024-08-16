import { useState, useMemo, useEffect, Ref, useImperativeHandle } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo, apiEdit } from '@src/api/UserAgent';
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
} from '@ant-design/icons';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@components/muiTable/Base';
import LoadingButton from '@components/@extended/LoadingButton';
import { fcMoneyFormat } from '@src/utils/method';
import Add from '../agent/feature/Add';
import Edit from '../agent/feature/Edit';
import Credit from '../agent/feature/Credit';
import Recycle from '../agent/feature/Recycle';
import EditStatus from '../agent/feature/EditStatus';
import AppInfo from '../agent/feature/AppInfo';
import { ParentSearchType, ParentSearchProps, RefType } from '../index';

const Modal = new ModalController();

const UserAgentHome = (
  {
    refs,
    parentSearch,
    setStep,
    setParentSearch,
    pageHocProps = defaultPageHocProps,
  }: WithPageHocProps & ParentSearchProps & { refs: Ref<RefType> },
  ref: Ref<RefType>,
) => {
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
  const { allPermission } = menuState;
  const { t } = usePage();
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
        header: t('userAgent.username'),
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
                  nopid: '',
                  pid: row.getValue('id'),
                  username: '',
                }));
                setStep('sub');
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
        header: t('userAgent.credit'),
        accessorKey: 'credit',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('credit'))}</div>;
        },
      },
      {
        header: t('userAgent.share'),
        accessorKey: 'share',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return <div> {row.getValue('share')}%</div>;
        },
      },
      {
        header: t('userAgent.rakeback'),
        accessorKey: 'rakeback',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return <div> {row.getValue('rakeback')}%</div>;
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
              {/* 回收(凍結狀態跟現金才會有) */}
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
                        parentData: {
                          ...headerObj,
                          pid: headerObj ? headerObj.id : 0, //建立同一層
                          level: headerObj ? headerObj.level : 0,
                          money_type: headerObj ? headerObj.money_type : '',
                          share: headerObj ? headerObj.share : 100,
                          rakeback: headerObj ? headerObj.rakeback : 100,
                          currency: headerObj ? headerObj.currency : '',
                        },
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
  useImperativeHandle(refs, () => ({ fcGetList }));
  useEffect(() => {
    if (parentSearch.nopid == 1) return;
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
                money_type: headerObj ? headerObj.money_type : '',
                share: headerObj ? headerObj.share : 100,
                rakeback: headerObj ? headerObj.rakeback : 100,
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

export default withPageHoc(UserAgentHome);
