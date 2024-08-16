import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList } from '@api/AdminActionlog';
import { IResInfo } from '@api/AdminActionlog/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button } from '@mui/material';
// custom Components
import PageTable from '@src/components/muiTable/Base';
import TFilterDatePicker from '@components/muiTable/filter/DateRanger';

function AdminActionlog({ pageHocProps = defaultPageHocProps }: WithPageHocProps) {
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
  const [backstageList, setBackstageList] = useState<TbSelectProps[]>([]);
  const [navList, setNavList] = useState<TbSelectProps[]>([]);
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
        header: t('adminAclog.backstage'),
        accessorKey: 'backstage',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('adminAclog.backstage') },
        filterSelectOptions: backstageList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const backstage = row.getValue('backstage');
          const backstageObj = backstageList.find((item) => item.value == backstage);
          return (
            <Button variant="contained" color={getValueColor(theme, backstage)}>
              {backstageObj?.text}
            </Button>
          );
        },
      },
      {
        header: t('sys.username'),
        accessorKey: 'username',
        enableClickToCopy: true,
        muiFilterTextFieldProps: { placeholder: t('sys.username') },
      },
      {
        header: t('adminAclog.route'),
        accessorKey: 'nav_id',
        enableSorting: false,
        enableClickToCopy: true,
        muiFilterTextFieldProps: { placeholder: t('adminAclog.route') },
        filterSelectOptions: navList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          return <div>{row.original.route}</div>;
        },
      },
      {
        header: t('adminAclog.message'),
        accessorKey: 'message',
        enableClickToCopy: true,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          let message = row.getValue('message') ? row.getValue('message') : '';
          const mesaageArr = [];
          while (message.length > 30) {
            mesaageArr.push(message.slice(0, 30));
            message = message.slice(30);
          }
          if (message.length > 0) {
            mesaageArr.push(message);
          }
          return (
            <div style={{ textAlign: 'left' }}>
              {mesaageArr.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          );
        },
      },
      {
        header: t('adminAclog.ip'),
        accessorKey: 'ip',
        enableClickToCopy: true,
        muiFilterTextFieldProps: { placeholder: t('adminAclog.ip') },
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
            <Button variant="outlined" color={getValueColor(theme, status)}>
              {statusObj?.text}
            </Button>
          );
        },
      },
      {
        header: t('adminAclog.created_at'),
        accessorKey: 'created_at',
        Filter: ({ column }: { column: any }) => (
          <TFilterDatePicker column={column} defaultType="today" />
        ),
      },
    ],
    [t, theme, allPermission, editLoading, searchCfg, backstageList, navList, statusList],
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
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const navList: TbSelectProps[] = Object.entries(refer.nav).map(
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
      setBackstageList(backstageList);
      setNavList(navList);
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
    </Grid>
  );
}

export default withPageHoc(AdminActionlog);
