import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/AdminLanguage';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/AdminLanguage/req';
import { IResInfo } from '@api/AdminLanguage/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Tooltip, Typography } from '@mui/material';
// ant-design
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import LoadingButton from '@components/@extended/LoadingButton';
import TFilterDatePicker from '@components/muiTable/filter/DateRanger';
import Add from './feature/Add';
import Edit from './feature/Edit';
import Del from './feature/Del';
const Modal = new ModalController();

const AdminLanguage = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const [languageList, setLanguageList] = useState<TbSelectProps[]>([]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [translateList, setTranslateList] = useState<TbSelectProps[]>([]);
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
        header: t('sys.lang'),
        accessorKey: 'language',
        muiFilterTextFieldProps: { placeholder: t('sys.lang') },
        filterSelectOptions: languageList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const lang = row.getValue('language');
          const langObj = languageList.find((item) => item.value == lang);
          return (
            <Typography
              sx={{
                color: getLangColor(theme, lang),
              }}
            >
              {langObj?.text}
            </Typography>
          );
        },
      },
      {
        header: t('sys.type'),
        accessorKey: 'type',
        muiFilterTextFieldProps: { placeholder: t('sys.type') },
        filterSelectOptions: typeList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const type = row.getValue('type');
          const typeObj = typeList.find((item) => item.value == type);
          return (
            <Typography
              sx={{
                color: getStyleColor(theme, type),
              }}
            >
              {typeObj?.text}
            </Typography>
          );
        },
      },
      {
        header: t('adminLanguage.keystr'),
        accessorKey: 'keystr',
        enableSorting: false,
        enableClickToCopy: true,
        muiFilterTextFieldProps: {
          placeholder: t('adminLanguage.keystr'),
        },
      },
      {
        header: t('adminLanguage.code_id'),
        accessorKey: 'code_id',
        enableColumnFilter: false,
      },
      {
        header: t('adminLanguage.content'),
        accessorKey: 'content',
        enableSorting: false,
        enableClickToCopy: true,
        muiFilterTextFieldProps: { placeholder: t('adminLanguage.content') },
      },
      {
        header: t('adminLanguage.translate'),
        accessorKey: 'translate',
        muiFilterTextFieldProps: { placeholder: t('adminLanguage.translate') },
        filterSelectOptions: translateList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const translate = row.getValue('translate');
          const translateObj = translateList.find((item) => item.value == translate);
          return (
            <div
              style={{
                color:
                  translateObj?.value == '1'
                    ? theme.palette.primary.main
                    : theme.palette.error.main,
              }}
            >
              {translateObj?.text}
            </div>
          );
        },
      },
      {
        header: t('sys.updated_at'),
        accessorKey: 'updated_at',
        Filter: ({ column }: { column: any }) => <TFilterDatePicker column={column} />,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div>{row.getValue('updated_at')}</div>
              <div>{row.original.updated_by}</div>
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
              {allPermission.includes('stringdb.update') && (
                <Tooltip title={t('sys.edit')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="primary"
                    onClick={async () => {
                      const infoData = await fcGetInfo({ id: row.getValue('id') });
                      await Modal.open(Edit, {
                        infoData,
                        typeList: typeList,
                        translateList: translateList,
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

              {allPermission.includes('stringdb.destroy') && (
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
    [t, theme, allPermission, editLoading, searchCfg, languageList, typeList, translateList],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, refer, meta } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      data.map((item: any) => {
        item.action = item.id;
      });
      const languageList: TbSelectProps[] = Object.entries(refer.language).map(
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
      const translateList: TbSelectProps[] = refer.translate.map((key: string, value: string) => ({
        text: key,
        value: value.toString(),
      }));
      //Search Cfg
      setLanguageList(languageList);
      setTypeList(typeList);
      setTranslateList(translateList);
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
          flag: allPermission.includes('stringdb.store'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            Modal.open(Add, {
              typeList: typeList,
              translateList: translateList,
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

export default withPageHoc(AdminLanguage);
