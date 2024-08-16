import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList } from '@api/ReportDonate';
import { IResInfo, IResFooter } from '@api/ReportDonate/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button } from '@mui/material';
// custom Components
import { getDateRange } from '@utils/date';
import PageTable from '@src/components/muiTable/Base';
import SearchDateReportPicker from '@components/search/DateReportPicker';
import TreeSearch from '@pages/ReportOperation/component/TreeSearch';
import { fcMoneyFormat } from '@src/utils/method';
import { DonateExcel } from './excel/DonateExcel';

export interface ParentSearchType {
  agent_paths: string;
  report_time1: string;
  report_time2: string;
}

export interface ReportTabProps {
  parentSearch: ParentSearchType;
  setParentSearch: (cb: (value: ParentSearchType) => ParentSearchType) => void;
}

const ReportDonate = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const { sysTime } = globalState;
  const [anchorList, setAnchorList] = useState<TbSelectProps[]>([]);
  const [footerObj, setFooterObj] = useState<IResFooter>({
    donate: 0,
    donate_count: 0,
  });
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    agent_paths: '',
    report_time1: getDateRange(sysTime, 'thisWeek')[0].format('YYYY-MM-DD HH:mm:ss'),
    report_time2: getDateRange(sysTime, 'thisWeek')[1].format('YYYY-MM-DD HH:mm:ss'),
  });

  const columns = useMemo(
    () => [
      {
        header: t('reportDonate.anchor_id'),
        accessorKey: 'anchor_id',
        filterSelectOptions: anchorList,
        filterVariant: 'select',
        muiFilterTextFieldProps: {
          placeholder: t('reportDonate.anchor_id'),
        },
        muiTableFooterCellProps: {
          align: 'center',
        },
        Cell: ({ row }: { row: any }) => {
          const anchorId = row.getValue('anchor_id');
          const anchorIdObj = anchorList.find((item) => item.value == anchorId);
          return <div> {anchorIdObj?.text}</div>;
        },
        Footer: () => <div>{t('sys.sum')}</div>,
      },
      {
        header: t('reportDonate.donate_count'),
        accessorKey: 'donate_count',
        enableColumnFilter: false,
        muiTableFooterCellProps: {
          align: 'center',
        },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('donate_count'))}</div>;
        },
        Footer: () => <div>{footerObj.donate_count}</div>,
      },
      {
        header: t('reportDonate.donate'),
        accessorKey: 'donate',
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('donate'))}</div>;
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.donate)}</div>,
      },
    ],
    [t, theme, allPermission, anchorList, footerObj],
  );
  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setFooterObj((prevState: IResFooter) => ({
      ...prevState,
      donate: 0,
      donate_count: 0,
    }));
    setLoadingFlag(true);
    try {
      const { data, refer, meta, footer } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      const anchorList: TbSelectProps[] = Object.entries(refer.anchor).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      //Search Cfg
      setAnchorList(anchorList);
      setFooterObj(footer);
      //Base setting
      setPgCfg((prevState: PgCfgProps) => ({
        ...prevState,
        pageTotal: meta.total,
      }));
      setDataList((prevState: IResInfo[]) => data);
      setLoadingFlag(false);
    } catch (error: any) {
      setLoadingFlag(false);
      setFooterObj((prevState: IResFooter) => ({
        ...prevState,
        donate: 0,
        donate_count: 0,
      }));
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
        exportCfg={{
          flag: allPermission.includes('report.donate.export'),
          excelHeader: DonateExcel,
          title: `${t('menu.reportDonate')} ${searchCfg.report_time1} - ${searchCfg.report_time2}`,
          fileName: `${t('menu.reportDonate')}  ${searchCfg.report_time1}`,
          fcExportData: async (page: number, pageSize: number) => {
            try {
              const { data: excelData } = await apiList({
                ...searchCfg,
                page: page,
                per_page: pageSize,
                export: 1,
              });
              excelData.map((item: any) => {
                item.anchor_id = anchorList.find((anchor) => anchor.value == item.anchor_id)?.text;
              });
              return Promise.resolve({ excelData });
            } catch (error) {
              throw error;
            }
          },
        }}
        searchComponent={
          <Grid container xs={12} spacing={2.5}>
            <Grid xs={12} mb={2}>
              <TreeSearch treeAgent={searchCfg} setTreeAgent={setSearchCfg} />
            </Grid>
            <Grid xs={12} md={4}>
              <SearchDateReportPicker
                views={['year', 'month', 'day', 'hours']}
                start={searchCfg.report_time1 || ''}
                end={searchCfg.report_time2 || ''}
                startKey={'report_time1'}
                endKey={'report_time2'}
                setValue={(key: string, value: string) => {
                  setSearchCfg((prevState) => ({
                    ...prevState,
                    [key]: value,
                  }));
                }}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={async () => {
                  if (pgCfg.pageIndex > 0) {
                    await setPgCfg((prevState: PgCfgProps) => ({
                      ...prevState,
                      pageIndex: 0,
                    }));
                    return;
                  }
                  await fcGetList({
                    ...pgCfg,
                    searchCfg: { ...searchCfg, ...tSearchCfg },
                  });
                }}
              >
                {t('sys.search')}
              </Button>
            </Grid>
          </Grid>
        }
      />
    </Grid>
  );
};

export default withPageHoc(ReportDonate);
