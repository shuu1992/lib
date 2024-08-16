import { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector } from '@store/index';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/UserMoneyflow';
import { apiInfo as apiBetInfo } from '@api/GameBetRecord';
import { apiInfo as apiDonateInfo } from '@api/GameDonate';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/UserMoneyflow/req';
import { IResInfo } from '@api/UserMoneyflow/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Link, Typography, Button } from '@mui/material';
// custom Components
import dayjs from 'dayjs';
import { getDateRange } from '@utils/date';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import { fcMoneyFormat } from '@src/utils/method';
import BetDetail from './feature/BetDetail';
import DonateDetail from './feature/DonateDetail';

const Modal = new ModalController();

const UserMoneyflow = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const [moneyRange, setMoneyRange] = useState<number[]>([-10000, 10000]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    created_at1: getDateRange(sysTime, 'today')[0].format('YYYY-MM-DD HH:mm:ss'),
    created_at2: getDateRange(sysTime, 'today')[1].format('YYYY-MM-DD HH:mm:ss'),
  });

  // 搜尋輸贏範圍
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
          return <Typography>{typeObj?.text}</Typography>;
        },
      },
      {
        header: t('userMoneyflow.order_sn'),
        accessorKey: 'order_sn',
        enableClickToCopy: true,
        muiFilterTextFieldProps: {
          placeholder: t('userMoneyflow.order_sn'),
        },
      },
      {
        header: t('userMoneyflow.related'),
        accessorKey: 'related',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          // type = 2,3,4,5,10 點擊彈窗顯示注單詳情, type = 8,9 點擊彈窗顯示打賞詳情
          const fcColorId = (type: number | string) => {
            switch (type) {
              case 2:
              case 3:
              case 4:
              case 5:
              case 10:
                if (allPermission.includes('bet_record.index')) {
                  return 'primary';
                } else {
                  return 'inherit';
                }
              case 8:
              case 9:
                if (allPermission.includes('donate.index')) {
                  return 'error';
                } else {
                  return 'inherit';
                }
              default:
                return 'inherit';
            }
          };
          const color = fcColorId(row.getValue('type'));
          return (
            <Link
              color={color}
              underline={color === 'inherit' ? 'none' : 'always'}
              sx={{ cursor: color === 'inherit' ? 'default' : 'pointer' }}
              onClick={async () => {
                if (editLoading) return;
                setEditLoading(row.getValue('id'));
                switch (row.getValue('type')) {
                  case 2:
                  case 3:
                  case 4:
                  case 5:
                  case 10: {
                    if (!allPermission.includes('bet_record.index')) {
                      return;
                    }
                    const { data, refer } = await apiBetInfo({
                      id: row.original.related_id,
                    });
                    setEditLoading(null);
                    await Modal.open(BetDetail, {
                      infoData: data,
                      refer,
                    });
                    break;
                  }
                  case 8:
                  case 9: {
                    if (!allPermission.includes('donate.index')) {
                      return;
                    }
                    const { data, refer } = await apiDonateInfo({
                      id: row.original.related_id,
                    });
                    setEditLoading(null);
                    await Modal.open(DonateDetail, {
                      infoData: data,
                      refer,
                    });
                    break;
                  }
                  default:
                    setEditLoading(null);
                    return;
                }
              }}
            >
              {row.getValue('related')}
            </Link>
          );
        },
      },
      {
        header: t('userMoneyflow.money_before'),
        accessorKey: 'money_before',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{
                color: theme.palette.info.main,
              }}
            >
              {fcMoneyFormat(row.getValue('money_before'))}
            </Typography>
          );
        },
      },
      {
        header: t('userMoneyflow.money_add'),
        accessorKey: 'money_add',
        filterVariant: 'range-slider',
        filterFn: 'betweenInclusive',
        muiFilterSliderProps: {
          marks: false,
          min: moneyRange[0],
          max: moneyRange[1],
          step: 10000,
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
                  row.getValue('money_add') > 0
                    ? theme.palette.error.main
                    : theme.palette.info.main,
              }}
            >
              {fcMoneyFormat(row.getValue('money_add'))}
            </Typography>
          );
        },
      },
      {
        header: t('userMoneyflow.money_after'),
        accessorKey: 'money_after',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{
                color: theme.palette.info.main,
              }}
            >
              {fcMoneyFormat(row.getValue('money_after'))}
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
    [t, theme, allPermission, editLoading, moneyRange, typeList],
  );
  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, refer, meta } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      const typeList: TbSelectProps[] = Object.entries(refer.type).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      //Search Cfg
      setMoneyRange(refer.mondy_add);
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
          flag: allPermission.includes('user_money_flow.store'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            return;
          },
        }}
        searchComponent={
          <Grid container xs={12} spacing={2}>
            <Grid xs={12} md={5}>
              <SearchDateTimeRgPicker
                start={searchCfg.created_at1?.toString() || ''}
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

export default withPageHoc(UserMoneyflow);
