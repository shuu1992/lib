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
import { Button, Divider } from '@mui/material';
// ant-design
import { CopyOutlined } from '@ant-design/icons';
// custom Components
import dayjs from 'dayjs';
import { getDateRange } from '@utils/date';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@components/muiTable/MBase';
import SearchOutLine from '@components/search/InputOutline';
import SelectOutline from '@components/search/SelectOutline';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';

const Modal = new ModalController();
const MUserLoginLog = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    username: '',
    status: '',
    ip: '',
    created_at1: getDateRange(sysTime, 'today')[0].format('YYYY-MM-DD HH:mm:ss'),
    created_at2: getDateRange(sysTime, 'today')[1].format('YYYY-MM-DD HH:mm:ss'),
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
          return (
            <Grid
              container
              spacing={2}
              textAlign="left"
              alignItems="center"
              style={{ minWidth: '75vw' }}
              p={1}
            >
              <Grid xs={2.5} textAlign="center">
                {row.original.id}
              </Grid>
              <Grid container xs={9.5}>
                <Grid xs={6} textAlign="left" p={0}>
                  <Grid>
                    <Grid>{t('sys.username')}</Grid>
                    <CopyToClipboard text={row.original.username}>
                      <Grid p={0}>
                        <span style={{ color: theme.palette.info.main }}>
                          {row.original.username}
                        </span>
                        <CopyOutlined style={{ marginLeft: '0.5rem' }} />
                      </Grid>
                    </CopyToClipboard>
                  </Grid>
                </Grid>

                <Grid xs={6} p={0}>
                  <Grid mt={1} textAlign="right" p={0}>
                    <Button size="small" variant="outlined" color={getValueColor(theme, status)}>
                      {statusObj?.text}
                    </Button>
                  </Grid>
                </Grid>

                <Grid xs={8} textAlign="left" p={0}>
                  <Grid>{t('sys.login_time')}:</Grid>
                  <Grid>{row.original.created_at}</Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        },
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
              <SearchOutLine
                placeholder={t('sys.login_ip')}
                value={searchCfg.ip || ''}
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
          return (
            <Grid container p={0.5}>
              <Grid xs={4} mt={1} mb={1}>
                {t('sys.ip')}:
              </Grid>
              <CopyToClipboard text={row.original.ip}>
                <Grid container xs={8}>
                  <Grid className="moblilenowrap" xs={11} mt={1} mb={1} textAlign="left">
                    {row.original.ip}
                  </Grid>
                  <Grid xs={1} mt={1} mb={1} textAlign="left">
                    <CopyOutlined style={{ marginLeft: '0.2rem' }} />
                  </Grid>
                </Grid>
              </CopyToClipboard>
              <Grid xs={4} mt={1} mb={1}>
                {t('sys.country')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="left">
                {row.original.country}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('sys.ua')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="left">
                {row.original.ua}
              </Grid>
            </Grid>
          );
        }}
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(MUserLoginLog);
