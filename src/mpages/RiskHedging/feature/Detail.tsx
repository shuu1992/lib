import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiDetail } from '@api/RiskHedging';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/RiskHedging/req';
import { IResDetail } from '@api/RiskHedging/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Typography, Divider } from '@mui/material';
// custom Components
import { useModalWindow } from 'react-modal-global';
import PageTable from '@components/muiTable/MBase';
import CustomizedDialog from '@components/dialog/MFormDialog';
import { minWidth } from '@mui/system';
import { fcMoneyFormat } from '@src/utils/method';

export interface IDetailSearchProps {
  username: string;
  uid: number;
  target_uid: number;
  report_time1: string;
  report_time2: string;
}

const Detail = ({
  defaultSearchProps,
  pageHocProps = defaultPageHocProps,
}: WithPageHocProps & { defaultSearchProps: IDetailSearchProps }) => {
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
  const [betareaList, setBetareaList] = useState<TbSelectProps[]>([]);
  const [roomList, setRoomList] = useState<TbSelectProps[]>([]);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    uid: defaultSearchProps.uid,
    target_uid: defaultSearchProps.target_uid,
    report_time1: defaultSearchProps.report_time1,
    report_time2: defaultSearchProps.report_time2,
  });

  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'room_id',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          const room = row.original.room_id;
          const roomObj = roomList.find((item) => item.value == room);
          return (
            <Grid
              container
              spacing={2}
              textAlign="left"
              alignItems="center"
              p={1}
              style={{ minWidth: '75vw' }}
            >
              <Grid xs={3} textAlign="center">
                <Grid xs={6}>
                  <Grid>{t('riskHedging.room_id')}</Grid>
                  <Grid>{roomObj?.text}</Grid>
                </Grid>
              </Grid>
              <Grid container xs={9}>
                <Grid xs={6}>
                  <Grid>{t('sys.username')}</Grid>
                  <Grid>{t('riskHedging.target_username')}</Grid>
                  <Grid>
                    <Typography
                      sx={{
                        color: theme.palette.info.main,
                      }}
                    >
                      {row.original.username}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography
                      sx={{
                        color: theme.palette.error.main,
                      }}
                    >
                      {row.original.target_username}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <Grid>{t('sys.ip')}</Grid>
                  <Grid>{t('riskHedging.target_ip')}</Grid>
                  <Grid>
                    <Typography
                      sx={{
                        color: theme.palette.info.main,
                      }}
                    >
                      {row.original.ip}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography
                      sx={{
                        color: theme.palette.error.main,
                      }}
                    >
                      {row.original.target_ip}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        },
      },
    ],
    [t, theme, allPermission, editLoading, betareaList, roomList],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, meta, refer } = await apiDetail({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      const betareaList: TbSelectProps[] = Object.entries(refer.betarea).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const roomList: TbSelectProps[] = Object.entries(refer.room).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      //Search Cfg
      setBetareaList(betareaList);
      setRoomList(roomList);
      //Base setting
      setPgCfg((prevState: PgCfgProps) => ({
        ...prevState,
        pageTotal: meta.total,
      }));
      setDataList((prevState: IResDetail[]) => data);
      setLoadingFlag(false);
    } catch (error: any) {
      setLoadingFlag(false);
      throw error;
    }
  };

  return (
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
      renderDetailPanel={({ row }: { row: any }) => {
        const betareaId = row.original.betarea_id;
        const target_betarea_id = row.original.target_betarea_id;
        const betareaObj = betareaList.find((item: any) => item.value == betareaId);
        const target_betareaObj = betareaList.find((item: any) => item.value == target_betarea_id);
        return (
          <Grid container p={0.5}>
            <Grid xs={4} my={1}>
              <Grid>{t('riskHedging.game_no')}</Grid>
            </Grid>
            <Grid xs={8} my={1} textAlign="right">
              <Grid>{row.original.game_no}</Grid>
            </Grid>
            <Grid xs={12}>
              <Divider />
            </Grid>

            <Grid xs={4} my={1}>
              <Grid>{t('riskHedging.betarea_id')}</Grid>
              <Grid>{t('riskHedging.target_betarea_id')}</Grid>
            </Grid>
            <Grid xs={8} my={1} textAlign="right">
              <Grid>
                <Typography
                  sx={{
                    color: theme.palette.info.main,
                  }}
                >
                  {betareaObj?.text}
                </Typography>
              </Grid>
              <Grid>
                <Typography
                  sx={{
                    color: theme.palette.error.main,
                  }}
                >
                  {target_betareaObj?.text}
                </Typography>
              </Grid>
            </Grid>
            <Grid xs={12}>
              <Divider />
            </Grid>

            <Grid xs={4} my={1}>
              <Grid>{t('report.bet_total')}</Grid>
              <Grid>{t('riskHedging.target_bet_total')}</Grid>
            </Grid>
            <Grid xs={8} my={1} textAlign="right">
              <Typography
                sx={{
                  color: theme.palette.info.main,
                }}
              >
                {fcMoneyFormat(row.original.bet_total)}
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.error.main,
                }}
              >
                {fcMoneyFormat(row.original.target_bet_total)}
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Divider />
            </Grid>
            <Grid xs={4} my={1}>
              <Grid> {t('report.bet_real')}</Grid>
              <Grid> {t('riskHedging.target_bet_real')}</Grid>
            </Grid>
            <Grid xs={8} my={1} textAlign="right">
              <Typography
                sx={{
                  color: theme.palette.info.main,
                }}
              >
                {fcMoneyFormat(row.original.bet_real)}
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.error.main,
                }}
              >
                {fcMoneyFormat(row.original.target_bet_real)}
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Divider />
            </Grid>

            <Grid xs={4} my={1}>
              <Grid>{t('riskHedging.report_time')}</Grid>
              <Grid>{t('riskHedging.target_report_time')}</Grid>
            </Grid>
            <Grid xs={8} my={1} textAlign="right">
              <Grid>
                <Typography
                  sx={{
                    color: theme.palette.info.main,
                  }}
                >
                  {row.original.report_time}
                </Typography>
              </Grid>
              <Grid>
                <Typography
                  sx={{
                    color: theme.palette.error.main,
                  }}
                >
                  {row.original.target_report_time}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
      }}
    />
  );
};

export default function DetailDialog({
  defaultSearchProps,
}: {
  defaultSearchProps: IDetailSearchProps;
}) {
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();
  const DetalComp = withPageHoc(Detail);
  const fcCloseDialog = () => {
    modal.close();
  };

  return (
    <CustomizedDialog
      className="xs"
      flag={!modal.closed}
      title={t('sys.notice')}
      confirmCfg={{
        flag: false,
        txt: t('sys.confirm'),
        fcConfirm: async () => {
          return Promise.resolve();
        },
      }}
      fcChangeDialog={fcCloseDialog}
    >
      <Grid container>
        <Grid xs={12}>
          <DetalComp defaultSearchProps={defaultSearchProps} />
        </Grid>
      </Grid>
    </CustomizedDialog>
  );
}
