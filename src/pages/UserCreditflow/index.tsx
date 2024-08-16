import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/UserCreditflow';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/UserCreditflow/req';
import { IResInfo } from '@api/UserCreditflow/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Typography, Button } from '@mui/material';
// custom Components
import dayjs from 'dayjs';
import { getDateRange } from '@utils/date';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import { fcMoneyFormat } from '@src/utils/method';

const Modal = new ModalController();
const UserCreditflow = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const [creditRange, setCreditRange] = useState<number[]>([-10000, 10000]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
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
        muiFilterTextFieldProps: {
          placeholder: t('sys.username'),
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
                color: theme.palette.info.main,
              }}
            >
              {typeObj?.text}
            </Typography>
          );
        },
      },
      {
        header: t('userCreditflow.related_username'),
        accessorKey: 'related_username',
        enableColumnFilter: false,
      },
      {
        header: t('userCreditflow.order_sn'),
        accessorKey: 'order_sn',
        enableClickToCopy: true,
        muiFilterTextFieldProps: {
          placeholder: t('userCreditflow.order_sn'),
        },
      },
      {
        header: t('userCreditflow.credit_before'),
        accessorKey: 'credit_before',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{
                color: theme.palette.info.main,
              }}
            >
              {fcMoneyFormat(row.getValue('credit_before'))}
            </Typography>
          );
        },
      },
      {
        header: t('userCreditflow.credit_add'),
        accessorKey: 'credit_add',
        filterVariant: 'range-slider',
        filterFn: 'betweenInclusive',
        muiFilterSliderProps: {
          marks: false,
          min: creditRange[0],
          max: creditRange[1],
          step: 1000,
          valueLabelFormat: (value: any) => {
            return fcMoneyFormat(value);
          },
          sx: { width: '60%' },
        },
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{
                color:
                  row.getValue('credit_add') > 0
                    ? theme.palette.error.main
                    : theme.palette.info.main,
              }}
            >
              {fcMoneyFormat(row.getValue('credit_add'))}
            </Typography>
          );
        },
      },
      {
        header: t('userCreditflow.credit_after'),
        accessorKey: 'credit_after',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{
                color: theme.palette.info.main,
              }}
            >
              {fcMoneyFormat(row.getValue('credit_after'))}
            </Typography>
          );
        },
      },
      {
        header: t('sys.created_at'),
        accessorKey: 'created_at',
        enableColumnFilter: false,
      },
      {
        header: t('sys.description'),
        accessorKey: 'description',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{
                paddingLeft: '0.5rem',
                textAlign: 'left',
              }}
            >
              {row.getValue('description')}
            </Typography>
          );
        },
      },
    ],
    [t, theme, allPermission, editLoading, searchCfg, typeList],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    try {
      const { data, refer, meta } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      setLoadingFlag(true);
      const typeList: TbSelectProps[] = Object.entries(refer.type).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      //Search Cfg
      setCreditRange(refer.credit_add);
      setTypeList(typeList);
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

  useEffect(() => {
    setDataList((prevState: IResInfo[]) => []);
  }, []);

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
        searchComponent={
          <Grid container xs={12} spacing={2}>
            <Grid xs={12} md={5}>
              <SearchDateTimeRgPicker
                showShortcutsItems={false}
                start={searchCfg.created_at1 || ''}
                end={searchCfg.created_at2 || ''}
                placeholderI18nKey="sys.created_at"
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
                onClick={() => {
                  if (pgCfg.pageIndex > 0) {
                    setPgCfg((prevState: PgCfgProps) => ({
                      ...prevState,
                      pageIndex: 0,
                    }));
                    return;
                  }
                  fcGetList({ ...pgCfg, searchCfg: { ...searchCfg, ...tSearchCfg } });
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

export default withPageHoc(UserCreditflow);
