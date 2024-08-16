import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styled, useTheme } from '@mui/material/styles';
import i18n from '@i18n/index';
import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_ZH_HANT } from 'material-react-table/locales/zh-Hant';
import { MRT_Localization_ZH_HANS } from 'material-react-table/locales/zh-Hans';
import { MRT_Localization_VI } from 'material-react-table/locales/vi';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { PgCfgProps } from '@type/page';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Typography, Tooltip } from '@mui/material';
import LoadingButton from '@components/@extended/LoadingButton';
import { SyncOutlined } from '@ant-design/icons';

import Empty from './Empty';

function ReportTable({
  columns,
  data,
  loadingFlag,
  searchCfg,
  setSearchCfg,
  fetchData,
  loadingCfg = { flag: false, anim: false, setFlag: () => {} },
  searchComponent,
}: {
  columns: any;
  data: any[];
  loadingFlag: boolean;
  searchCfg: any;
  setSearchCfg?: (cb: (value: any) => any) => void;
  fetchData: ({ searchCfg }: { searchCfg: any }) => void;
  loadingCfg: {
    flag: boolean; //是否顯示
    anim: boolean; //動畫
    setFlag: () => void; // 重新載入
  };
  searchComponent?: React.ReactNode;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [lang, setLang] = useState(MRT_Localization_ZH_HANT);
  useEffect(() => {
    switch (i18n.resolvedLanguage) {
      case 'en':
        setLang(MRT_Localization_EN);
        break;
      case 'zh-CN':
        setLang(MRT_Localization_ZH_HANS);
        break;
      case 'vi':
        setLang(MRT_Localization_VI);
        break;
      default:
        setLang(MRT_Localization_ZH_HANT);
        break;
    }
  }, [i18n.resolvedLanguage]);
  return (
    <MaterialReactTable
      localization={lang}
      columns={columns}
      data={data}
      enableColumnActions={false}
      enablePagination={false}
      renderEmptyRowsFallback={() => <Empty />}
      muiFilterTextFieldProps={{
        sx: { m: '0.5rem 0', width: '100%' },
        variant: 'outlined',
      }}
      state={{
        isLoading: loadingFlag,
      }}
      defaultColumn={{
        minSize: 5, //allow columns to get smaller than default
        maxSize: 30, //allow columns to get larger than default
        size: 10, //make columns wider by default
      }}
      muiTablePaperProps={{
        sx: {
          overflowY: 'hidden',
        },
      }}
      muiTableContainerProps={{
        sx: {
          overflowY: 'hidden',
        },
      }}
      muiTableHeadCellProps={{
        align: 'center',
      }}
      muiTableBodyCellProps={{
        align: 'center',
      }}
      muiTableFooterCellProps={{
        align: 'center',
        sx: {
          backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff',
        },
      }}
      renderTopToolbar={({ table }) => (
        <Grid container sx={{ p: 1.5 }}>
          <Grid xs={3}>
            {loadingCfg.flag && (
              <Tooltip
                title={t('sys.refresh')}
                onClick={() => {
                  if (loadingCfg.anim) return;
                  loadingCfg.setFlag();
                }}
              >
                <LoadingButton loading={loadingCfg.anim} shape="rounded" color="primary">
                  <SyncOutlined spin={loadingCfg.anim} twoToneColor={theme.palette.primary.main} />
                </LoadingButton>
              </Tooltip>
            )}
          </Grid>
          <Grid xs={12} container spacing={2} sx={{ p: 1.5 }}>
            {searchComponent}
          </Grid>
        </Grid>
      )}
      renderBottomToolbar={({ table }) => <Grid></Grid>}
    />
  );
}

export default ReportTable;
