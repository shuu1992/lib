import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import usePage from '@hooks/usePage';
import i18n from '@i18n/index';
import {
  MaterialReactTable,
  MRT_PaginationState,
  MRT_SortingState,
  MRT_TablePagination,
  MRT_ColumnFiltersState,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_DensityState,
  type MRT_RowSelectionState,
} from 'material-react-table';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MRT_Localization_ZH_HANT } from 'material-react-table/locales/zh-Hant';
import { MRT_Localization_ZH_HANS } from 'material-react-table/locales/zh-Hans';
import { MRT_Localization_VI } from 'material-react-table/locales/vi';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { PgCfgProps } from '@type/page';
import Grid from '@mui/material/Unstable_Grid2';
import { Tooltip, IconButton, Checkbox } from '@mui/material';
import LoadingButton from '@components/@extended/LoadingButton';
import {
  PlusOutlined,
  SyncOutlined,
  DownloadOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { ModalController, ModalContainer } from 'react-modal-global';
import dayjs from 'dayjs';
import { fcMoneyFormat } from '@src/utils/method';
import Empty from './Empty';
import ExportCom from './export/ExcelCom';

function BaseTable({
  columns,
  data,
  loadingFlag,
  pgCfg,
  searchCfg,
  tSearchCfg,
  setPgCfg,
  setTSearchCfg,
  fetchData,
  loadingCfg = { flag: false, anim: false, setFlag: () => {} },
  addCfg = { flag: false, anim: false, title: '', setFlag: () => {} },
  exportCfg = {
    flag: false,
    excelHeader: [],
    title: import.meta.env.VITE_TITLE,
    fileName: import.meta.env.VITE_TITLE,
    fcExportData: () => Promise.resolve({ excelData: [] }),
  },
  rowSelect = {
    enableRowSelection: false,
    enableMultiRowSelection: false,
  },
  defaultColumnFilters = [],
  defaultFilterFlag = false,
  paginationflag = true,
  searchComponent,
}: {
  columns: any[];
  data: any[];
  loadingFlag: boolean;
  pgCfg: PgCfgProps; // 分頁
  searchCfg: { [key: string]: any }; // 搜尋條件
  tSearchCfg?: { [key: string]: any };
  setPgCfg: (cb: (value: PgCfgProps) => PgCfgProps) => void;
  setSearchCfg?: (cb: (value: any) => any) => void;
  setTSearchCfg: (cb: (value: any) => any) => void; // table 搜尋條件同步到父層
  fetchData: ({
    pageIndex,
    pageSize,
    searchCfg,
  }: {
    pageIndex: number;
    pageSize: number;
    searchCfg: any;
  }) => void;
  loadingCfg: {
    flag: boolean; //是否顯示
    anim: boolean; //動畫
    setFlag: () => void; // 重新載入
  };
  addCfg?: {
    flag: boolean; //是否顯示
    anim: boolean; //動畫
    title?: string; //標題
    setFlag: () => void; //新增動作
  };
  exportCfg?: {
    flag: boolean; //是否顯示
    excelHeader: any[]; //excel標頭
    title: string; //標題
    fileName: string; //檔名
    fcExportData: (page: number, pageSize: number) => Promise<{ excelData: any[] }>; //取得匯出資料
  };
  rowSelect?: {
    enableRowSelection: boolean; // 是否啟行選
    enableMultiRowSelection?: boolean; // 是否啟用多選
  };
  defaultColumnFilters?: { id: string; value: string }[];
  defaultFilterFlag?: boolean; // 是否預設搜尋參數
  paginationflag?: boolean; // 是否顯示分頁
  searchComponent?: React.ReactNode; // 客制搜尋欄位
}) {
  const { t, isMobile, fcShowMsg } = usePage();
  const Modal = new ModalController();
  const theme = useTheme();
  const initRef = useRef(false);
  const [lang, setLang] = useState(MRT_Localization_ZH_HANT);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: pgCfg.pageSize,
  });
  const [filter, setFilter] = useState<boolean>(true);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([
    ...defaultColumnFilters,
  ]);
  const [sorting, setSorting] = useState<MRT_SortingState>([]); // 排序
  const [isFullscreen, setIsFullscreen] = useState(false); // 全螢幕
  const [advFeatures, setAdFeatures] = useState<boolean>(false); // 是否顯示進階功能
  const [density, setDensity] = useState<MRT_DensityState>('compact');
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({}); // 行選取
  const [sortTxt, setSortTxt] = useState<string>(''); // 把sorting組成api需要的排序條件
  const [filterObj, setFilterObj] = useState<any>({}); // 把columnFilters組成api需要的搜尋條件
  const [dbClick, setDbClick] = useState<boolean>(false); // 防連點

  function fcAryEmptyVal<T extends object>(array: T[]): boolean {
    return array.some((obj) =>
      Object.values(obj).some((value) => value === null || value === undefined || value === ''),
    );
  }

  useEffect(() => {
    if (
      defaultColumnFilters.length > 0 &&
      initRef.current === false &&
      fcAryEmptyVal(defaultColumnFilters) === false
    ) {
      const defaultFilterData = {} as any;
      defaultColumnFilters.forEach((item) => {
        defaultFilterData[item.id] = item.value;
      });
      //設定filter
      setFilterObj(defaultFilterData);
      setColumnFilters([...defaultColumnFilters]);
      fetchData({
        ...pagination,
        searchCfg: { ...searchCfg, ...defaultFilterData, sort_by: sortTxt },
      });
      initRef.current = true;
    }
  }, [defaultColumnFilters]);

  useEffect(() => {
    setPgCfg((prevState: PgCfgProps) => ({
      ...prevState,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    }));
    if (defaultFilterFlag && initRef.current === false) {
      initRef.current = true;
      return;
    }

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
          filterData[`${item.id}${key + 1}`] = dayjs.isDayjs(itemValue)
            ? dayjs(itemValue).format('YYYY-MM-DD HH:mm:ss')
            : itemValue;
        });
      } else {
        if (item.value === null || item.value === undefined || item.value === '') return;
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

  useEffect(() => {
    if (tSearchCfg === undefined) return;
    const filterData = {} as any;
    columnFilters.forEach((item) => {
      if (Array.isArray(item.value)) {
        item.value.map((itemValue, key) => {
          filterData[`${item.id}${key + 1}`] = dayjs.isDayjs(itemValue)
            ? dayjs(itemValue).format('YYYY-MM-DD HH:mm:ss')
            : itemValue;
        });
      } else {
        filterData[item.id] = item.value;
      }
    });
    if (JSON.stringify(filterData) === JSON.stringify(tSearchCfg)) return;
    //不同的話，設定filter
    setColumnFilters(() => {
      return Object.keys(tSearchCfg).map((key) => {
        return {
          id: key,
          value: tSearchCfg[key],
        };
      });
    });
  }, [tSearchCfg]);

  // useEffect(() => {
  //   //關閉filter時 清空條件
  //   if (filter === false && columnFilters.length > 0) {
  //     setColumnFilters([]);
  //     setFilterObj({});
  //     setTSearchCfg((prevState: any) => ({
  //       ...{},
  //       sort_by: sortTxt,
  //     }));
  //     fetchData({
  //       ...pagination,
  //       searchCfg: { ...searchCfg, ...{}, sort_by: sortTxt },
  //     });
  //   }
  // }, [filter]);

  useEffect(() => {
    setPagination((prevState: MRT_PaginationState) => ({
      ...prevState,
      pageIndex: pgCfg.pageIndex,
    }));
  }, [pgCfg]);

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

  useEffect(() => {
    if (Object.keys(rowSelection).length === 0) {
      setTSearchCfg((prevState: any) => ({
        ...prevState,
        seletRows: [],
      }));
    } else {
      setTSearchCfg((prevState: any) => ({
        ...prevState,
        seletRows: Object.keys(rowSelection),
      }));
    }
  }, [rowSelection]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      dateFormats={{
        normalDate: 'YYYY-MM-DD HH:mm:ss',
        keyboardDate: 'YYYY-MM-DD HH:mm:ss',
      }}
    >
      <MaterialReactTable
        localization={lang}
        columns={columns}
        data={data}
        enablePagination={paginationflag}
        enableColumnPinning={true}
        enableSorting={true}
        enableColumnOrdering={advFeatures}
        enableColumnActions={advFeatures}
        enableSelectAll={false}
        enableRowSelection={rowSelect.enableRowSelection}
        enableMultiRowSelection={rowSelect.enableMultiRowSelection}
        renderEmptyRowsFallback={() => <Empty />}
        rowCount={pgCfg.pageTotal}
        muiPaginationProps={{
          rowsPerPageOptions: [25, 50, 100, 300, 500, 1000],
          variant: 'outlined',
          color: 'primary',
          shape: 'rounded',
          showFirstButton: false,
          showLastButton: false,
          hideNextButton: false,
          hidePrevButton: false,
          boundaryCount: isMobile ? 1 : 2,
        }}
        paginationDisplayMode="pages"
        muiFilterTextFieldProps={{
          sx: { m: '0.5rem 0', width: '85%' },
          variant: 'outlined',
        }}
        muiSelectCheckboxProps={{
          color: 'primary',
          sx: {
            fontSize: '',
            width: '100%',
            height: '100%',
            '& .MuiBox-root span': {
              left: '0.9px',
              top: '0.9px',
            },
          },
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
        onRowSelectionChange={setRowSelection}
        getRowId={(row) => row.id}
        initialState={{
          pagination,
        }}
        state={{
          showColumnFilters: filter,
          isFullScreen: isFullscreen,
          isLoading: loadingFlag,
          pagination,
          sorting,
          density: density,
          columnFilters,
          rowSelection,
        }}
        defaultColumn={{ minSize: 50, maxSize: 70, size: 50 }}
        muiTablePaperProps={{
          sx: {
            overflowY: 'hidden',
          },
          style: {
            overflowY: isFullscreen ? 'auto' : 'hidden',
            paddingBottom: isFullscreen ? '55px' : '0px',
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
        muiCopyButtonProps={{
          sx: {
            align: 'right',
            fontWeight: 700,
          },
        }}
        muiTableFooterCellProps={{
          align: 'right',
          sx: {
            backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff',
            fontWeight: 700,
            fontSize: '0.875rem',
          },
        }}
        muiFilterDateTimePickerProps={{
          ampm: false,
          format: 'YYYY-MM-DD HH:mm:ss',
        }}
        renderTopToolbar={({ table }) => (
          <Grid container sx={{ p: 1.5 }}>
            <Grid xs={3}>
              {loadingCfg.flag && (
                <Tooltip
                  title={t('sys.refresh')}
                  onClick={() => {
                    if (loadingCfg.anim) return;
                    loadingCfg.setFlag();
                  }}
                >
                  <LoadingButton loading={loadingCfg.anim} shape="rounded" color="primary">
                    <SyncOutlined
                      spin={loadingCfg.anim}
                      twoToneColor={theme.palette.primary.main}
                    />
                  </LoadingButton>
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
              {exportCfg.flag && (
                <Tooltip
                  title={t('sys.export')}
                  onClick={() => {
                    if (pgCfg.pageTotal > 200000) {
                      fcShowMsg({
                        type: 'error',
                        msg: `${t('cp.totalPage')}:${pgCfg.pageTotal}，${t('cp.exportLimit', {
                          num: fcMoneyFormat(200000),
                        })}`,
                      });
                      return;
                    }
                    Modal.open(ExportCom, {
                      title: exportCfg.title,
                      fileName: `${import.meta.env.VITE_TITLE}:${exportCfg.fileName}`,
                      excelHeader: exportCfg.excelHeader,
                      pageTotal: pgCfg.pageTotal,
                      fcExportData: exportCfg.fcExportData,
                    });
                  }}
                >
                  <LoadingButton loading={dbClick} shape="rounded" color="error">
                    <DownloadOutlined />
                  </LoadingButton>
                </Tooltip>
              )}
            </Grid>
            <Grid xs={2} xsOffset={7} display="flex" justifyContent="flex-end">
              {columns.every((item) => item.enableColumnFilter === false) ? null : (
                <MRT_ToggleFiltersButton table={table} />
              )}

              <MRT_ShowHideColumnsButton table={table} />
              <MRT_ToggleFullScreenButton table={table} />
              <Tooltip title={t('sys.advFeatures')}>
                <IconButton
                  onClick={() => {
                    setAdFeatures(!advFeatures);
                  }}
                >
                  {advFeatures ? <UnlockOutlined /> : <LockOutlined />}
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid xs={12} container spacing={2} sx={{ p: 1.5 }}>
              {searchComponent}
            </Grid>
            {paginationflag &&
              pgCfg.pageTotal / pagination.pageSize > 1 &&
              pagination.pageSize >= 15 &&
              (isMobile ? (
                <Grid container xs={12}>
                  <Grid xs={12}>
                    <MRT_TablePagination table={table} />
                  </Grid>
                  <Grid
                    xs={12}
                    m={1}
                    sx={{
                      fontSize: '1rem',
                    }}
                  >
                    {t('cp.totalPage')} : {pgCfg.pageTotal}
                  </Grid>
                </Grid>
              ) : (
                <Grid xs={12} display="flex" justifyContent="flex-end" alignItems="center">
                  <MRT_TablePagination table={table} />
                  <Grid
                    xs={12}
                    m={1}
                    sx={{
                      fontSize: '1rem',
                    }}
                  >
                    {t('cp.totalPage')} : {pgCfg.pageTotal}
                  </Grid>
                </Grid>
              ))}
          </Grid>
        )}
        renderBottomToolbar={({ table }) =>
          isMobile ? (
            <Grid container xs={12}>
              <Grid xs={12}>
                <MRT_TablePagination table={table} />
              </Grid>
              <Grid
                xs={12}
                m={1}
                sx={{
                  fontSize: '1rem',
                }}
              >
                {t('cp.totalPage')} : {pgCfg.pageTotal}
              </Grid>
            </Grid>
          ) : (
            <Grid container sx={{ p: 1.5 }}>
              <Grid xs={12} display="flex" justifyContent="flex-end" alignItems="center">
                <MRT_TablePagination table={table} />
                <Grid
                  xs={12}
                  sx={{
                    fontSize: '1rem',
                  }}
                >
                  {t('cp.totalPage')} : {pgCfg.pageTotal}
                </Grid>
              </Grid>
            </Grid>
          )
        }
      />
      <ModalContainer controller={Modal} />
    </LocalizationProvider>
  );
}

export default BaseTable;
