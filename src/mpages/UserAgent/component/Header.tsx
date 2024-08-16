import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import usePage from '@hooks/usePage';
import { apiList, apiInfo } from '@src/api/UserAgent';
import { IList, IInfo, IAdd, IEdit, IDel } from '@src/api/UserAgent/req';
import { IResInfo } from '@src/api/UserAgent/res';
import { getValueColor } from '@utils/setColors';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Stack,
  Breadcrumbs,
  Link,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// ant-design
import { CopyOutlined } from '@ant-design/icons';
// custom Components
import SimpleTable from '@src/components/muiTable/MSimple';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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
  const [currencyList, setCurrencyList] = useState<TbSelectProps[]>([]);

  //Header Data
  const [bcList, setbcList] = useState<{ id: number; name: string }[]>([]);
  const [headerObj, setHeaderLObj] = useState<IResInfo | any>(null);
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
              style={{ width: '82vw' }}
            >
              <Grid container xs={12}>
                <Grid xs={6}>
                  <CopyToClipboard text={row.original.username}>
                    <Grid p={0}>
                      <span style={{ color: theme.palette.primary.main }}>
                        {row.original.username}
                      </span>
                      <CopyOutlined />
                    </Grid>
                  </CopyToClipboard>
                  <Grid p={0}>{row.original.name}</Grid>
                </Grid>
                <Grid xs={3} p={0}>
                  {t('userAgent.share')} <div>{fcMoneyFormat(row.original.share)}%</div>
                </Grid>
                <Grid xs={3} p={0}>
                  {t('userAgent.rakeback')} <div>{fcMoneyFormat(row.original.rakeback)}%</div>
                </Grid>

                <Grid xs={6}>
                  {t('sys.credit')} <div>{fcMoneyFormat(row.original.credit)}</div>
                </Grid>
                <Grid xs={3} textAlign="right">
                  {t('userAgent.currency')}:{row.original.currency}
                </Grid>
                <Grid xs={3}>
                  <Button size="small" variant="outlined" color={getValueColor(theme, status)}>
                    {statusObj?.text}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
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
      const currencyList: TbSelectProps[] = Object.entries(refer.currency).map(
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
      setCurrencyList(currencyList);

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
    <Grid xs={12} style={{ width: '100%' }}>
      <Grid>
        <Stack my={3} ml={3}>
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
                detailPanelCfg={{
                  enableExpanding: false,
                  enableExpandAll: false,
                }}
              />
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default Header;
