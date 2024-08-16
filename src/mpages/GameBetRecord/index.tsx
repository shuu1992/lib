import { useState, useMemo, useEffect, SyntheticEvent } from 'react';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import { TbSelectProps, PgListProps, PgCfgProps, TbMetaProps } from '@type/page';
import usePage from '@hooks/usePage';
import { apiList } from '@api/GameBetRecord';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/GameBetRecord/req';
import { IResInfo, IResFooter } from '@api/GameBetRecord/res';
import { getValueColor, getWinLostColor } from '@utils/setColors';
// ant-design
import { CopyOutlined } from '@ant-design/icons';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import {
  Link,
  Button,
  Stack,
  Tooltip,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
//ant
import { UpSquareOutlined, DownSquareOutlined } from '@ant-design/icons';
// custom Components
import { getDateRange } from '@utils/date';
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@components/muiTable/MBase';
import SearchDateTimeRgPicker from '@components/search/DateTimeRangePicker';
import { GameBetExcel } from '@pages/GameBetRecord/excel/GameBetExcel';
import LoadingButton from '@components/@extended/LoadingButton';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SearchOutLine from '@components/search/InputOutline';
import SelectOutline from '@components/search/SelectOutline';
import RefundIcon from '@components/@svgIcon/Refund';
import RestoreIcon from '@components/@svgIcon/Restore';
import Refund from '@pages/GameBetRecord/feature/Refund';
import Restore from '@pages/GameBetRecord/feature/Restore';
import GameInfo from '@pages/GameBetRecord/feature/GameInfo';
import { fcMoneyFormat } from '@src/utils/method';

const Modal = new ModalController();

const MGameBetRecord = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const [betareaList, setBetareaList] = useState<TbSelectProps[]>([]);
  const [roomList, setRoomList] = useState<TbSelectProps[]>([]);
  const [winloseList, setWinloseList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  const [meta, setMeta] = useState<TbMetaProps>({
    page: 0,
    per_page: 0,
    total: 0,
    last_page: 0,
  });
  const [footerObj, setFooterObj] = useState<IResFooter>({
    bet_real: 0,
    bet_total: 0,
    payoff: 0,
    payout: 0,
  });
  // 小計
  const [subFooterObj, setSubFooterObj] = useState<IResFooter>({
    bet_real: 0,
    bet_total: 0,
    payoff: 0,
    payout: 0,
  });
  // 展開
  const [expanded, setExpanded] = useState<string | false>(false);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    username: '',
    room_id: '',
    game_no: '',
    bet_no: '',
    betarea_id: '',
    is_lose_win: '',
    status: '',
    report_time1: getDateRange(sysTime, 'today')[0].format('YYYY-MM-DD HH:mm:ss'),
    report_time2: getDateRange(sysTime, 'today')[1].format('YYYY-MM-DD HH:mm:ss'),
  });

  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'id',
        enableColumnFilter: false,
        enableSorting: false,
        muiTableFooterCellProps: ({ table }: { table: any }) => {
          const footer = table.refs.tableFooterRef.current;
          if (footer && footer.firstChild && footer.firstChild.children.length === 2) {
            footer.firstChild.removeChild(footer.firstChild.lastChild);
          }
          return {
            colSpan: 2,
          };
        },
        Cell: ({ row }: { row: any }) => {
          const status = row.original.status;
          const statusObj = statusList.find((item) => item.value == status);
          const betareaId = row.original.betarea_id;
          const betareaObj = betareaList.find((item: any) => item.value == betareaId);
          const room = row.original.room_id;
          const roomObj = roomList.find((item) => item.value == room);
          const winLose = row.original.is_lose_win;
          const winLoseObj = winloseList.find((item) => item.value == winLose);
          return (
            <Grid
              container
              spacing={2}
              textAlign="left"
              alignItems="center"
              style={{ minWidth: '75vw' }}
              p={1}
            >
              <Grid xs={6} my={1} textAlign="left">
                <Grid>{t('gameBetRc.agent')}</Grid>
                <Grid>{row.original.agent}</Grid>
              </Grid>
              <Grid xs={6} textAlign="left">
                <Grid> {t('sys.username')}</Grid>
                <CopyToClipboard text={row.original.username}>
                  <Grid p={0} display="flex" flexDirection="row" alignItems="center">
                    <Typography
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setTSearchCfg((prevState) => ({
                          ...prevState,
                          username: row.original.username,
                        }));
                      }}
                    >
                      {row.original.username}
                    </Typography>
                    <CopyOutlined />
                  </Grid>
                </CopyToClipboard>
              </Grid>
              <Grid xs={6} my={1} textAlign="left">
                <Grid>{t('gameBetRc.report_time')}</Grid>
                <Grid>{row.original.report_time}</Grid>
              </Grid>
              <Grid xs={6} my={1} textAlign="left">
                <Grid>{t('gameBetRc.payout_time')}</Grid>
                <Grid
                  style={{
                    color: theme.palette.info.main,
                  }}
                >
                  {row.original.report_time}
                </Grid>
              </Grid>
              <Grid xs={6} textAlign="left">
                <Grid> {t('gameBetRc.room_id')}</Grid>
                <Grid>{roomObj?.text}</Grid>
              </Grid>
              <Grid xs={6} my={1} textAlign="left">
                <Grid>{t('gameBetRc.game_no')}:</Grid>
                <Link
                  color="primary"
                  underline="always"
                  sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                  onClick={async () => {
                    await Modal.open(GameInfo, {
                      infoData: {
                        ...row.original.record,
                        room_name: roomObj?.text,
                        game_no: row.original.game_no,
                      },
                    });
                  }}
                >
                  {row.original.game_no}
                </Link>
              </Grid>
              {/* <Grid xs={6} p={0} textAlign="left">
                <Grid>
                  {t('gameBetRc.rounds')} ／ {t('gameBetRc.rounds_no')}
                </Grid>
                <Grid>
                  {row.original.rounds} ／ {row.original.rounds_no}
                </Grid>
              </Grid> */}

              <Grid xs={6} textAlign="left">
                <Grid> {t('gameBetRc.betarea_id')}:</Grid>
                <Grid>
                  <Typography sx={{ color: theme.palette.info.main }}>
                    {betareaObj?.text}
                  </Typography>
                </Grid>
              </Grid>
              <Grid xs={6} my={1} textAlign="left">
                <Grid>{t('gameBetRc.bet_no')}:</Grid>
                <CopyToClipboard text={row.original.bet_no}>
                  <Grid p={0} sx={{ cursor: 'pointer', fontSize: '0.7rem' }}>
                    {row.original.bet_no}
                    <CopyOutlined />
                  </Grid>
                </CopyToClipboard>
              </Grid>
              <Grid xs={6} my={1} textAlign="left">
                <Grid>{t('gameBetRc.bet_total')}:</Grid>
                <Grid>{fcMoneyFormat(row.original.bet_total)}</Grid>
              </Grid>
              <Grid xs={6} mt={1} textAlign="left">
                <Button size="small" variant="outlined" color={getValueColor(theme, status)}>
                  {statusObj?.text}
                </Button>
              </Grid>

              <Grid xs={6} textAlign="left">
                <Grid>{t('gameBetRc.payoff')}</Grid>
                <Grid
                  style={{
                    color:
                      row.original.payoff > 0 ? theme.palette.error.main : theme.palette.info.main,
                  }}
                >
                  {fcMoneyFormat(row.original.payoff)}
                </Grid>
              </Grid>
              <Grid xs={6} textAlign="left"></Grid>
              <Grid xs={6} my={1} textAlign="left">
                <Grid>{t('gameBetRc.bet_real')}:</Grid>
                <Grid
                  style={{
                    color: theme.palette.error.main,
                  }}
                >
                  {fcMoneyFormat(row.original.bet_real)}
                </Grid>
              </Grid>
            </Grid>
          );
        },
        Footer: ({ table }: { table: any }) => {
          return (
            <Grid container>
              <Grid
                container
                spacing={2}
                py={1}
                textAlign="left"
                alignItems="center"
                style={{
                  width: '100%',
                }}
              >
                <Grid xs={2} textAlign="center">
                  {t('sys.subtotal')}
                </Grid>
                <Grid container xs={10}>
                  {/* 投注總量 */}
                  <Grid xs={6}>
                    <Grid>{t('gameBetRc.bet_total')}</Grid>
                    <Grid>{fcMoneyFormat(subFooterObj.bet_total)}</Grid>
                  </Grid>
                  {/* 輸贏 */}
                  <Grid xs={6} textAlign="left">
                    <Grid>{t('gameBetRc.payoff')}</Grid>
                    <Grid
                      style={{
                        color:
                          subFooterObj.payoff > 0
                            ? theme.palette.error.main
                            : theme.palette.info.main,
                      }}
                    >
                      {fcMoneyFormat(subFooterObj.payoff)}
                    </Grid>
                  </Grid>
                  {/* 有效投注 */}
                  <Grid xs={6}>
                    <Grid>{t('gameBetRc.bet_real')}</Grid>
                    <Grid>{fcMoneyFormat(subFooterObj.bet_real)}</Grid>
                  </Grid>

                  {/* 共幾筆 */}
                  <Grid xs={6} textAlign="left">
                    <Grid>共{fcMoneyFormat(dataList.length)}筆</Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                py={1}
                textAlign="left"
                alignItems="center"
                style={{
                  width: '100%',
                }}
              >
                <Grid xs={2} textAlign="center">
                  {t('sys.total')}
                </Grid>
                <Grid container xs={10}>
                  {/* 投注總量 */}
                  <Grid xs={6}>
                    <Grid>{t('gameBetRc.bet_total')}</Grid>
                    <Grid>{fcMoneyFormat(footerObj.bet_total)}</Grid>
                  </Grid>
                  {/* 輸贏 */}
                  <Grid xs={6} textAlign="left">
                    <Grid>{t('gameBetRc.payoff')}</Grid>
                    <Grid
                      style={{
                        color:
                          footerObj.payoff > 0 ? theme.palette.error.main : theme.palette.info.main,
                      }}
                    >
                      {fcMoneyFormat(footerObj.payoff)}
                    </Grid>
                  </Grid>
                  {/* 有效投注 */}
                  <Grid xs={6}>
                    <Grid>{t('gameBetRc.bet_real')}</Grid>
                    <Grid>{fcMoneyFormat(footerObj.bet_real)}</Grid>
                  </Grid>
                  {/* 共幾筆 */}
                  <Grid xs={6} textAlign="left">
                    <Grid>共{fcMoneyFormat(meta.total)}筆</Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          );
        },
      },
    ],
    [t, theme, allPermission, editLoading, betareaList, roomList, winloseList, statusList],
  );
  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
    try {
      const { data, refer, meta, footer } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      const subFooter: IResFooter = {
        bet_real: 0,
        bet_total: 0,
        payoff: 0,
        payout: 0,
      };
      data.map((item: IResInfo) => {
        item.action = item.id;
        subFooter.bet_real += item.bet_real;
        subFooter.bet_total += item.bet_total;
        subFooter.payoff += item.payoff;
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
      setSubFooterObj(subFooter);
      //Base setting
      setPgCfg((prevState: PgCfgProps) => ({
        ...prevState,
        pageTotal: meta.total,
      }));
      setDataList((prevState: IResInfo[]) => data);
      setLoadingFlag(false);
      setMeta(meta);
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
        tSearchCfg={tSearchCfg}
        setPgCfg={setPgCfg}
        setSearchCfg={setSearchCfg}
        setTSearchCfg={setTSearchCfg}
        fetchData={fcGetList}
        sortRowColor={true}
        searchExpandCfg={{
          flag: true,
          enable: false,
        }}
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
        exportCfg={{
          flag: true,
          excelHeader: GameBetExcel,
          title: `${t('menu.gameBetRecord')} ${searchCfg.report_time1} `,
          fileName: `${t('menu.gameBetRecord')} ${searchCfg.report_time1} `,
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
                item.betarea_id = betareaList.find(
                  (betarea) => betarea.value == item.betarea_id,
                )?.text;
                item.is_lose_win = winloseList.find(
                  (winlose) => winlose.value == item.is_lose_win,
                )?.text;
                item.status = statusList.find((status) => status.value == item.status)?.text;
              });
              return Promise.resolve({ excelData });
            } catch (error) {
              throw error;
            }
          },
        }}
        searchComponent={
          <Grid container xs={12} p={0}>
            <Grid xs={12} my={0.5}>
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

            <Grid xs={6} my={0.5}>
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
            <Grid xs={6} my={0.5}></Grid>

            <Grid xs={6} my={0.5}>
              <SearchOutLine
                placeholder={t('gameBetRc.bet_no')}
                value={searchCfg.bet_no || ''}
                setValue={(value: string) => {
                  setSearchCfg((prevState) => ({
                    ...prevState,
                    bet_no: value,
                  }));
                }}
              />
            </Grid>

            <Grid xs={6} my={0.5}>
              <SearchOutLine
                placeholder={t('gameBetRc.game_no')}
                value={searchCfg.game_no || ''}
                setValue={(value: string) => {
                  setSearchCfg((prevState) => ({
                    ...prevState,
                    game_no: value,
                  }));
                }}
              />
            </Grid>

            <Grid xs={12} p={0}>
              <Accordion
                expanded={expanded === 'panel1'}
                onChange={handleChange('panel1')}
                style={{ border: 'none ', padding: 0 }}
              >
                <AccordionSummary
                  style={{ border: 'none ', padding: 0 }}
                  aria-controls="panel-content"
                  id="panel-header"
                  expandIcon={null}
                >
                  <Grid
                    xs={12}
                    textAlign="right"
                    style={{
                      position: 'absolute',
                      top: '0.3rem',
                      fontSize: '1rem',
                    }}
                  >
                    {expanded ? <DownSquareOutlined /> : <UpSquareOutlined />}
                  </Grid>
                </AccordionSummary>
                <AccordionDetails style={{ border: 'none ', padding: 0 }}>
                  <Grid xs={12} my={0.5}>
                    <SelectOutline
                      placeholder={t('sys.status')}
                      options={statusList}
                      value={searchCfg.status || ''}
                      setValue={(value: string) => {
                        setSearchCfg({ ...searchCfg, status: value });
                      }}
                    />
                  </Grid>
                  <Grid xs={12} my={0.5}>
                    <SelectOutline
                      placeholder={t('gameBetRc.room_id')}
                      options={roomList}
                      value={searchCfg.room_id || ''}
                      setValue={(value: string) => {
                        setSearchCfg({ ...searchCfg, room_id: value });
                      }}
                    />
                  </Grid>
                  <Grid xs={12} my={0.5}>
                    <SelectOutline
                      placeholder={t('gameBetRc.is_lose_win')}
                      options={winloseList}
                      value={searchCfg.is_lose_win || ''}
                      setValue={(value: string) => {
                        setSearchCfg({ ...searchCfg, is_lose_win: value });
                      }}
                    />
                  </Grid>
                  <Grid xs={12} mt={0.5}>
                    <SelectOutline
                      placeholder={t('gameBetRc.betarea_id')}
                      options={betareaList}
                      value={searchCfg.betarea_id || ''}
                      setValue={(value: string) => {
                        setSearchCfg({ ...searchCfg, betarea_id: value });
                      }}
                    />
                  </Grid>
                </AccordionDetails>
              </Accordion>
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
          if (
            ['bet_record.restore', 'bet_record.refund'].every((item) =>
              allPermission.includes(item),
            ) === false
          ) {
            return false;
          }
          return (
            <Grid container p={0.5}>
              <Grid xs={4} my={1}>
                {t('sys.action')}:
              </Grid>
              <Grid xs={8} textAlign="right">
                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0}>
                  {/* Restore */}
                  {allPermission.includes('bet_record.restore') && (
                    <Tooltip title={t('gameBetRc.restore')}>
                      <LoadingButton
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="info"
                        onClick={async () => {
                          await Modal.open(Restore, {
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
                        <RestoreIcon
                          style={{
                            position: 'absolute',
                            width: '20px',
                            height: '20px',
                            fill: theme.palette.info.main,
                          }}
                        />
                      </LoadingButton>
                    </Tooltip>
                  )}
                  {/* Refund */}
                  {allPermission.includes('bet_record.refund') && (
                    <Tooltip title={t('gameBetRc.refund')}>
                      <LoadingButton
                        loading={editLoading === row.original.id}
                        shape="rounded"
                        color="error"
                        onClick={async () => {
                          await Modal.open(Refund, {
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
                        <RefundIcon
                          style={{
                            position: 'absolute',
                            width: '20px',
                            height: '20px',
                            fill: theme.palette.error.main,
                          }}
                        />
                      </LoadingButton>
                    </Tooltip>
                  )}
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

export default withPageHoc(MGameBetRecord);
