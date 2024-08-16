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
import { Divider } from '@mui/material';
import Empty from './Empty';

function SimpleTable({
  columns,
  data,
  loadingFlag,
  detailPanelCfg = {
    enableExpanding: true,
    enableExpandAll: true,
  },
  renderDetailPanel,
}: {
  columns: any[];
  data: any[];
  loadingFlag?: boolean;
  detailPanelCfg?: {
    enableExpanding: boolean; // 是否顯示客制詳細資料
    enableExpandAll: boolean;
  };
  renderDetailPanel?: ({ row }: { row: any }) => React.ReactNode; // 客制詳細資料
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [lang, setLang] = useState(MRT_Localization_ZH_HANT);
  const [advFeatures, setAdFeatures] = useState<boolean>(false); // 是否顯示進階功能
  const [expanded, setExpanded] = useState<any>({}); // 展開

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
    setExpanded({});
  }, [i18n.resolvedLanguage]);
  return (
    <MaterialReactTable
      localization={lang}
      columns={columns}
      data={data}
      enableColumnPinning={true}
      enableSorting={true}
      enableExpanding={detailPanelCfg.enableExpanding}
      enableExpandAll={detailPanelCfg.enableExpandAll}
      enableColumnOrdering={advFeatures}
      enableColumnActions={advFeatures}
      renderEmptyRowsFallback={() => <Empty />}
      enablePagination={false}
      enableFullScreenToggle={false}
      enableDensityToggle={false}
      enableFilters={false}
      enableBottomToolbar={false}
      manualSorting={false}
      manualExpanding={true}
      positionExpandColumn="last"
      state={{
        isLoading: loadingFlag,
        expanded: expanded,
      }}
      defaultColumn={{ minSize: 50, maxSize: 70, size: 50 }}
      muiTablePaperProps={{
        sx: {
          overflow: 'hidden',
        },
      }}
      muiTableContainerProps={{
        sx: {
          overflow: 'hidden',
        },
      }}
      muiTableHeadCellProps={{
        sx: {
          display: 'none',
        },
      }}
      muiTableBodyCellProps={{
        align: 'center',
      }}
      muiTableFooterCellProps={{
        sx: {
          display: 'none',
        },
      }}
      // 隱藏展開全部按鈕
      muiExpandAllButtonProps={({ table }) => ({
        sx: {
          display: 'none',
          paddingLeft: 0,
        },
      })}
      muiExpandButtonProps={({ table, row }) => ({
        onClick: () => {
          setExpanded((prevState: any) => ({
            ...prevState,
            [row.id]: !row.getIsExpanded(),
          }));
        },
      })}
      renderTopToolbar={() => <Grid style={{ display: 'none' }}></Grid>}
      renderDetailPanel={renderDetailPanel}
    />
  );
}

export default SimpleTable;
