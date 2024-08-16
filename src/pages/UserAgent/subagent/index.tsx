import { useState, useMemo, useEffect, useRef } from 'react';
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
import { EditTwoTone, PlusOutlined, DollarOutlined, DownloadOutlined } from '@ant-design/icons';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import LoadingButton from '@components/@extended/LoadingButton';
import { ParentSearchType, ParentSearchProps } from '../index';
import Edit from './feature/Edit';
import SubAccAdd from './feature/Add';
import EditStatus from './feature/EditStatus';
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
  });

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
        enableClickToCopy: true,
        enableSorting: false,
        enableColumnFilter: true,
        muiFilterTextFieldProps: { placeholder: t('sys.username') },
        Cell: ({ row }: { row: any }) => {
          return <div>{row.getValue('username')}</div>;
        },
      },
      {
        header: t('sys.name'),
        accessorKey: 'name',
        enableClickToCopy: false,
        enableSorting: false,
        enableColumnFilter: false,
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

  useEffect(() => {
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
  }, [parentSearch.forceUpdate]);

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
          flag: allPermission.includes('agent.credit_update'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: async () => {
            await Modal.open(SubAccAdd, {
              parentData: {
                pid: parentSearch.pid.toString(),
              },
              fetchData: async () => {
                setParentSearch((prevState) => ({
                  ...prevState,
                  forceUpdate: prevState.forceUpdate + 1,
                }));
                fcGetList({
                  pageIndex: 0,
                  pageSize: 1,
                  searchCfg: { ...parentSearch },
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

export default withPageHoc(SubUserTabAgnet);
