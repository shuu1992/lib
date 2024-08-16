import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/AdminUser';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/AdminUser/req';
import { IResInfo } from '@api/AdminUser/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { FormControlLabel, Stack, Tooltip } from '@mui/material';
// ant-design
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import LoadingButton from '@components/@extended/LoadingButton';
import { Android12Switch } from '@components/switch/CustomizedSwitches';
import TFilterDatePicker from '@components/muiTable/filter/DateRanger';
import Add from './feature/Add';
import Edit from './feature/Edit';
import Del from './feature/Del';
const Modal = new ModalController();

const AdminUser = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const [roleList, setRoleList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({});

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
        header: t('sys.role'),
        accessorKey: 'role_id',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('sys.role') },
        filterSelectOptions: roleList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          return <div>{row.original.rolename}</div>;
        },
      },

      {
        header: t('sys.login_ip'),
        accessorKey: 'login_ip',
        enableColumnFilter: false,
      },
      {
        header: t('sys.login_count'),
        accessorKey: 'login_count',
        enableColumnFilter: false,
      },
      {
        header: t('sys.status'),
        accessorKey: 'status',
        muiFilterTextFieldProps: { placeholder: t('sys.status') },
        filterSelectOptions: statusList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          switch (row.getValue('status')) {
            case 1:
              return (
                <FormControlLabel
                  control={<Android12Switch checked={row.getValue('status') === 1} />}
                  label={t('sys.open')}
                />
              );
            case 0:
              return (
                <FormControlLabel
                  control={<Android12Switch checked={row.getValue('status') === 1} />}
                  label={t('sys.close')}
                />
              );
          }
        },
      },
      {
        header: t('sys.created_at'),
        accessorKey: 'created_at',
        Filter: ({ column }: { column: any }) => <TFilterDatePicker column={column} />,
      },
      {
        header: t('sys.updated_at'),
        accessorKey: 'updated_at',
        Filter: ({ column }: { column: any }) => <TFilterDatePicker column={column} />,
      },
      {
        header: t('sys.action'),
        accessorKey: 'action',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {allPermission.includes('admin.update') && (
                <Tooltip title={t('sys.edit')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="primary"
                    onClick={async () => {
                      const infoData = await fcGetInfo({ id: row.getValue('id') });
                      await Modal.open(Edit, {
                        infoData,
                        roleList,
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

              {allPermission.includes('admin.destroy') && (
                <Tooltip title={t('sys.del')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="error"
                    onClick={async () => {
                      await Modal.open(Del, {
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
                    <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                  </LoadingButton>
                </Tooltip>
              )}
            </Stack>
          );
        },
      },
    ],
    [t, theme, allPermission, editLoading, searchCfg, roleList, statusList],
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

      const roleList: TbSelectProps[] = Object.entries(refer.role).map(([value, name]) => ({
        text: name as string,
        value: value,
      }));

      const statusList: TbSelectProps[] = refer.status.map((key: string, value: string) => ({
        value: value.toString(),
        text: key,
      }));
      //Search Cfg
      setRoleList(roleList);
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
          flag: allPermission.includes('admin.store'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            Modal.open(Add, {
              roleList,
              statusList,
              fetchData: async () => {
                fcGetList({ ...pgCfg, searchCfg: { ...searchCfg, ...tSearchCfg } });
              },
            });
          },
        }}
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(AdminUser);
