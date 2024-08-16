import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/SiteBanner';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/SiteBanner/req';
import { IResInfo } from '@api/SiteBanner/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { FormControlLabel, Stack, Tooltip } from '@mui/material';
// ant-design
import { EditTwoTone, DeleteTwoTone, LinkOutlined } from '@ant-design/icons';
// Custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import LoadingButton from '@components/@extended/LoadingButton';
import { Android12Switch } from '@components/switch/CustomizedSwitches';
import TFilterDatePicker from '@components/muiTable/filter/DateRanger';
import ImgSrc from '@components/form/ImgSrc';
import Add from './feature/Add';
import Edit from './feature/Edit';
import Del from './feature/Del';

const Modal = new ModalController();

const SiteBanner = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
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
        header: t('sys.type'),
        accessorKey: 'type',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('sys.type') },
        filterSelectOptions: typeList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const type = row.getValue('type');
          const typeObj = typeList.find((item) => item.value == type);
          return <div>{typeObj?.text}</div>;
        },
      },
      {
        header: t('siteBanner.img'),
        accessorKey: 'image',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          const image = row.getValue('image');
          return <ImgSrc value={image} />;
        },
      },
      {
        header: t('siteBanner.imgApp'),
        accessorKey: 'image_app',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          const image = row.getValue('image_app');
          return <ImgSrc value={image} />;
        },
      },
      {
        header: t('sys.url'),
        accessorKey: 'url',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          const url = row.getValue('url');
          return url !== '' ? (
            <LoadingButton
              shape="rounded"
              sx={{ '&:hover': { color: theme.palette.text.primary } }}
              onClick={() => {
                window.open(url, '_blank');
              }}
            >
              <LinkOutlined />
            </LoadingButton>
          ) : (
            <div> - </div>
          );
        },
      },
      {
        Header: ({ column }: { column: any }) => (
          <div>
            <div>{t('sys.start_time')}</div>
            <div>{t('sys.end_time')}</div>
          </div>
        ),
        header: t('sys.start_time'),
        accessorKey: 'start_time',
        enableSorting: true,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div>{row.getValue('start_time')}</div>
              <div>{row.original.end_time}</div>
            </div>
          );
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
        muiFilterTextFieldProps: {
          placeholder: t('sys.status'),
        },
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
        enableSorting: true,
        Filter: ({ column }: { column: any }) => <TFilterDatePicker column={column} />,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div>{row.getValue('created_at')}</div>
              <div
                style={{
                  color: theme.palette.info.main,
                }}
              >
                {row.original.created_by}
              </div>
            </div>
          );
        },
      },
      {
        header: t('sys.updated_at'),
        accessorKey: 'updated_at',
        enableSorting: true,
        Filter: ({ column }: { column: any }) => <TFilterDatePicker column={column} />,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div>{row.getValue('updated_at')}</div>
              <div
                style={{
                  color: theme.palette.info.main,
                }}
              >
                {row.original.updated_by}
              </div>
            </div>
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
              {allPermission.includes('banner.update') && (
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

              {allPermission.includes('banner.destroy') && (
                <Tooltip title={t('sys.del')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="error"
                    onClick={async () => {
                      await await Modal.open(Del, {
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
    [t, theme, allPermission, editLoading, searchCfg, typeList, statusList],
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
      const typeList: TbSelectProps[] = Object.entries(refer.type).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const statusList: TbSelectProps[] = refer.status.map((key: string, value: string) => ({
        value: value.toString(),
        text: key,
      }));
      //Search Cfg
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
          flag: allPermission.includes('banner.store'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            Modal.open(Add, {
              typeList,
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

export default withPageHoc(SiteBanner);
