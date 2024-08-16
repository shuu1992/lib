import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@src/api/UserAgent';
import { IList, IInfo, IAdd, IEdit, IDel } from '@src/api/UserAgent/req';
import { IResInfo } from '@src/api/UserAgent/res';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack, Breadcrumbs, Link, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// custom Components
import SimpleTable from '@src/components/muiTable/Simple';
import { fcMoneyFormat } from '@src/utils/method';
import { ParentSearchType } from './index';

const Header = ({
  parentSearch,
  setParentSearch,
}: {
  parentSearch: ParentSearchType;
  setParentSearch: (cb: (value: ParentSearchType) => ParentSearchType) => void;
}) => {
  const theme = useTheme();
  const { t } = usePage();
  const [groupList, setGroupList] = useState<TbSelectProps[]>([]);
  const [moneyTypeList, setmoneyTypeList] = useState<TbSelectProps[]>([]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);

  //Header Data
  const [bcList, setbcList] = useState<{ id: number; name: string }[]>([]);
  const [headerObj, setHeaderLObj] = useState<IResInfo | any>(null);
  const columns = useMemo(
    () => [
      {
        header: t('sys.id'),
        accessorKey: 'id',
        enableSorting: false,
      },
      {
        header: t('sys.username'),
        accessorKey: 'username',
        enableClickToCopy: true,
        enableSorting: false,
      },
      {
        header: t('sys.name'),
        accessorKey: 'name',
        enableClickToCopy: true,
        enableSorting: false,
      },
      {
        header: t('userAgent.money_type'),
        accessorKey: 'money_type',
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          const moneyType = row.getValue('money_type');
          const moneyTypeObj = moneyTypeList.find((item) => item.value == moneyType);
          return (
            <div
              style={{
                color: moneyType === 1 ? theme.palette.primary.main : theme.palette.error.main,
              }}
            >
              {moneyTypeObj?.text}
            </div>
          );
        },
      },
      {
        header: t('userAgent.credit'),
        accessorKey: 'credit',
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('credit'))}</div>;
        },
      },
      {
        header: t('userAgent.money_limit'),
        accessorKey: 'money_limit',
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          return <div>{fcMoneyFormat(row.getValue('money_limit'))}</div>;
        },
      },
      {
        header: t('userAgent.share'),
        accessorKey: 'share',
        enableSorting: false,
      },
      {
        header: t('userAgent.rakeback'),
        accessorKey: 'rakeback',
        enableSorting: false,
      },
      {
        header: t('sys.status'),
        accessorKey: 'status',
        enableSorting: false,
        Cell: ({ row }: { row: any }) => {
          const status = row.getValue('status');
          const statusObj = statusList.find((item) => item.value == status);
          let color = '';
          switch (status) {
            case 1:
              color = theme.palette.success.main;
              break;
            case 2:
              color = theme.palette.error.main;
              break;
            case 3:
              color = theme.palette.warning.main;
              break;
          }
          return (
            <div
              style={{
                color: color,
              }}
            >
              {statusObj?.text}
            </div>
          );
        },
      },
    ],
    [t, groupList, moneyTypeList, statusList],
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
      const newbreadcrumbs = breadcrumbs.filter((item) => item.name !== 'Home');
      //Search Cfg
      setGroupList(groupList);
      setmoneyTypeList(moneyTypeList);
      setTypeList(typeList);
      setStatusList(statusList);
      //Base setting
      setbcList(newbreadcrumbs);
      setHeaderLObj(header);
    } catch (error: any) {
      throw error;
    }
  };

  useEffect(() => {
    fcGetList({ pageIndex: 0, pageSize: 1, searchCfg: { ...parentSearch } });
  }, [parentSearch.pid]);

  return (
    <Grid my={3} spacing={2}>
      <Stack my={2}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          {bcList.map((item, index) => {
            return bcList.length === index + 1 ? (
              <Typography key={index} color="text.primary">
                {item.name}
              </Typography>
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
      {headerObj && <SimpleTable columns={columns} data={[headerObj]} />}
    </Grid>
  );
};

export default Header;
