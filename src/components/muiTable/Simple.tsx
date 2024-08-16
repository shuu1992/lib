import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styled, useTheme } from '@mui/material/styles';
import i18n from '@i18n/index';
import { MaterialReactTable, MRT_ShowHideColumnsButton } from 'material-react-table';
import { MRT_Localization_ZH_HANT } from 'material-react-table/locales/zh-Hant';
import { MRT_Localization_ZH_HANS } from 'material-react-table/locales/zh-Hans';
import { MRT_Localization_VI } from 'material-react-table/locales/vi';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import Grid from '@mui/material/Unstable_Grid2';
import { Tooltip, IconButton } from '@mui/material';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import Empty from './Empty';

function SimpleTable({
  columns,
  data,
  loadingFlag,
}: {
  columns: any[];
  data: any[];
  loadingFlag?: boolean;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [lang, setLang] = useState(MRT_Localization_ZH_HANT);
  const [advFeatures, setAdFeatures] = useState<boolean>(false); // 是否顯示進階功能

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
      enableColumnPinning={true}
      enableSorting={true}
      enableColumnOrdering={advFeatures}
      enableColumnActions={advFeatures}
      renderEmptyRowsFallback={() => <Empty />}
      enablePagination={false}
      enableFullScreenToggle={false}
      enableDensityToggle={false}
      enableFilters={false}
      enableBottomToolbar={false}
      manualSorting={false}
      state={{
        isLoading: loadingFlag,
      }}
      defaultColumn={{ minSize: 50, maxSize: 70, size: 50 }}
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
        sx: {
          display: 'none',
        },
      }}
      renderTopToolbar={({ table }) => (
        <Grid container sx={{ p: 1.5 }}>
          <Grid xs={2} xsOffset={10} display="flex" justifyContent="flex-end">
            <MRT_ShowHideColumnsButton table={table} />
            <Tooltip title={t('sys.advFeatures')}>
              <IconButton
                onClick={() => {
                  setAdFeatures(!advFeatures);
                }}
              >
                {advFeatures ? <UnlockOutlined /> : <LockOutlined />}
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      )}
    />
  );
}

export default SimpleTable;
