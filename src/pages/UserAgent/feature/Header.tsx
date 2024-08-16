import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import useAuth from '@hooks/useAuth';
import usePage from '@hooks/usePage';
import { apiList, apiInfo, apiEdit } from '@src/api/UserAgent';
import { IList, IInfo, IAdd, IEdit, IDel } from '@src/api/UserAgent/req';
import { IResInfo } from '@src/api/UserAgent/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import { Stack, Breadcrumbs, Link, Typography, Tooltip, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// ant-design
import { HomeOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
// custom Components
import LoadingButton from '@components/@extended/LoadingButton';
import SimpleTable from '@components/muiTable/Simple';
import { ModalController, ModalContainer } from 'react-modal-global';
import { fcMoneyFormat } from '@src/utils/method';
import Recycle from '../agent/feature/Recycle';
import SubAccAdd from '../subagent/feature/Add';
import { StepType, ParentSearchType } from '../index';

const Modal = new ModalController();
const Header = ({
  parentSearch,
  step,
  setStep,
  setParentSearch,
  pageHocProps = defaultPageHocProps,
}: WithPageHocProps & {
  parentSearch: ParentSearchType;
  step: StepType;
  setStep: (step: StepType) => void;
  setParentSearch: (cb: (value: ParentSearchType) => ParentSearchType) => void;
}) => {
  const { theme, menuState, editLoading, setEditLoading } = pageHocProps;
  const { authState } = useAuth();
  const { t } = usePage();
  const { allPermission } = menuState;
  const [groupList, setGroupList] = useState<TbSelectProps[]>([]);
  const [moneyTypeList, setmoneyTypeList] = useState<TbSelectProps[]>([]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  const [currencyList, setCurrencyList] = useState<TbSelectProps[]>([]);

  //Header Data
  const [bcList, setbcList] = useState<{ id: number; name: string }[]>([]);
  const [headerObj, setHeaderObj] = useState<IResInfo | any>(null);
  const columns = useMemo(
    () => [
      {
        header: t('sys.id'),
        accessorKey: 'id',
        enableSorting: false,
      },
      {
        header: t('sys.username'),
        accessorKey: 'username',
        enableClickToCopy: true,
        enableSorting: false,
      },
      {
        header: t('sys.name'),
        accessorKey: 'name',
        enableClickToCopy: true,
        enableSorting: false,
      },
      {
        header: t('userAgent.money_type'),
        accessorKey: 'money_type',
        enableSorting: false,
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
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('credit'))}</div>;
        },
      },
      {
        header: t('userAgent.share'),
        accessorKey: 'share',
        enableSorting: false,
      },
      {
        header: t('userAgent.rakeback'),
        accessorKey: 'rakeback',
        enableSorting: false,
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
        Cell: ({ row }: { row: any }) => {
          const status = row.getValue('status');
          const statusObj = statusList.find((item) => item.value == status);
          return (
            <LoadingButton
              loading={editLoading === row.getValue('id')}
              variant="outlined"
              color={getValueColor(theme, status)}
              onClick={async () => {
                return;
                // if (allPermission.includes('agent.update') === false) return;
                // setEditLoading(row.getValue('id'));
                // try {
                //   const { code } = await apiEdit({
                //     id: row.getValue('id'),
                //     status: status === 1 ? 2 : 1,
                //   });
                //   if (code === 200) {
                //     fcShowMsg({ type: 'success', msg: t('sys.editSuc') });
                //     [headerObj].find((item: any) => item.id === row.getValue('id')).status =
                //       status === 1 ? 2 : 1;
                //     setHeaderObj((prevState: IResInfo) => ({ ...prevState }));
                //   }
                //   setEditLoading(null);
                // } catch (error: any) {
                //   setEditLoading(null);
                //   fcShowMsg({ type: 'error', msg: error.message });
                //   throw error;
                // }
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
              {/* 回收(凍結狀態跟信用才會有) */}
              {allPermission.includes('agent.credit_update') &&
                (row.getValue('status') === 2 || row.getValue('status') === 3) &&
                row.original.money_type === 2 && (
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
                              pageIndex: 0,
                              pageSize: 1,
                              searchCfg: { ...parentSearch },
                            });
                          },
                        });
                      }}
                    >
                      <DownloadOutlined />
                    </LoadingButton>
                  </Tooltip>
                )}
              {/* 新增子帳號 */}
              {allPermission.includes('agent.credit_update') && (
                <Tooltip title={`${t('sys.add')}${t('sys.subacc')}`}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="success"
                    onClick={async () => {
                      await Modal.open(SubAccAdd, {
                        parentData: {
                          pid: row.getValue('id'),
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
                    }}
                  >
                    <PlusOutlined />
                  </LoadingButton>
                </Tooltip>
              )}
            </Stack>
          );
        },
      },
    ],
    [t, theme, allPermission, editLoading, groupList, moneyTypeList, statusList],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    try {
      const { refer, header, breadcrumbs } = await apiList({
        ...parentSearch,
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
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
      //Search Cfg
      setGroupList(groupList);
      setmoneyTypeList(moneyTypeList);
      setTypeList(typeList);
      setStatusList(statusList);
      setCurrencyList(currencyList);
      //Base setting
      setbcList(breadcrumbs);
      setHeaderObj(header);
      return { refer, header, breadcrumbs };
    } catch (error: any) {
      throw error;
    }
  };

  useEffect(() => {
    async function fcInit() {
      if (authState.user?.backstage === 2) {
        const { header } = await fcGetList({
          pageIndex: 0,
          pageSize: 1,
          searchCfg: { ...parentSearch },
        });
        if (authState.user?.backstage === 2) {
          setParentSearch((prevState) => ({
            ...prevState,
            pid: header.id,
          }));
        }
      }
    }
    fcInit();
  }, []);

  useEffect(() => {
    if (authState.user?.backstage === 1) {
      fcGetList({ pageIndex: 0, pageSize: 1, searchCfg: { ...parentSearch } });
      return;
    }
    if (authState.user?.backstage === 2) {
      fcGetList({ pageIndex: 0, pageSize: 1, searchCfg: { ...parentSearch } });
      return;
    }
  }, [parentSearch.nopid, parentSearch.pid, parentSearch.forceUpdate]);

  return (
    <Grid my={3} spacing={2}>
      <Stack my={2}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          {bcList.map((item, index) => {
            return bcList.length === index + 1 ? (
              <Typography key={index} color="text.primary">
                {item.name}
              </Typography>
            ) : item.id === 0 ? (
              <Link
                key={index}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setParentSearch((prevState) => ({
                    ...prevState,
                    pid: '',
                  }));
                  setStep('home');
                }}
              >
                <HomeOutlined />
              </Link>
            ) : (
              <Link
                key={index}
                style={{ cursor: 'pointer' }}
                underline="hover"
                onClick={() => {
                  setParentSearch((prevState) => ({
                    ...prevState,
                    pid: item.id.toString(),
                  }));
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Stack>
      {headerObj && <SimpleTable columns={columns} data={[headerObj]} />}
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(Header);
