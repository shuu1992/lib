import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/SiteNotice';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/SiteNotice/req';
import { IResInfo } from '@api/SiteNotice/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { FormControlLabel, Button, Stack, Tooltip } from '@mui/material';
// ant-design
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
//Custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import LoadingButton from '@components/@extended/LoadingButton';
import { Android12Switch } from '@components/switch/CustomizedSwitches';
import TFilterDatePicker from '@components/muiTable/filter/DateRanger';
import Add from './feature/Add';
import Edit from './feature/Edit';
import Del from './feature/Del';
const Modal = new ModalController();

const SiteNotice = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const { t, fcShowMsg } = usePage();
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  const [flagList, setFlagList] = useState<TbSelectProps[]>([]);
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
        header: t('siteNotice.type'),
        accessorKey: 'type',
        muiFilterTextFieldProps: { placeholder: t('siteNotice.type') },
        filterSelectOptions: typeList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const type = row.getValue('type');
          const typeObj = typeList.find((item) => item.value == type);
          const color = type == 1 ? 'primary' : 'error';
          return (
            <Button variant="contained" color={color}>
              {typeObj?.text}
            </Button>
          );
        },
      },
      {
        header: t('sys.name'),
        accessorKey: 'name',
        enableSorting: false,
        enableColumnFilter: false,
        muiFilterTextFieldProps: { placeholder: t('sys.name') },
      },
      {
        header: t('siteNotice.content'),
        accessorKey: 'content',
        enableSorting: false,
        enableColumnFilter: false,
        enableClickToCopy: true,
        muiFilterTextFieldProps: { placeholder: t('siteNotice.content') },
        maxSize: 30,
        Cell: ({ row }: { row: any }) => {
          return <div className="singaleEllipsis">{row.getValue('content')}</div>;
        },
      },
      {
        header: t('sys.sort'),
        accessorKey: 'sort',
        enableColumnFilter: false,
      },
      {
        header: t('sys.status'),
        accessorKey: 'status',
        muiFilterTextFieldProps: { placeholder: t('sys.status') },
        filterSelectOptions: statusList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const status = row.getValue('status');
          switch (status) {
            case 1:
              return (
                <FormControlLabel
                  control={<Android12Switch checked={true} />}
                  label={t('sys.open')}
                />
              );
            case 0:
              return (
                <FormControlLabel
                  control={<Android12Switch checked={false} />}
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
              {allPermission.includes('notice.update') && (
                <Tooltip title={t('sys.edit')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="primary"
                    onClick={async () => {
                      const infoData = await fcGetInfo({ id: row.getValue('id') });
                      await Modal.open(Edit, {
                        infoData,
                        typeList,
                        flagList,
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

              {allPermission.includes('notice.destroy') && (
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
    [t, theme, allPermission, editLoading, searchCfg, typeList, flagList, statusList],
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
      const typeList: TbSelectProps[] = Object.entries(refer.type).map(([value, name]) => ({
        text: name as string,
        value: value,
      }));
      const statusList: TbSelectProps[] = refer.status.map((key: string, value: string) => ({
        text: key,
        value: value.toString(),
      }));
      const flagList: TbSelectProps[] = Object.entries(refer.flag).map(([value, name]) => ({
        text: name as string,
        value: value,
      }));
      //Search Cfg
      setTypeList(typeList);
      setStatusList(statusList);
      setFlagList(flagList);
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
          flag: allPermission.includes('notice.store'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            Modal.open(Add, {
              list: dataList,
              typeList,
              flagList,
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

export default withPageHoc(SiteNotice);
