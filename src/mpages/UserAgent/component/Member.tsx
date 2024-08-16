import { useState, useMemo, useEffect, useRef } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@src/api/UserMember';
import { IList, IInfo, IAdd, IEdit, IDel } from '@src/api/UserMember/req';
import { IResInfo } from '@src/api/UserMember/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import { Button, Stack, Tooltip, Divider } from '@mui/material';
import { CopyOutlined } from '@ant-design/icons';
import Grid from '@mui/material/Unstable_Grid2';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PageTable from '@src/components/muiTable/MBase';
import Add from '@pages/UserAgent/member/feature/Add';
import { fcMoneyFormat } from '@src/utils/method';
import { ParentSearchProps, ParentSearchType } from './index';

const Modal = new ModalController();

const UserComMember = ({
  parentSearch,
  setParentSearch,
  pageHocProps = defaultPageHocProps,
}: WithPageHocProps & ParentSearchProps) => {
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
  // 是否初始或過
  const initRef = useRef(false);
  const [flagList, setFlagList] = useState<TbSelectProps[]>([]);
  const [groupList, setGroupList] = useState<TbSelectProps[]>([]);
  const [moneyTypeList, setmoneyTypeList] = useState<TbSelectProps[]>([]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  //Header Data
  const [headerObj, setHeaderLObj] = useState<IResInfo | any>(null);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({
    agent_id: parentSearch.pid,
    status: '',
    name: '',
    username: '',
  });
  const columns = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'id',
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          const moneyType = row.original.money_type;
          const moneyTypeObj = moneyTypeList.find((item) => item.value == moneyType);
          const status = row.original.status;
          const statusObj = statusList.find((item) => item.value == status);
          return (
            <Grid container textAlign="left" alignItems="center" style={{ minWidth: '70vw' }}>
              <Grid xs={2.5} textAlign="center">
                {row.original.id}
              </Grid>
              <Grid container xs={9.5}>
                <Grid xs={6}>
                  <Grid>
                    <CopyToClipboard text={row.original.username}>
                      <Grid p={0}>
                        {row.original.username} <CopyOutlined />
                      </Grid>
                    </CopyToClipboard>
                  </Grid>
                  <Grid>
                    <CopyToClipboard text={row.original.name}>
                      <Grid p={0}>
                        {row.original.name} <CopyOutlined />
                      </Grid>
                    </CopyToClipboard>
                  </Grid>
                </Grid>
                <Grid xs={6} my={1} textAlign="right">
                  <Button variant="outlined" color={getValueColor(theme, status)}>
                    {statusObj?.text}
                  </Button>
                </Grid>
                <Grid xs={3} my={1}>
                  {t('sys.credit')} &nbsp;{fcMoneyFormat(row.original.money)}
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
      const { data, refer, meta, header } = await apiList({
        ...parentSearch,
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      data.map((item: IResInfo) => {
        item.action = item.id as number;
      });
      const flagList: TbSelectProps[] = Object.entries(refer.flag).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
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
      initRef.current = true;
      //Search Cfg
      setFlagList(flagList);
      setGroupList(groupList);
      setmoneyTypeList(moneyTypeList);
      setTypeList(typeList);
      setStatusList(statusList);
      //Base setting
      setHeaderLObj(header);
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

  useEffect(() => {
    searchCfg.agent_id = parentSearch.pid;
    if (initRef.current === false) return;
    if (pgCfg.pageIndex > 0) {
      setPgCfg((prevState: PgCfgProps) => ({
        ...prevState,
        pageIndex: 0,
      }));
      return;
    }
    fcGetList({
      ...pgCfg,
      searchCfg: { ...parentSearch, ...searchCfg, ...tSearchCfg },
    });
  }, [parentSearch.pid]);

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
        searchExpandCfg={{ flag: false }}
        fetchData={fcGetList}
        loadingCfg={{
          flag: true,
          anim: loadingFlag,
          setFlag: () => {
            setParentSearch((prevState) => ({
              ...prevState,
            }));
            fcGetList({
              ...pgCfg,
              searchCfg: { ...parentSearch, ...searchCfg, ...tSearchCfg },
            });
          },
        }}
        addCfg={{
          flag: allPermission.includes('user.store'),
          anim: Boolean(editLoading) || loadingFlag,
          setFlag: () => {
            Modal.open(Add, {
              parentData: {
                ...headerObj,
                agent_id: parentSearch.pid,
              },
              flagList,
              groupList,
              moneyTypeList,
              typeList,
              statusList,
              fetchData: async () => {
                setParentSearch((prevState) => ({
                  ...prevState,
                }));
                fcGetList({
                  ...pgCfg,
                  searchCfg: { ...parentSearch, ...searchCfg, ...tSearchCfg },
                });
              },
            });
          },
        }}
        renderDetailPanel={({ row }: { row: any }) => {
          return (
            <Grid container p={0.5}>
              <Grid xs={4} mt={1} mb={1}>
                {t('userAgent.rakeback')}:
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                {fcMoneyFormat(row.original.rakeback)}%
              </Grid>
              <Grid xs={12}>
                <Divider />
              </Grid>
              <Grid xs={4} mt={1} mb={1}>
                <Grid> {t('userAgent.money_limit')} :</Grid>
              </Grid>
              <Grid xs={8} mt={1} mb={1} textAlign="right">
                <Grid>{fcMoneyFormat(row.original.money_limit)}</Grid>
              </Grid>
            </Grid>
          );
        }}
      />
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(UserComMember);
