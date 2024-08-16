import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import i18n from '@i18n/index';
import {
  MaterialReactTable,
  MRT_PaginationState,
  MRT_SortingState,
  MRT_TablePagination,
  MRT_ColumnFiltersState,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFullScreenButton,
  MRT_DensityState,
  MRT_ToggleFiltersButton,
} from 'material-react-table';
import { MRT_Localization_ZH_HANT } from 'material-react-table/locales/zh-Hant';
import { MRT_Localization_ZH_HANS } from 'material-react-table/locales/zh-Hans';
import { MRT_Localization_VI } from 'material-react-table/locales/vi';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { PgCfgProps } from '@type/page';
import Grid from '@mui/material/Unstable_Grid2';
import { Tooltip } from '@mui/material';
import IconButton from '@components/@extended/IconButton';
import LoadingButton from '@components/@extended/LoadingButton';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';

import Empty from './Empty';

function BaseTable({
  children,
  columns,
  data,
  loadingFlag,
  pgCfg,
  searchCfg,
  setPgCfg,
  setTSearchCfg,
  fetchData,
  loadingCfg = { flag: false, anim: false, setFlag: () => {} },
  addCfg = { flag: false, anim: false, title: '', setFlag: () => {} },
}: {
  children?: React.ReactNode;
  columns: any[];
  data: any[];
  loadingFlag: boolean;
  pgCfg: PgCfgProps;
  searchCfg: any;
  setPgCfg: (cb: (value: PgCfgProps) => PgCfgProps) => void;
  setSearchCfg?: (cb: (value: any) => any) => void;
  setTSearchCfg: (cb: (value: any) => any) => void;
  fetchData: ({
    pageIndex,
    pageSize,
    searchCfg,
  }: {
    pageIndex: number;
    pageSize: number;
    searchCfg: any;
  }) => void;
  loadingCfg?: {
    flag: boolean; //是否顯示
    anim?: boolean; //動畫
    setFlag?: () => void; // 重新載入
  };
  addCfg?: {
    flag: boolean; //是否顯示
    anim: boolean; //動畫
    title?: string; //標題
    setFlag: () => void; //新增動作
  };
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [lang, setLang] = useState(MRT_Localization_ZH_HANT);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [filter, setFilter] = useState<boolean>(true);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [density, setDensity] = useState<MRT_DensityState>('compact');
  const [sortTxt, setSortTxt] = useState<string>('');
  const [filterObj, setFilterObj] = useState<any>({});
  useEffect(() => {
    setPgCfg((prevState: PgCfgProps) => ({
      ...prevState,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    }));
    fetchData({
      ...pagination,
      searchCfg: { ...searchCfg, ...filterObj, sort_by: sortTxt },
    });
  }, [i18n.language, pagination.pageIndex, pagination.pageSize]);

  //排序
  useEffect(() => {
    if (sorting.length === 0 && sortTxt === '') return;
    let sort_by = '';
    if (sorting.length > 0) {
      sort_by = `${sorting[0]?.id} ${sorting[0]?.desc ? 'desc' : 'asc'}`;
    }
    //設定sort_by
    setSortTxt(sort_by);
    //跟父層同步
    setTSearchCfg((prevState: any) => ({
      ...prevState,
      sort_by: sort_by,
    }));
    fetchData({
      ...pagination,
      searchCfg: { ...searchCfg, ...filterObj, sort_by: sort_by },
    });
  }, [sorting]);

  //filter
  useEffect(() => {
    // if (filter === false) return;
    const filterData = {} as any;
    columnFilters.forEach((item) => {
      if (Array.isArray(item.value)) {
        item.value.map((itemValue, key) => {
          filterData[`${item.id}${key + 1}`] = itemValue;
        });
      } else {
        filterData[item.id] = item.value;
      }
    });
    //設定filter
    setFilterObj(filterData);
    //跟父層同步
    setTSearchCfg(() => ({
      ...filterData,
    }));
    // 分頁大於0時，回到第一頁
    if (pagination.pageIndex !== 0) {
      setPagination((prevState: MRT_PaginationState) => ({
        ...prevState,
        pageIndex: 0,
      }));
    } else {
      // 分頁等於0時，直接搜尋
      // 如果跟上一次搜尋條件一樣，不搜尋
      if (JSON.stringify(filterData) === JSON.stringify(filterObj)) return;
      fetchData({
        ...pagination,
        searchCfg: { ...searchCfg, ...filterData, sort_by: sortTxt },
      });
    }
  }, [columnFilters]);

  // useEffect(() => {
  //   //關閉filter時 清空條件
  //   if (filter === false && columnFilters.length > 0) {
  //     setColumnFilters([]);
  //     setFilterObj({});
  //     setTSearchCfg((prevState: any) => ({
  //       ...{},
  //     }));
  //     fetchData({
  //       ...pagination,
  //       searchCfg: { ...searchCfg, ...{}, sort_by: sortTxt },
  //     });
  //   }
  // }, [filter]);

  useEffect(() => {
    switch (i18n.resolvedLanguage) {
      case 'en':
        setLang(MRT_Localization_EN);
        break;
      case 'zh-CN':
        setLang(MRT_Localization_ZH_HANS);
        break;
      case 'vi':
        setLang(MRT_Localization_VI);
        break;
      default:
        setLang(MRT_Localization_ZH_HANT);
        break;
    }
  }, [i18n.resolvedLanguage]);

  return (
    <MaterialReactTable
      localization={lang}
      columns={columns}
      data={data}
      enableColumnPinning={true}
      enableSorting={true}
      enableExpanding={true}
      getSubRows={(originalRow) => originalRow.children}
      renderEmptyRowsFallback={() => <Empty />}
      rowCount={pgCfg.pageTotal}
      muiPaginationProps={{
        rowsPerPageOptions: [25, 50, 100, 300, 500, 1000],
      }}
      muiFilterTextFieldProps={{
        sx: { m: '0.5rem 0', width: '100%' },
        variant: 'outlined',
      }}
      manualFiltering={true}
      manualSorting={true}
      manualPagination={true}
      onColumnFiltersChange={setColumnFilters}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      onIsFullScreenChange={setIsFullscreen}
      onDensityChange={setDensity}
      onShowColumnFiltersChange={setFilter}
      initialState={{ pagination }}
      state={{
        showColumnFilters: filter,
        isFullScreen: isFullscreen,
        isLoading: loadingFlag,
        pagination,
        sorting,
        density: density,
      }}
      // defaultColumn={{
      //   minSize: 5, //allow columns to get smaller than default
      //   maxSize: 50, //allow columns to get larger than default
      //   size: 20, //make columns wider by default
      // }}
      muiTablePaperProps={{
        sx: {
          overflowY: 'hidden',
        },
      }}
      muiTableContainerProps={{
        sx: {
          overflowY: 'hidden',
        },
      }}
      muiTableHeadCellProps={{
        align: 'center',
      }}
      muiTableBodyCellProps={{
        align: 'center',
      }}
      renderTopToolbar={({ table }) => (
        <Grid container sx={{ p: 1.5 }}>
          <Grid xs={3}>
            {loadingCfg.flag && (
              <Tooltip title={t('sys.refresh')} onClick={loadingCfg.setFlag}>
                <IconButton shape="rounded" color="primary">
                  <SyncOutlined spin={loadingCfg.anim} twoToneColor={theme.palette.primary.main} />
                </IconButton>
              </Tooltip>
            )}
            {addCfg.flag && (
              <Tooltip
                title={`${t('sys.add')}${addCfg.title ? addCfg.title : ''}`}
                onClick={addCfg.setFlag}
              >
                <LoadingButton loading={addCfg.anim} shape="rounded" color="success">
                  <PlusOutlined twoToneColor={theme.palette.primary.main} />
                </LoadingButton>
              </Tooltip>
            )}
          </Grid>
          <Grid xs={2} xsOffset={7} display="flex" justifyContent="flex-end">
            <MRT_ToggleFiltersButton table={table} />
            <MRT_ShowHideColumnsButton table={table} />
            <MRT_ToggleFullScreenButton table={table} />
          </Grid>
          <Grid xs={12} container spacing={2} sx={{ p: 1.5 }}>
            {children}
          </Grid>
          {pgCfg.pageTotal / pagination.pageSize > 1 && pagination.pageSize >= 15 && (
            <Grid xs={12} display="flex" justifyContent="flex-end" alignItems="center">
              {/* <Grid sx={{ p: 1 }}>
                {t('cp.totalPage')} : {pgCfg.pageTotal}
              </Grid> */}
              <MRT_TablePagination table={table} />
            </Grid>
          )}
        </Grid>
      )}
    />
  );
}

export default BaseTable;
