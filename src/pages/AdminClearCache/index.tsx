import { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Tooltip } from '@mui/material';
// ant-design
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import PageTable from '@src/components/muiTable/Simple';
import LoadingButton from '@components/@extended/LoadingButton';
import Del from './feature/Del';

const Modal = new ModalController();

const AdminClearCache = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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

  const columns = useMemo(
    () => [
      {
        header: t('sys.id'),
        accessorKey: 'id',
        enableColumnFilter: false,
      },
      {
        header: t('adminClearCache.name'),
        accessorKey: 'name',
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: t('sys.action'),
        accessorKey: 'action',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title={t('sys.clear')}>
                <LoadingButton
                  shape="rounded"
                  color="error"
                  onClick={async () => {
                    await Modal.open(Del, {
                      id: row.getValue('id'),
                      fetchData: async () => {
                        return;
                      },
                    });
                  }}
                >
                  <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                </LoadingButton>
              </Tooltip>
            </Stack>
          );
        },
      },
    ],
    [t, theme, allPermission],
  );

  useEffect(() => {
    setDataList((prevState) => [...prevState, ...[{ id: 1, name: t('adminClearCache.redis') }]]);
    setPgCfg((prevState: PgCfgProps) => ({
      ...prevState,
      pageTotal: 1,
    }));
  }, []);

  return (
    <Grid>
      <PageTable columns={columns} data={dataList}></PageTable>
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(AdminClearCache);
