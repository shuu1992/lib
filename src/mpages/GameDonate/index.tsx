import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/GameDonate';
import { IResInfo, IResFooter } from '@api/GameDonate/res';
import { getValueColor } from '@utils/setColors';
// ant-design
import { CopyOutlined } from '@ant-design/icons';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Typography, Divider, Collapse } from '@mui/material';

// custom Components
import { getDateRange } from '@utils/date';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/MBase';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SearchOutLine from '@components/search/InputOutline';
import SelectOutline from '@components/search/SelectOutline';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import { GameDonateExcel } from '@pages/GameDonate/excel/GameDonateExcel';
import { fcMoneyFormat } from '@src/utils/method';

const Modal = new ModalController();
const MGameDonate = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  //refer list
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  const [roomList, setRoomList] = useState<TbSelectProps[]>([]);
  const [giftList, setGiftList] = useState<TbSelectProps[]>([]);
  const [anchorList, setAnchorList] = useState<TbSelectProps[]>([]);
  const [footerObj, setFooterObj] = useState<IResFooter>({
    donate: 0,
  });
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    username: '',
    order_sn: '',
    anchor_id: '',
    room_id: '',
    gift_id: '',
    status: '',
    report_time1: getDateRange(sysTime, 'thisWeek')[0].format('YYYY-MM-DD HH:mm:ss'),
    report_time2: getDateRange(sysTime, 'thisWeek')[1].format('YYYY-MM-DD HH:mm:ss'),
  });
  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'id',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          const anchorId = row.original.anchor_id;
          const anchorIdObj = anchorList.find((item) => item.value == anchorId);
          const status = row.original.status;
          const statusObj = statusList.find((item) => item.value == status);
          const room = row.original.room_id;
          const roomObj = roomList.find((item) => item.value == room);
          const gift = row.original.gift_id;
          const count = row.original.gift_count;
          const giftObj = giftList.find((item) => item.value == gift);
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
                <Grid xs={6}>
                  <Grid>{t('sys.username')}:</Grid>
                  <CopyToClipboard text={row.original.username}>
                    <Grid p={0}>
                      {row.original.username} <CopyOutlined />
                    </Grid>
                  </CopyToClipboard>
                </Grid>
                <Grid xs={6} textAlign="right">
                  <Grid>{t('gameDonate.donate')}:</Grid>
                  <Grid>{fcMoneyFormat(row.original.donate)}</Grid>
                </Grid>

                <Grid xs={6}>
                  <Grid> {t('gameDonate.anchor_id')}</Grid>
                  <Grid>
                    <Typography
                      sx={{
                        color: theme.palette.info.main,
                      }}
                    >
                      {anchorIdObj?.text}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid xs={6} textAlign="right">
                  <Grid> {t('gameDonate.gift_id')}</Grid>

                  <Typography
                    sx={{
                      color: theme.palette.info.main,
                    }}
                  >
                    {giftObj?.text + '*' + count}
                  </Typography>
                </Grid>

                <Grid xs={6}>
                  <Grid> {t('gameDonate.room_id')}</Grid>
                  <Grid>
                    <Button variant="outlined" color={getValueColor(theme, room)}>
                      {roomObj?.text}
                    </Button>
                  </Grid>
                </Grid>
                <Grid xs={6} mt={3} textAlign="right">
                  <Button size="small" variant="outlined" color={getValueColor(theme, status)}>
                    {statusObj?.text}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          );
        },
        Footer: ({ table }: { table: any }) => {
          return (
            <Grid container textAlign="left" alignItems="center" justifyContent="space-between">
              <Grid xs={2} textAlign="center">
                {t('sys.total')}
              </Grid>
              <Grid container p={0} display="flex" justifyContent="flex-end">
                <Grid>{t('gameDonate.donate')}</Grid>
                <Grid>:{fcMoneyFormat(footerObj.donate)}</Grid>
              </Grid>
            </Grid>
          );
        },
      },
    ],
    [
      t,
      theme,
      allPermission,
      editLoading,
      searchCfg,
      statusList,
      giftList,
      roomList,
      anchorList,
      footerObj,
    ],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setFooterObj((prevState: IResFooter) => ({
      ...prevState,
      donate: 0,
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
      const giftList: TbSelectProps[] = Object.entries(refer.gift).map(
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
      const statusList: TbSelectProps[] = Object.entries(refer.status).map(
        ([value, text]): TbSelectProps => ({
          text: text as string,
          value: value,
        }),
      );

      //Search Cfg
      setAnchorList(anchorList);
      setGiftList(giftList);
      setRoomList(roomList);
      setStatusList(statusList);
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
          flag: true,
          excelHeader: GameDonateExcel,
          fileName: `${t('menu.gameDonate')} ${searchCfg.report_time1} `,
          title: `${t('menu.gameDonate')} ${searchCfg.report_time1} - ${searchCfg.report_time2}`,
          fcExportData: async (page: number, pageSize: number) => {
            try {
              const { data: excelData } = await apiList({
                ...searchCfg,
                ...tSearchCfg,
                page: page,
                per_page: pageSize,
                export: 1,
              });
              excelData.map((item: any) => {
                item.room_id = roomList.find((room) => room.value == item.room_id)?.text;
                item.status = statusList.find((status) => status.value == item.status)?.text;
                item.gift_id = giftList.find((gift_id) => gift_id.value == item.gift_id)?.text;
                item.anchor_id = anchorList.find(
                  (anchor_id) => anchor_id.value == item.anchor_id,
                )?.text;
              });
              return Promise.resolve({ excelData });
            } catch (error) {
              throw error;
            }
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
              <SearchOutLine
                placeholder={t('gameDonate.order_sn')}
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
              <SelectOutline
                placeholder={t('gameDonate.room_id')}
                options={roomList}
                value={searchCfg.room_id || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, room_id: value });
                }}
              />
            </Grid>
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
            <Grid xs={12} mt={0.5}>
              <SelectOutline
                placeholder={t('gameDonate.gift_id')}
                options={giftList}
                value={searchCfg.gift_id || ''}
                setValue={(value: string) => {
                  setSearchCfg({ ...searchCfg, gift_id: value });
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
        renderDetailPanel={({ row }: { row: any }) => {
          return (
            <Grid container p={0.5}>
              <Grid xs={4} my={1}>
                {t('gameDonate.order_sn')}:
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                <CopyToClipboard text={row.original.order_sn}>
                  <Grid>
                    {row.original.order_sn} <CopyOutlined />
                  </Grid>
                </CopyToClipboard>
              </Grid>

              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('sys.uid')}:
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                {row.original.uid}
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} my={1}>
                {t('sys.created_at')}:
              </Grid>
              <Grid xs={8} my={1} textAlign="right">
                {row.original.created_at}
              </Grid>
            </Grid>
          );
        }}
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(MGameDonate);
