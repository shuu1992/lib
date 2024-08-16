import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/UserLoginLog';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/UserLoginLog/req';
import { IResInfo } from '@api/UserLoginLog/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button } from '@mui/material';
// custom Components
import dayjs from 'dayjs';
import { getDateRange } from '@utils/date';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
const Modal = new ModalController();
const UserLoginLog = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  // refer list
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    created_at1: getDateRange(sysTime, 'today')[0].format('YYYY-MM-DD HH:mm:ss'),
    created_at2: getDateRange(sysTime, 'today')[1].format('YYYY-MM-DD HH:mm:ss'),
  });

  const columns = useMemo(
    () => [
      {
        header: t('sys.id'),
        accessorKey: 'id',
        enableColumnFilter: false,
      },
      {
        header: t('sys.username'),
        accessorKey: 'username',
        enableSorting: false,
        enableClickToCopy: true,
        muiFilterTextFieldProps: { placeholder: t('sys.username') },
      },
      {
        header: t('sys.login_ip'),
        accessorKey: 'ip',
        enableClickToCopy: true,
        muiFilterTextFieldProps: { placeholder: t('sys.login_ip') },
        Cell: ({ row }: { row: any }) => {
          return <div className="nowrap">{row.getValue('ip')}</div>;
        },
      },
      {
        header: t('sys.country'),
        accessorKey: 'country',
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        header: t('sys.ua'),
        accessorKey: 'ua',
        muiFilterTextFieldProps: { placeholder: t('sys.ua') },
        enableSorting: false,
        enableColumnFilter: false,
        enableClickToCopy: true,
        Cell: ({ row }: { row: any }) => {
          return <div className="nowrap">{row.getValue('ua')}</div>;
        },
        // Cell: ({ row }: { row: any }) => {
        //   let message = row.getValue('ua') ? row.getValue('ua') : '';
        //   const mesaageArr = [];
        //   while (message.length > 30) {
        //     mesaageArr.push(message.slice(0, 30));
        //     message = message.slice(30);
        //   }
        //   if (message.length > 0) {
        //     mesaageArr.push(message);
        //   }
        //   return (
        //     <div style={{ textAlign: 'left' }}>
        //       {mesaageArr.map((item, index) => (
        //         <div key={index}>{item}</div>
        //       ))}
        //     </div>
        //   );
        // },
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
        header: t('sys.login_time'),
        accessorKey: 'created_at',
        enableColumnFilter: false,
      },
    ],
    [t, theme, allPermission, editLoading, searchCfg, statusList],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, refer, meta } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      const statusList: TbSelectProps[] = refer.status.map((key: string, value: string) => ({
        value: value.toString(),
        text: key,
      }));
      //Search Cfg
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
        addCfg={{
          flag: allPermission.includes('admin.store'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {},
        }}
        searchComponent={
          <Grid container xs={12} spacing={2}>
            <Grid xs={12} md={5}>
              <SearchDateTimeRgPicker
                start={searchCfg.created_at1 || ''}
                end={searchCfg.created_at2 || ''}
                startKey={'created_at1'}
                endKey={'created_at2'}
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
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(UserLoginLog);
