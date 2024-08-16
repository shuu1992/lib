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
import { Link, Typography, Button, Divider } from '@mui/material';
// ant-design
import { CopyOutlined } from '@ant-design/icons';
// custom Components
import dayjs from 'dayjs';
import { getDateRange } from '@utils/date';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@components/muiTable/MBase';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SearchOutLine from '@components/search/InputOutline';
import SelectOutline from '@components/search/SelectOutline';
import BetDetail from '@pages/UserMoneyflow/feature/BetDetail';
import DonateDetail from '@pages/UserMoneyflow/feature/DonateDetail';
import { fcMoneyFormat } from '@src/utils/method';

const Modal = new ModalController();

const MUserMoneyflow = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
    username: '',
    type: '',
    order_sn: '',
    created_at1: getDateRange(sysTime, 'today')[0].format('YYYY-MM-DD HH:mm:ss'),
    created_at2: getDateRange(sysTime, 'today')[1].format('YYYY-MM-DD HH:mm:ss'),
  });

  // 搜尋輸贏範圍
  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'id',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          const type = row.original.type;
          const typeObj = typeList.find((item) => item.value == type);

          return (
            <Grid
              container
              spacing={2}
              textAlign="left"
              alignItems="center"
              style={{ minWidth: '75vw' }}
            >
              <Grid xs={2.5} textAlign="center">
                {row.original.id}
              </Grid>
              <Grid container xs={9.5}>
                <Grid xs={6}>
                  <Grid>{t('sys.type')}</Grid>
                  <Grid style={{ color: theme.palette.info.main }}>{typeObj?.text}</Grid>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <Grid>{t('userMoneyflow.money_add')}</Grid>
                  <span
                    style={{
                      color:
                        row.original.money_add > 0
                          ? theme.palette.error.main
                          : theme.palette.info.main,
                    }}
                  >
                    {fcMoneyFormat(row.original.money_add)}
                  </span>
                </Grid>
                <Grid xs={4}>
                  <Grid>{t('sys.created_at')}:</Grid>
                </Grid>
                <Grid xs={8} textAlign="right">
                  <Grid>{row.original.created_at}</Grid>
                </Grid>
              </Grid>
            </Grid>
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
          anim: Boolean(editLoading),
          setFlag: () => {
            return;
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
                placeholder={t('userCreditflow.order_sn')}
                value={searchCfg.order_sn || ''}
                setValue={(value: string) => {
                  setSearchCfg((prevState) => ({
                    ...prevState,
                    order_sn: value,
                  }));
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
          const color = fcColorId(row.original.type);

          return (
            <Grid container p={0.5}>
              <Grid xs={4} mt={1} mb={1}>
                {t('userMoneyflow.order_sn')}:
              </Grid>
              <CopyToClipboard text={row.original.order_sn}>
                <Grid xs={8} mt={1} mb={1} textAlign="right">
                  {row.original.order_sn}
                  <CopyOutlined />
                </Grid>
              </CopyToClipboard>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('userMoneyflow.related')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <Link
                  color={color}
                  underline={color === 'inherit' ? 'none' : 'always'}
                  sx={{ cursor: color === 'inherit' ? 'default' : 'pointer' }}
                  onClick={async () => {
                    if (editLoading) return;
                    setEditLoading(row.original.id);
                    switch (row.original.type) {
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
                  {row.original.related}
                </Link>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('userMoneyflow.money_before')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <span
                  style={{
                    color: theme.palette.info.main,
                  }}
                >
                  {fcMoneyFormat(row.original.money_before)}
                </span>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('userMoneyflow.money_after')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <span
                  style={{
                    color: theme.palette.info.main,
                  }}
                >
                  {fcMoneyFormat(row.original.money_after)}
                </span>
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                {t('sys.description')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                {row.original.description}
              </Grid>
            </Grid>
          );
        }}
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(MUserMoneyflow);
