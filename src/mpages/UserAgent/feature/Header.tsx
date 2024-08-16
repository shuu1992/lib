import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import useAuth from '@hooks/useAuth';
import usePage from '@hooks/usePage';
import { apiList, apiInfo, apiEdit } from '@src/api/UserAgent';
import { IList, IInfo, IAdd, IEdit, IDel } from '@src/api/UserAgent/req';
import { IResInfo } from '@src/api/UserAgent/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import {
  Stack,
  Breadcrumbs,
  Link,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider,
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// ant-design
import { HomeOutlined, DownloadOutlined, CopyOutlined } from '@ant-design/icons';
// custom Components
import LoadingButton from '@components/@extended/LoadingButton';
import SimpleTable from '@components/muiTable/MSimple';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ModalController, ModalContainer } from 'react-modal-global';
import Recycle from '@pages/UserAgent/agent/feature/Recycle';
import SubAccAdd from '@pages/UserAgent/subagent/feature/Add';
import { fcMoneyFormat } from '@src/utils/method';
import { StepType, ParentSearchType } from '../index';

const Modal = new ModalController();
const Header = ({
  parentSearch,
  step,
  setStep,
  setParentSearch,
  pageHocProps = defaultPageHocProps,
}: WithPageHocProps & {
  parentSearch: ParentSearchType;
  step: StepType;
  setStep: (step: StepType) => void;
  setParentSearch: (cb: (value: ParentSearchType) => ParentSearchType) => void;
}) => {
  const { theme, menuState, editLoading, setEditLoading } = pageHocProps;
  const { authState } = useAuth();
  const { t, fcShowMsg } = usePage();
  const { allPermission } = menuState;
  const [groupList, setGroupList] = useState<TbSelectProps[]>([]);
  const [moneyTypeList, setmoneyTypeList] = useState<TbSelectProps[]>([]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  const [currencyList, setCurrencyList] = useState<TbSelectProps[]>([]);

  //Header Data
  const [bcList, setbcList] = useState<{ id: number; name: string }[]>([]);
  const [headerObj, setHeaderObj] = useState<IResInfo | any>(null);
  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'id',
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
              style={{ minWidth: '76vw' }}
            >
              <Grid container xs={12}>
                <Grid
                  xs={5}
                  display="flex"
                  flexDirection="column"
                  alignItems="baseline"
                  justifyContent="center"
                >
                  <CopyToClipboard text={row.original.username}>
                    <Grid p={0}>
                      <span style={{ color: theme.palette.primary.main }}>
                        {row.original.username}
                      </span>
                      <CopyOutlined />
                    </Grid>
                  </CopyToClipboard>
                  <Grid p={0}>({row.original.name})</Grid>
                </Grid>

                <Grid xs={3} p={0} textAlign="right" ml={3}>
                  {t('userAgent.share')} <div>{fcMoneyFormat(row.original.share)}%</div>
                </Grid>
                <Grid xs={3} p={0} textAlign="right">
                  {t('userAgent.rakeback')} <div>{fcMoneyFormat(row.original.rakeback)}%</div>
                </Grid>

                <Grid xs={6}>
                  {t('sys.credit')} <div>{fcMoneyFormat(row.original.credit)}</div>
                </Grid>

                <Grid xs={6} textAlign="right">
                  <LoadingButton
                    loading={editLoading === row.original.id}
                    variant="outlined"
                    color={getValueColor(theme, status)}
                    onClick={async () => {
                      if (allPermission.includes('agent.update') === false) return;
                      setEditLoading(row.original.id);
                      try {
                        const { code } = await apiEdit({
                          id: row.original.id,
                          status: status === 1 ? 2 : 1,
                          check_pwd: '',
                        });
                        if (code === 200) {
                          fcShowMsg({ type: 'success', msg: t('sys.editSuc') });
                          [headerObj].find((item: any) => item.id === row.original.id).status =
                            status === 1 ? 2 : 1;
                          setHeaderObj((prevState: IResInfo) => ({ ...prevState }));
                        }
                        setEditLoading(null);
                      } catch (error: any) {
                        setEditLoading(null);
                        fcShowMsg({ type: 'error', msg: error.message });
                        throw error;
                      }
                    }}
                  >
                    {statusObj?.text}
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          );
        },
      },
    ],
    [t, theme, allPermission, editLoading, groupList, moneyTypeList, statusList],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    try {
      const { refer, header, breadcrumbs } = await apiList({
        ...parentSearch,
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
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
      const currencyList: TbSelectProps[] = Object.entries(refer.currency).map(
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
      setCurrencyList(currencyList);

      //Base setting
      setbcList(breadcrumbs);
      setHeaderObj(header);
      return { refer, header, breadcrumbs };
    } catch (error: any) {
      throw error;
    }
  };

  useEffect(() => {
    async function fcInit() {
      if (authState.user?.backstage === 2) {
        const { header } = await fcGetList({
          pageIndex: 0,
          pageSize: 1,
          searchCfg: { ...parentSearch },
        });
        if (authState.user?.backstage === 2) {
          setParentSearch((prevState) => ({
            ...prevState,
            pid: header.id,
          }));
        }
      }
    }
    fcInit();
  }, []);

  useEffect(() => {
    if (authState.user?.backstage === 1) {
      fcGetList({ pageIndex: 0, pageSize: 1, searchCfg: { ...parentSearch } });
      return;
    }
    if (authState.user?.backstage === 2) {
      fcGetList({ pageIndex: 0, pageSize: 1, searchCfg: { ...parentSearch } });
      return;
    }
  }, [parentSearch.nopid, parentSearch.pid, parentSearch.forceUpdate]);

  return (
    <Grid xs={12} style={{ width: '100%' }}>
      <Grid>
        <Stack my={3} ml={3}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            {bcList.map((item, index) => {
              return bcList.length === index + 1 ? (
                <Typography key={index} color="text.primary">
                  {item.name}
                </Typography>
              ) : item.id === 0 ? (
                <Link
                  key={index}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    setParentSearch((prevState) => ({
                      ...prevState,
                      pid: '',
                    }));
                    setStep('home');
                  }}
                >
                  <HomeOutlined />
                </Link>
              ) : (
                <Link
                  key={index}
                  style={{ cursor: 'pointer' }}
                  underline="hover"
                  onClick={() => {
                    setParentSearch((prevState) => ({
                      ...prevState,
                      pid: item.id.toString(),
                    }));
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </Breadcrumbs>
        </Stack>
      </Grid>
      <Accordion style={{ border: 'none ' }}>
        <AccordionSummary aria-controls="panel-content" id="panel-header" expandIcon={null}>
          <Grid xs={12} display="flex" justifyContent="space-between" style={{ width: '100%' }}>
            <Typography>
              {t('adminNav.pname')}
              {t('sys.search')}
            </Typography>
            <ExpandMoreIcon />
          </Grid>
        </AccordionSummary>
        <AccordionDetails style={{ border: 'none ', padding: 0 }}>
          <Grid mt={3} spacing={2}>
            {headerObj && (
              <SimpleTable
                columns={columns}
                data={[headerObj]}
                renderDetailPanel={({ row }: { row: any }) => {
                  return (
                    <Grid container p={1}>
                      <Grid xs={4} mt={1} mb={1}>
                        {t('userAgent.currency')}:
                      </Grid>
                      <Grid xs={8} mt={1} mb={1} textAlign="right">
                        {row.original.currency}
                      </Grid>
                      <Grid xs={12}>
                        <Divider />
                      </Grid>
                      <Grid xs={4} mt={1} mb={1}>
                        {t('sys.action')}:
                      </Grid>
                      <Grid xs={8} textAlign="right">
                        <Stack direction="row" alignItems="center" justifyContent="flex-end">
                          {/* 回收(凍結狀態跟信用才會有) */}
                          {allPermission.includes('agent.credit_update') &&
                            (row.original.status === 2 || row.original.status === 3) &&
                            row.original.money_type === 2 && (
                              <Tooltip title={t('sys.recycle')}>
                                <LoadingButton
                                  loading={editLoading === row.original.id}
                                  shape="rounded"
                                  color="error"
                                  onClick={async () => {
                                    await Modal.open(Recycle, {
                                      id: row.original.id,
                                      fetchData: async () => {
                                        fcGetList({
                                          pageIndex: 0,
                                          pageSize: 1,
                                          searchCfg: { ...parentSearch },
                                        });
                                      },
                                    });
                                  }}
                                >
                                  <DownloadOutlined />
                                </LoadingButton>
                              </Tooltip>
                            )}
                          {/* 新增子帳號 */}
                          {allPermission.includes('agent.credit_update') && (
                            <Tooltip title={`${t('sys.add')}${t('sys.subacc')}`}>
                              <LoadingButton
                                loading={editLoading === row.original.id}
                                shape="rounded"
                                color="success"
                                onClick={async () => {
                                  await Modal.open(SubAccAdd, {
                                    parentData: {
                                      pid: row.original.id,
                                    },
                                    fetchData: async () => {
                                      fcGetList({
                                        pageIndex: 0,
                                        pageSize: 1,
                                        searchCfg: { ...parentSearch },
                                      });
                                    },
                                  });
                                }}
                              >
                                +
                              </LoadingButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  );
                }}
              />
            )}

            <ModalContainer controller={Modal} />
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default withPageHoc(Header);
