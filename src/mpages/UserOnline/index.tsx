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
import { Button, Stack, Tooltip, Typography, Link, Divider } from '@mui/material';
// ant-design
import { InfoCircleOutlined, ThunderboltOutlined, CopyOutlined } from '@ant-design/icons';
// custom Components
import dayjs from 'dayjs';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/MBase';
import LoadingButton from '@components/@extended/LoadingButton';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SearchOutLine from '@components/search/InputOutline';
import SelectOutline from '@components/search/SelectOutline';
import Info from '@pages/UserOnline/feature/Info';
import Kick from '@pages/UserOnline/feature/Kick';
import BetRecord from '@pages/GameBetRecord/component/BetRecord';
import { fcMoneyFormat } from '@src/utils/method';

const Modal = new ModalController();
const MUserOnline = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
    username: '',
    type: '',
    login_ip: '',
    status: '',
    created_at1: '',
    created_at2: '',
    login_time1: dayjs(sysTime).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    login_time2: dayjs(sysTime).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  });
  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'username',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          const status = row.original.status;
          const statusObj = statusList.find((item) => item.value == status);
          const betpermission = allPermission.includes('bet_record.index');
          return (
            <Grid
              container
              spacing={1.5}
              textAlign="left"
              alignItems="center"
              style={{ minWidth: '75vw' }}
            >
              <Grid xs={2.5} textAlign="center">
                {row.original.id}
              </Grid>
              <Grid container xs={9.5}>
                <Grid xs={6} textAlign="left">
                  <CopyToClipboard text={row.original.username}>
                    <div>
                      <Link
                        color={betpermission ? 'primary' : 'inherit'}
                        underline={betpermission ? 'always' : 'none'}
                        sx={{ cursor: betpermission ? 'pointer' : 'default' }}
                        onClick={async () => {
                          if (betpermission === false) return;
                          if (editLoading) return;
                          await Modal.open(BetRecord, {
                            defaultSearchProps: {
                              username: row.original.username,
                            },
                          });
                        }}
                      >
                        {row.original.username}
                      </Link>
                      <span style={{ marginLeft: '0.5rem' }}>
                        <CopyOutlined />
                      </span>
                    </div>
                  </CopyToClipboard>
                  <div>({row.original.name})</div>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <Button size="small" variant="outlined" color={getValueColor(theme, status)}>
                    {statusObj?.text}
                  </Button>
                </Grid>
                <Grid xs={6} textAlign="left">
                  {t('userOnline.money')}
                  <Typography
                    sx={{
                      color:
                        row.original.money > 0 ? theme.palette.error.main : theme.palette.info.main,
                    }}
                  >
                    {fcMoneyFormat(row.original.money)}
                  </Typography>
                </Grid>
                <Grid xs={6} textAlign="right">
                  {t('userAgent.payoff')}
                  <Typography
                    style={{
                      color:
                        row.original.payoff >= 0
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    }}
                  >
                    {fcMoneyFormat(row.original.payoff)}
                  </Typography>
                </Grid>
                <Grid xs={12} textAlign="left">
                  <Grid>{t('sys.login_time')}:</Grid>
                  <Grid>{row.original.login_time}</Grid>
                </Grid>
              </Grid>
            </Grid>
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
            <Grid xs={12}>
              <SearchOutLine
                placeholder={t('sys.username')}
                value={searchCfg.username || ''}
                setValue={(value: string) => {
                  setSearchCfg((prevState) => ({
                    ...prevState,
                    username: value,
                  }));
                }}
              />
            </Grid>
            <Grid xs={12} mt={0.5}>
              <SelectOutline
                placeholder={t('sys.type')}
                options={typeList}
                value={searchCfg.type || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, type: value });
                }}
              />
            </Grid>
            <Grid xs={12} mt={0.5}>
              <SearchOutLine
                placeholder={t('sys.login_ip')}
                value={searchCfg.login_ip || ''}
                setValue={(value: string) => {
                  setSearchCfg((prevState) => ({
                    ...prevState,
                    ip: value,
                  }));
                }}
              />
            </Grid>
            <Grid xs={12} mt={0.5}>
              <SelectOutline
                placeholder={t('sys.status')}
                options={statusList}
                value={searchCfg.status || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, status: value });
                }}
              />
            </Grid>
            <Grid xs={12} mt={0.5}>
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
            <Grid xs={12} mt={0.5}>
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
        renderDetailPanel={({ row }: { row: any }) => {
          const type = row.original.type;
          const typeObj = typeList.find((item) => item.value == type);
          const color = type == 1 ? 'primary' : 'error';
          return (
            <Grid container alignItems="center">
              {/* 類別 */}
              <Grid xs={4} mt={1} mb={1}>
                {t('sys.type')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <Button variant="contained" color={color}>
                  {typeObj?.text}
                </Button>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              {/* 登入IP */}
              <Grid xs={2.5} mt={1} mb={1}>
                {t('sys.login_ip')}:
              </Grid>
              <Grid xs={9.5} mt={1} mb={1} textAlign="right">
                {row.original.login_ip}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              {/* 註冊時間 */}
              <Grid xs={4} mt={1} mb={1}>
                {t('userOnline.created_at')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                {row.original.created_at}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              {/* 操作 */}
              <Grid xs={4} mt={1} mb={1}>
                {t('sys.action')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <Stack
                  textAlign="left"
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  {allPermission.includes('user.kick') && (
                    <Tooltip title={t('userOnline.kick')}>
                      <LoadingButton
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="error"
                        onClick={async () => {
                          await Modal.open(Kick, {
                            id: row.original.id,
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
                      loading={editLoading === row.original.id}
                      shape="rounded"
                      color="primary"
                      onClick={async () => {
                        const infoData = await fcGetInfo({ id: row.original.id });
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
              </Grid>
            </Grid>
          );
        }}
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};
export default withPageHoc(MUserOnline);
