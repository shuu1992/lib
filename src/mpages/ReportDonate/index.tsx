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
import PageTable from '@components/muiTable/Base';
import { DonateExcel } from '@pages/ReportDonate/excel/DonateExcel';
import SearchDateReportPicker from '@components/search/DateReportPicker';
import SelectOutline from '@components/search/SelectOutline';
import { fcMoneyFormat } from '@src/utils/method';

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
    anchor_id: '',
    report_time1: getDateRange(sysTime, 'thisWeek')[0].format('YYYY-MM-DD HH:mm:ss'),
    report_time2: getDateRange(sysTime, 'thisWeek')[1].format('YYYY-MM-DD HH:mm:ss'),
  });

  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'anchor_id',
        enableColumnFilter: false,
        enableSorting: false,
        muiTableFooterCellProps: ({ table }: { table: any }) => {
          const footer = table.refs.tableFooterRef.current;
          if (footer && footer.firstChild && footer.firstChild.children.length === 2) {
            footer.firstChild.removeChild(footer.firstChild.lastChild);
          }
          return {
            colSpan: 2,
          };
        },
        Cell: ({ row }: { row: any }) => {
          const anchorId = row.original.anchor_id;
          const anchorIdObj = anchorList.find((item) => item.value == anchorId);
          return (
            <Grid
              container
              spacing={2}
              textAlign="left"
              alignItems="center"
              style={{ minWidth: '75vw' }}
            >
              <Grid xs={3} textAlign="center">
                {anchorIdObj?.text}
              </Grid>
              <Grid container xs={9}>
                <Grid xs={6}>
                  <Grid>{t('reportDonate.donate_count')}</Grid>
                  <Grid>{fcMoneyFormat(row.original.donate_count)}</Grid>
                </Grid>
                <Grid xs={6}>
                  <Grid>{t('reportDonate.donate')}</Grid>
                  <Grid>{fcMoneyFormat(row.original.donate)}</Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        },
        Footer: ({ table }: { table: any }) => {
          return (
            <Grid
              container
              spacing={2}
              textAlign="left"
              alignItems="center"
              style={{ minWidth: '75vw' }}
            >
              <Grid xs={3} textAlign="center">
                {t('sys.total')}
              </Grid>
              <Grid container xs={9}>
                <Grid xs={6}>
                  <Grid>{t('reportDonate.donate_count')}</Grid>
                  <Grid>{fcMoneyFormat(footerObj.donate_count)}</Grid>
                </Grid>
                <Grid xs={6}>
                  <Grid>{t('reportDonate.donate')}</Grid>
                  <Grid>{fcMoneyFormat(footerObj.donate)}</Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        },
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
            <Grid xs={12} mt={0.5}>
              <SelectOutline
                placeholder={t('gameDonate.anchor_id')}
                options={anchorList}
                value={searchCfg.anchor_id || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, anchor_id: value });
                }}
              />
            </Grid>
            <Grid xs={12} md={5}>
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
            <Grid xs={12} md={1}>
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
