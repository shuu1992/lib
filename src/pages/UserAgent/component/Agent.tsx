import { useState, useMemo, useEffect, useRef } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@src/api/UserAgent';
import { IList, IInfo, IAdd, IEdit, IDel } from '@src/api/UserAgent/req';
import { IResInfo } from '@src/api/UserAgent/res';
import { getLangColor, getValueColor, getStyleColor } from '@utils/setColors';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Stack, Tooltip, Link } from '@mui/material';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Base';
import { fcMoneyFormat } from '@src/utils/method';
import { ParentSearchProps, ParentSearchType } from './index';

const Modal = new ModalController();

const UserComAgnet = ({
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
  const [groupList, setGroupList] = useState<TbSelectProps[]>([]);
  const [moneyTypeList, setmoneyTypeList] = useState<TbSelectProps[]>([]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  //Header Data
  const [headerObj, setHeaderLObj] = useState<IResInfo | any>(null);
  //是否預設搜尋參數
  const [searchCfg, setSearchCfg] = useState({});

  const columns = useMemo(
    () => [
      {
        header: t('sys.id'),
        accessorKey: 'id',
        enableClickToCopy: true,
        enableColumnFilter: false,
      },
      {
        header: t('sys.username'),
        accessorKey: 'username',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Link
              underline="always"
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setParentSearch((prevState: ParentSearchType) => ({
                  ...parentSearch,
                  pid: row.getValue('id'),
                }));
              }}
            >
              {row.getValue('username')}
            </Link>
          );
        },
      },
      {
        header: t('sys.name'),
        accessorKey: 'name',
        enableClickToCopy: true,
        enableSorting: false,
        muiFilterTextFieldProps: { placeholder: t('sys.name') },
      },
      {
        header: t('userAgent.money_type'),
        accessorKey: 'money_type',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          const moneyType = row.getValue('money_type');
          const moneyTypeObj = moneyTypeList.find((item) => item.value == moneyType);
          return (
            <Button variant="contained" color={getValueColor(theme, moneyType)}>
              {moneyTypeObj?.text}
            </Button>
          );
        },
      },
      {
        header: t('userAgent.credit'),
        accessorKey: 'credit',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('credit'))}</div>;
        },
      },
      {
        header: t('userAgent.money_limit'),
        accessorKey: 'money_limit',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('money_limit'))}</div>;
        },
      },
      {
        header: t('userAgent.share'),
        accessorKey: 'share',
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return <div> {row.getValue('share')}%</div>;
        },
      },
      {
        header: t('userAgent.rakeback'),
        accessorKey: 'rakeback',
        enableColumnFilter: false,

        Cell: ({ row }: { row: any }) => {
          return <div> {row.getValue('rakeback')}%</div>;
        },
      },
      {
        header: t('sys.status'),
        accessorKey: 'status',
        enableSorting: false,
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
      },
    ],
    [t, theme, allPermission, editLoading, searchCfg, groupList, moneyTypeList, statusList],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    setLoadingFlag(true);
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
        fetchData={fcGetList}
        loadingCfg={{
          flag: true,
          anim: loadingFlag,
          setFlag: () => {
            fcGetList({
              ...pgCfg,
              searchCfg: { ...parentSearch, ...searchCfg, ...tSearchCfg },
            });
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

export default withPageHoc(UserComAgnet);
