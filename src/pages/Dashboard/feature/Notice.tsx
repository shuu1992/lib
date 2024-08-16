import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import useAuth from '@hooks/useAuth';
import { apiList } from '@api/SiteNotice';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/SiteNotice/req';
import { IResInfo } from '@api/SiteNotice/res';
// material-ui
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
//Custom Components
import dayjs from 'dayjs';

const SiteNotice = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const { allPermission } = menuState;
  const { sysTime } = globalState;
  const { authState } = useAuth();
  const { t } = usePage();
  //是否預設搜尋參數
  const [count, setCount] = useState(0);
  const [searchCfg, setSearchCfg] = useState({
    type: 3,
    status: 1,
    flag: authState.user?.backstage === 2 ? (authState.user?.money_type === 1 ? '1' : '2') : '',
    start_time1: dayjs(sysTime).startOf('week').add(1, 'day').format('YYYY-MM-DD'),
    start_time2: dayjs(sysTime).endOf('week').add(1, 'day').format('YYYY-MM-DD'),
  });

  const columns = useMemo(
    () => [
      {
        label: t('sys.id'),
        disablePadding: false,
      },
      {
        label: t('sys.name'),
        disablePadding: false,
      },
      {
        label: t('siteNotice.content'),
        disablePadding: false,
      },
      {
        label: t('sys.created_at'),
        disablePadding: false,
      },
      {
        label: t('sys.updated_at'),
        disablePadding: false,
      },
    ],
    [t, theme],
  );

  const fcGetList = async ({ pageIndex, pageSize, searchCfg }: PgListProps) => {
    try {
      const today = dayjs();
      const { data } = await apiList({
        ...searchCfg,
        page: pageIndex + 1,
        per_page: pageSize,
      });
      const list = data.filter((item: IResInfo) => {
        return (
          dayjs(item.start_time).isBefore(today) &&
          dayjs(item.end_time).isAfter(today) &&
          item.status === 1
        );
      });
      setDataList((prevState: IResInfo[]) => list);
    } catch (error: any) {
      throw error;
    }
  };

  useEffect(() => {
    fcGetList({ ...pgCfg, searchCfg: { ...searchCfg, ...tSearchCfg } });
  }, []);

  useEffect(() => {
    if (Math.floor(count / 60) > 0 && count % 60 === 0) {
      setPgCfg((prevState: PgCfgProps) => ({
        ...prevState,
        pageIndex: 0,
      }));
      fcGetList({ ...pgCfg, searchCfg: { ...searchCfg, ...tSearchCfg } });
    }
    const interval = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' },
        }}
      >
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {columns.map((headCell, key) => (
                <TableCell
                  key={key}
                  align={'center'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList.map((row, key) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={`table-row-${key}`}
                >
                  <TableCell component="th" scope="row" align="center">
                    {row.id}
                  </TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.content}</TableCell>
                  <TableCell align="center">{row.start_time}</TableCell>
                  <TableCell align="center">{row.end_time}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default withPageHoc(SiteNotice);
