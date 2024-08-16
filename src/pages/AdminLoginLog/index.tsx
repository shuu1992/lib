import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/AdminLoginLog';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/AdminLoginLog/req';
import { IResInfo } from '@api/AdminLoginLog/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Stack, Tooltip } from '@mui/material';
//Custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import TFilterDatePicker from '@components/muiTable/filter/DateRanger';

const Modal = new ModalController();

const AdminLoginLog = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  //refer list
  const [backstageList, setBackstageList] = useState<TbSelectProps[]>([]);
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
        header: t('adminLoginLog.backstage'),
        accessorKey: 'backstage',
        enableSorting: false,
        muiFilterTextFieldProps: {
          placeholder: t('adminLoginLog.backstage'),
        },
        filterSelectOptions: backstageList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const backstage = row.getValue('backstage');
          const backstageObj = backstageList.find((item) => item.value == backstage);
          const color = backstage == 1 ? 'primary' : 'error';
          return (
            <Button variant="contained" color={color}>
              {backstageObj?.text}
            </Button>
          );
        },
      },
      {
        header: t('sys.username'),
        accessorKey: 'username',
        enableClickToCopy: true,
        muiFilterTextFieldProps: {
          placeholder: t('sys.username'),
        },
      },
      {
        header: t('adminLoginLog.ip'),
        accessorKey: 'ip',
        enableClickToCopy: true,
        muiFilterTextFieldProps: {
          placeholder: t('adminLoginLog.ip'),
        },
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
          const statusObj = statusList.find((item) => item.value == status);
          return (
            <Button variant="outlined" color={getValueColor(theme, status)}>
              {statusObj?.text}
            </Button>
          );
        },
      },
      {
        header: t('adminLoginLog.created_at'),
        accessorKey: 'created_at',
        Filter: ({ column }: { column: any }) => (
          <TFilterDatePicker column={column} defaultType="today" />
        ),
      },
    ],
    [t, theme, allPermission, backstageList, statusList],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, refer, meta } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      const backstageList: TbSelectProps[] = Object.entries(refer.backstage).map(
        ([value, text]): TbSelectProps => ({
          text: text as string,
          value: value,
        }),
      );
      const statusList: TbSelectProps[] = Object.entries(refer.status).map(
        ([value, text]): TbSelectProps => ({
          text: text as string,
          value: value,
        }),
      );

      //Search Cfg
      setBackstageList(backstageList);
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
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(AdminLoginLog);
