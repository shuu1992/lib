import { useState, useMemo, useEffect } from 'react';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import usePage from '@hooks/usePage';
import { apiList } from '@api/GameBetRecord';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/GameBetRecord/req';
import { IResInfo, IResFooter } from '@api/GameBetRecord/res';
import { getValueColor, getWinLostColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Link, Button, Stack, Tooltip, Typography } from '@mui/material';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@components/muiTable/Base';
import { fcMoneyFormat } from '@src/utils/method';

export interface ICompareSearchProps {
  game_no?: string;
  username?: string;
  room_id?: string;
}
const Modal = new ModalController();

const GameBetRecord = ({
  defaultSearchProps,
  pageHocProps = defaultPageHocProps,
}: WithPageHocProps & { defaultSearchProps: ICompareSearchProps }) => {
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
  // refer list
  const [betareaList, setBetareaList] = useState<TbSelectProps[]>([]);
  const [roomList, setRoomList] = useState<TbSelectProps[]>([]);
  const [winloseList, setWinloseList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  const [footerObj, setFooterObj] = useState<IResFooter>({
    bet_real: 0,
    bet_total: 0,
    payoff: 0,
    payout: 0,
  });
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    game_no: defaultSearchProps.game_no || '',
    username: defaultSearchProps.username || '',
    room_id: defaultSearchProps.room_id || '',
  });

  const columns = useMemo(
    () => [
      {
        header: t('sys.username'),
        accessorKey: 'username',
        enableSorting: false,
        enableClickToCopy: true,
        enableColumnFilter: defaultSearchProps.username ? false : true,
        muiFilterTextFieldProps: { placeholder: t('sys.username') },
        Footer: () => <div>{t('sys.sum')}</div>,
      },
      {
        header: t('gameBetRc.betarea_id'),
        accessorKey: 'betarea_id',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('gameBetRc.betarea_id') },
        filterSelectOptions: betareaList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const betareaId = row.getValue('betarea_id');
          const betareaObj = betareaList.find((item: any) => item.value == betareaId);
          return (
            <Typography sx={{ color: theme.palette.info.main }}>{betareaObj?.text}</Typography>
          );
        },
        Footer: () => <div>-</div>,
      },
      {
        Header: ({ column }: { column: any }) => (
          <div>
            <div>{t('gameBetRc.bet_total')}</div>
            <div>{t('gameBetRc.bet_real')}</div>
          </div>
        ),
        header: t('gameBetRc.bet_total'),
        accessorKey: 'bet_real',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div>{fcMoneyFormat(row.original.bet_total)}</div>
              <div
                style={{
                  color: theme.palette.error.main,
                }}
              >
                {fcMoneyFormat(row.getValue('bet_real'))}
              </div>
            </div>
          );
        },
        Footer: () => (
          <div>
            <div>{fcMoneyFormat(footerObj.bet_total)}</div>
            <div
              style={{
                color: theme.palette.error.main,
              }}
            >
              {fcMoneyFormat(footerObj.bet_real)}
            </div>
          </div>
        ),
      },
      {
        header: t('gameBetRc.odds'),
        accessorKey: 'odds',
        enableColumnFilter: false,
        Footer: () => <div>-</div>,
      },
      {
        header: t('gameBetRc.payout'),
        accessorKey: 'payout',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{
                color:
                  row.getValue('payout') > 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {fcMoneyFormat(row.getValue('payout'))}
            </Typography>
          );
        },
        Footer: () => (
          <div
            style={{
              color: footerObj.payout >= 0 ? theme.palette.error.main : theme.palette.info.main,
            }}
          >
            {fcMoneyFormat(footerObj.payout)}
          </div>
        ),
      },
      {
        header: t('gameBetRc.payoff'),
        accessorKey: 'payoff',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Typography
              sx={{
                color:
                  row.getValue('payoff') >= 0 ? theme.palette.error.main : theme.palette.info.main,
              }}
            >
              {fcMoneyFormat(row.getValue('payoff'))}
            </Typography>
          );
        },
        Footer: () => (
          <div
            style={{
              color: footerObj.payoff >= 0 ? theme.palette.error.main : theme.palette.info.main,
            }}
          >
            {fcMoneyFormat(footerObj.payoff)}
          </div>
        ),
      },
      {
        header: t('gameBetRc.is_lose_win'),
        accessorKey: 'is_lose_win',
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('gameBetRc.is_lose_win') },
        filterSelectOptions: winloseList,
        filterVariant: 'select',
        Cell: ({ row }: { row: any }) => {
          const winLose = row.getValue('is_lose_win');
          const winLoseObj = winloseList.find((item) => item.value == winLose);
          return (
            <Typography color={getWinLostColor(theme, winLose)}>{winLoseObj?.text}</Typography>
          );
        },
        Footer: () => <div>-</div>,
      },
    ],
    [
      t,
      theme,
      allPermission,
      editLoading,
      searchCfg,
      betareaList,
      roomList,
      winloseList,
      statusList,
    ],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, refer, meta, footer } = await apiList({
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
      const winloseList: TbSelectProps[] = Object.entries(refer.is_lose_win).map(
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
      setBetareaList(betareaList);
      setRoomList(roomList);
      setWinloseList(winloseList);
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
          flag: false,
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            return;
          },
        }}
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(GameBetRecord);
