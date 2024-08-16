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
  MRT_DensityState,
} from 'material-react-table';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MRT_Localization_ZH_HANT } from 'material-react-table/locales/zh-Hant';
import { MRT_Localization_VI } from 'material-react-table/locales/vi';
import { PgCfgProps } from '@type/page';
import Grid from '@mui/material/Unstable_Grid2';
import { Tooltip, IconButton, Fade } from '@mui/material';

import LoadingButton from '@components/@extended/LoadingButton';
import {
  PlusOutlined,
  SyncOutlined,
  DownloadOutlined,
  UpSquareOutlined,
  DownSquareOutlined,
} from '@ant-design/icons';
import { ModalController, ModalContainer } from 'react-modal-global';
import dayjs from 'dayjs';
import { fcMoneyFormat } from '@src/utils/method';
import Empty from './Empty';
import ExportCom from './export/ExcelCom';

function MBaseTable({
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
  addCfg = { flag: false, anim: false, setFlag: () => {} },
  exportCfg = {
    flag: false,
    excelHeader: [],
    title: import.meta.env.VITE_TITLE,
    fileName: import.meta.env.VITE_TITLE,
    fcExportData: () => Promise.resolve({ excelData: [] }),
  },
  detailPanelCfg = {
    enableExpanding: true,
    enableExpandAll: true,
  },
  defaultColumnFilters = [],
  defaultFilterFlag = false,
  paginationflag = true,
  searchExpandCfg = { flag: false, enable: true },
  sortRowColor = false,
  searchComponent,
  renderDetailPanel,
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
    setFlag: () => void; //新增動作
  };
  exportCfg?: {
    flag: boolean; //是否顯示
    excelHeader: any[]; //excel標頭
    title: string; //標題
    fileName: string; //檔名
    fcExportData: (page: number, pageSize: number) => Promise<{ excelData: any[] }>; //取得匯出資料
  };
  searchExpandCfg?: { flag?: boolean; enable?: boolean }; // 二層搜尋-是否顯示搜尋欄位,enable為預設展開還是關閉
  detailPanelCfg?: {
    enableExpanding: boolean; // 是否顯示客制詳細資料
    enableExpandAll: boolean;
  };
  defaultFilterFlag?: boolean; // 是否預設搜尋參數
  defaultColumnFilters?: { id: string; value: string }[];
  paginationflag?: boolean; // 是否顯示分頁
  searchComponent?: React.ReactNode; // 客制搜尋欄位
  sortRowColor?: boolean; // 是否隔行變色
  renderDetailPanel?: ({ row }: { row: any }) => React.ReactNode; // 客制詳細資料
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
  const [expanded, setExpanded] = useState<any>({}); // 展開搜尋
  const [filter, setFilter] = useState<boolean>(true);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<MRT_SortingState>([]); // 排序
  const [isFullscreen, setIsFullscreen] = useState(false); // 全螢幕
  const [advFeatures, setAdFeatures] = useState<boolean>(false); // 是否顯示進階功能
  const [searchExpand, setSearchExpand] = useState<boolean>(searchExpandCfg.enable ?? false); // 是否顯示搜尋欄位
  const [density, setDensity] = useState<MRT_DensityState>('compact');
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
      defaultColumnFilters.forEach((item: any) => {
        defaultFilterData[item.id] = item.value;
      });
      //設定filter
      setFilterObj(defaultFilterData);
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
        filterData[item.id] = item.value;
      }
    });
    //設定filter
    setFilterObj(filterData);
    //跟父層同步
    setTSearchCfg((prevState: any) => ({
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
    setColumnFilters((prevState: MRT_ColumnFiltersState) => {
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
    setExpanded({});
    // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pgCfg]);

  useEffect(() => {
    switch (i18n.resolvedLanguage) {
      case 'vi':
        setLang(MRT_Localization_VI);
        break;
      default:
        setLang(MRT_Localization_ZH_HANT);
        break;
    }
  }, [i18n.resolvedLanguage]);
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
        enableExpanding={detailPanelCfg.enableExpanding}
        enableExpandAll={detailPanelCfg.enableExpandAll}
        enablePagination={paginationflag}
        enableColumnPinning={true}
        enableSorting={true}
        enableColumnOrdering={advFeatures}
        enableColumnActions={advFeatures}
        renderEmptyRowsFallback={() => <Empty />}
        rowCount={pgCfg.pageTotal}
        muiPaginationProps={{
          size: 'small',
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
        manualFiltering={true}
        manualSorting={true}
        manualPagination={true}
        manualExpanding={true}
        onColumnFiltersChange={setColumnFilters}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onIsFullScreenChange={setIsFullscreen}
        onDensityChange={setDensity}
        onShowColumnFiltersChange={setFilter}
        initialState={{
          pagination,
          expanded,
        }}
        state={{
          showColumnFilters: filter,
          isFullScreen: isFullscreen,
          isLoading: loadingFlag,
          pagination,
          sorting,
          density: density,
          expanded,
          columnFilters: columnFilters.concat(defaultColumnFilters),
        }}
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
        muiTableProps={{
          sx: {
            overflowX: 'hidden',
          },
        }}
        muiTableHeadCellProps={{
          align: 'center',
        }}
        muiTableBodyRowProps={({ row }) => {
          return {
            sx: {
              align: 'center',
              fontStyle: 'italic',
            },
          };
        }}
        muiTableBodyProps={({ table }) => {
          let styleObj: any = { align: 'center' };
          if (sortRowColor) {
            styleObj = {
              ...styleObj,
              '& tr:nth-of-type(4n+1):not([data-selected="true"]):not([data-pinned="true"]) > td': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgb(29, 29, 29)' : '#fff',
              },
              '& tr:nth-of-type(4n+2):not([data-selected="true"]):not([data-pinned="true"]) > td': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgb(29, 29, 29)' : '#fff',
              },
              '& tr:nth-of-type(4n+3):not([data-selected="true"]):not([data-pinned="true"]) > td': {
                backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fafafb!important',
              },
              '& tr:nth-of-type(4n+4):not([data-selected="true"]):not([data-pinned="true"]) > td': {
                backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fafafb!important',
              },
            };
          }
          return {
            sx: styleObj,
          };
        }}
        muiTableBodyCellProps={({ table, row, cell }) => {
          return {
            sx: {
              align: 'center',
            },
          };
        }}
        muiCopyButtonProps={{
          sx: {
            align: 'right',
            fontWeight: 700,
          },
        }}
        muiTableFooterCellProps={({ table, column }) => {
          return {
            align: 'right',
            sx: {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgb(29, 29, 29)' : '#fff',
              color: theme.palette.mode === 'dark' ? '#fff' : '#000',
              fontWeight: 700,
              fontSize: '0.875rem',
            },
          };
        }}
        muiFilterDateTimePickerProps={{
          ampm: false,
          format: 'YYYY-MM-DD HH:mm:ss',
        }}
        muiDetailPanelProps={{
          sx: {
            backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff',
          },
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
                <Tooltip title={t('sys.add')} onClick={addCfg.setFlag}>
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
            {searchExpandCfg.flag && (
              <Grid xs={2} xsOffset={7} display="flex" justifyContent="flex-end">
                <Tooltip title={t('sys.searchFeatures')}>
                  <IconButton
                    onClick={() => {
                      setSearchExpand(!searchExpand);
                    }}
                  >
                    {searchExpand ? <DownSquareOutlined /> : <UpSquareOutlined />}
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
            <Fade in={searchExpand} timeout={500}>
              <Grid
                xs={12}
                container
                spacing={2}
                sx={{ p: 1.5, display: searchExpand ? '' : 'none' }}
              >
                {searchComponent}
              </Grid>
            </Fade>
          </Grid>
        )}
        // 隱藏展開全部按鈕
        muiExpandAllButtonProps={({ table }) => ({
          sx: {
            display: 'none',
            paddingLeft: 0,
          },
        })}
        muiExpandButtonProps={({ table, row }) => ({
          // onClick: () => setExpanded({ [row.id]: !row.getIsExpanded() }),
          onClick: () => {
            setExpanded((prevState: any) => ({
              ...prevState,
              [row.id]: !row.getIsExpanded(),
            }));
          },
        })}
        renderBottomToolbar={({ table }) => (
          <Grid container xs={12}>
            <Grid xs={12}>
              <MRT_TablePagination table={table} />
            </Grid>
            <Grid
              xs={12}
              m={1}
              sx={{
                fontSize: '0.875rem',
              }}
            >
              {t('cp.totalPage')} : {pgCfg.pageTotal}
            </Grid>
          </Grid>
        )}
        positionExpandColumn="last"
        renderDetailPanel={pgCfg.pageTotal > 0 ? renderDetailPanel : undefined}
      />
      <ModalContainer controller={Modal} />
    </LocalizationProvider>
  );
}

export default MBaseTable;
