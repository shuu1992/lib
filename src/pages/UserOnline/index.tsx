import { useState, useMemo, useEffect } from 'react';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import usePage from '@hooks/usePage';
import { apiList } from '@api/UserOnline';
import { apiInfo } from '@api/UserMember';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/UserOnline/req';
import { IResInfo } from '@api/UserOnline/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Stack, Tooltip, Typography, Link } from '@mui/material';
// ant-design
import { InfoCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
// custom Components
import dayjs from 'dayjs';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import LoadingButton from '@components/@extended/LoadingButton';
import BetRecord from '@pages/GameBetRecord/component/BetRecord';
import { fcMoneyFormat } from '@src/utils/method';
import Info from './feature/Info';
import Kick from './feature/Kick';

const Modal = new ModalController();
const UserOnline = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const [groupList, setGroupList] = useState<TbSelectProps[]>([]);
  const [moneyTypeList, setmoneyTypeList] = useState<TbSelectProps[]>([]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    created_at1: '',
    created_at2: '',
    login_time1: dayjs(sysTime).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    login_time2: dayjs(sysTime).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
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
        muiFilterTextFieldProps: {
          placeholder: t('sys.username'),
        },
        Cell: ({ row }: { row: any }) => {
          const betpermission = allPermission.includes('bet_record.index');
          return (
            <Link
              color={betpermission ? 'primary' : 'inherit'}
              underline={betpermission ? 'always' : 'none'}
              sx={{ cursor: betpermission ? 'pointer' : 'default' }}
              onClick={async () => {
                if (betpermission === false) return;
                if (editLoading) return;
                await Modal.open(BetRecord, {
                  defaultSearchProps: {
                    username: row.getValue('username'),
                  },
                });
              }}
            >
              {row.getValue('username')}
            </Link>
          );
        },
      },
      {
        header: t('userOnline.name'),
        accessorKey: 'name',
        enableSorting: false,
        enableColumnFilter: false,
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
          const color = type == 1 ? 'primary' : 'error';
          return (
            <Button variant="contained" color={color}>
              {typeObj?.text}
            </Button>
          );
        },
      },
      {
        header: t('userOnline.money'),
        accessorKey: 'money',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{
                color:
                  row.getValue('money') > 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {fcMoneyFormat(row.getValue('money'))}
            </Typography>
          );
        },
      },
      {
        header: t('userOnline.payoff'),
        accessorKey: 'payoff',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{
                color:
                  row.getValue('payoff') > 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {fcMoneyFormat(row.getValue('payoff'))}
            </Typography>
          );
        },
      },
      {
        header: `${t('sys.login_ip')}`,
        accessorKey: 'login_ip',
        enableClickToCopy: true,
        muiFilterTextFieldProps: { placeholder: t('sys.login_ip') },
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div
                style={{
                  color: theme.palette.info.main,
                }}
              >
                {row.getValue('login_ip')}
              </div>
            </div>
          );
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
        header: t('userOnline.created_at'),
        accessorKey: 'created_at',
        enableColumnFilter: false,
      },
      {
        header: t('sys.login_time'),
        accessorKey: 'login_time',
        enableColumnFilter: false,
      },
      {
        header: t('sys.action'),
        accessorKey: 'action',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {allPermission.includes('user.kick') && (
                <Tooltip title={t('userOnline.kick')}>
                  <LoadingButton
                    loading={editLoading === row.getValue('id')}
                    shape="rounded"
                    color="error"
                    onClick={async () => {
                      await Modal.open(Kick, {
                        id: row.getValue('id'),
                        fetchData: async () => {
                          fcGetList({
                            ...pgCfg,
                            searchCfg: { ...searchCfg, ...tSearchCfg },
                          });
                        },
                      });
                    }}
                  >
                    <ThunderboltOutlined />
                  </LoadingButton>
                </Tooltip>
              )}
              <Tooltip title={t('sys.detail')}>
                <LoadingButton
                  loading={editLoading === row.getValue('id')}
                  shape="rounded"
                  color="primary"
                  onClick={async () => {
                    const infoData = await fcGetInfo({ id: row.getValue('id') });
                    await Modal.open(Info, {
                      infoData,
                      groupList,
                      moneyTypeList,
                      typeList,
                      statusList,
                      fetchData: async () => {
                        fcGetList({
                          ...pgCfg,
                          searchCfg: { ...searchCfg, ...tSearchCfg },
                        });
                      },
                    });
                  }}
                >
                  <InfoCircleOutlined />
                </LoadingButton>
              </Tooltip>
            </Stack>
          );
        },
      },
    ],
    [t, theme, allPermission, editLoading, searchCfg, moneyTypeList, typeList, statusList],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, refer, meta } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      data.map((item: IResInfo) => {
        item.action = item.id as number;
      });
      const groupList: TbSelectProps[] = Object.entries(refer.group_id).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const moneyTypeList: TbSelectProps[] = Object.entries(refer.money_type).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const typeList: TbSelectProps[] = Object.entries(refer.type).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const statusList: TbSelectProps[] = Object.entries(refer.status).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      //Search Cfg
      setGroupList(groupList);
      setmoneyTypeList(moneyTypeList);
      setTypeList(typeList);
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

  const fcGetInfo = async ({ id }: IInfo) => {
    setEditLoading(id);
    try {
      const { data } = await apiInfo({
        id,
      });
      setEditLoading(null);
      return Promise.resolve(data);
    } catch (error: any) {
      setEditLoading(null);
      return Promise.reject(error);
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
            <Grid xs={12} md={5}>
              <SearchDateTimeRgPicker
                showShortcutsItems={false}
                start={searchCfg.login_time1 || ''}
                end={searchCfg.login_time2 || ''}
                placeholderI18nKey="sys.login_time"
                startKey={'login_time1'}
                endKey={'login_time2'}
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
export default withPageHoc(UserOnline);
