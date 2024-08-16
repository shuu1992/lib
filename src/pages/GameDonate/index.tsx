import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@api/GameDonate';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/GameDonate/req';
import { IResInfo, IResFooter } from '@api/GameDonate/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';

// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Typography } from '@mui/material';
// custom Components
import { getDateRange } from '@utils/date';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import { fcMoneyFormat } from '@src/utils/method';
import { GameDonateExcel } from './excel/GameDonateExcel';

const Modal = new ModalController();
const GameDonate = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
    report_time1: getDateRange(sysTime, 'thisWeek')[0].format('YYYY-MM-DD HH:mm:ss'),
    report_time2: getDateRange(sysTime, 'thisWeek')[1].format('YYYY-MM-DD HH:mm:ss'),
  });
  const columns = useMemo(
    () => [
      {
        header: t('sys.id'),
        accessorKey: 'id',
        enableColumnFilter: false,
        Footer: () => <div>{t('sys.sum')}</div>,
      },
      {
        header: t('sys.uid'),
        accessorKey: 'uid',
        enableColumnFilter: false,
        Footer: () => <div>-</div>,
      },
      {
        header: t('sys.username'),
        accessorKey: 'username',
        enableSorting: false,
        enableClickToCopy: true,
        muiFilterTextFieldProps: { placeholder: t('sys.username') },
        Footer: () => <div>-</div>,
      },
      {
        header: t('gameDonate.order_sn'),
        accessorKey: 'order_sn',
        enableClickToCopy: true,
        muiFilterTextFieldProps: {
          placeholder: t('gameDonate.order_sn'),
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('gameDonate.room_id'),
        accessorKey: 'room_id',
        muiFilterTextFieldProps: { placeholder: t('gameDonate.room_id') },
        filterSelectOptions: roomList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const room = row.getValue('room_id');
          const roomObj = roomList.find((item) => item.value == room);
          return (
            <Button variant="outlined" color={getValueColor(theme, room)}>
              {roomObj?.text}
            </Button>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('gameDonate.anchor_id'),
        accessorKey: 'anchor_id',
        muiFilterTextFieldProps: { placeholder: t('gameDonate.anchor_id') },
        filterSelectOptions: anchorList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const anchorId = row.getValue('anchor_id');
          const anchorIdObj = anchorList.find((item) => item.value == anchorId);
          return (
            <Typography
              sx={{
                color: theme.palette.info.main,
              }}
            >
              {anchorIdObj?.text}
            </Typography>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        header: t('gameDonate.gift_id'),
        accessorKey: 'gift_id',
        muiFilterTextFieldProps: { placeholder: t('gameDonate.gift_id') },
        filterSelectOptions: giftList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const gift = row.getValue('gift_id');
          const count = row.original.gift_count;
          const giftObj = giftList.find((item) => item.value == gift);
          return (
            <Typography
              sx={{
                color: theme.palette.info.main,
              }}
            >
              {giftObj?.text + '*' + count}
            </Typography>
          );
        },

        Footer: () => <div>-</div>,
      },
      {
        header: t('gameDonate.donate'),
        accessorKey: 'donate',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return fcMoneyFormat(row.getValue('donate'));
        },
        Footer: () => <div>{fcMoneyFormat(footerObj.donate)}</div>,
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
        Footer: () => <div>-</div>,
      },
      {
        header: t('sys.created_at'),
        accessorKey: 'created_at',
        enableColumnFilter: false,
        Footer: () => <div>-</div>,
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
            <Grid xs={12} md={5}>
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
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(GameDonate);
