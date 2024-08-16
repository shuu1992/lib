import { useMemo } from 'react';
import usePage from '@hooks/usePage';

// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Chip } from '@mui/material';
import { getValueColor } from '@src/utils/setColors';
type PayloadType = {
  red?: { name: string };
  blue?: { name: string };
};
export default function BoxingResultTableColumn({ row }: { row: any }) {
  const { t, theme } = usePage();
  const payload: PayloadType = useMemo(() => {
    if (!row.original.payload) return {};
    return row.original.payload;
  }, [row.original.payload]);
  return (
    <>
      {row.original.numbers === '' && (
        <Grid container spacing={0.5} padding={1} alignItems="center" sx={{ minWidth: 250 }}>
          <Grid xs={6} style={{ color: theme.palette.error.main }} sx={{ textAlign: 'center' }}>
            {t('riskManage.redPlayer')}
          </Grid>
          <Grid xs={6} style={{ color: '#1668dc' }} sx={{ textAlign: 'center' }}>
            {t('riskManage.bluePlayer')}
          </Grid>
          <Grid xs={6} container spacing={0.5} justifyContent="center">
            <Chip label={payload?.red?.name} variant="outlined" color={getValueColor(theme)} />
          </Grid>
          <Grid xs={6} container spacing={0.5} justifyContent="center">
            <Chip label={payload?.blue?.name} variant="outlined" color={getValueColor(theme)} />
          </Grid>
        </Grid>
      )}
      {row.original.numbers === '0' && (
        <Grid container spacing={0.5} alignItems="center">
          {t('riskManage.redPlayer')}:{payload?.red?.name}
        </Grid>
      )}
      {row.original.numbers === '1' && (
        <Grid container spacing={0.5} alignItems="center">
          {t('riskManage.bluePlayer')}:{payload?.blue?.name}
        </Grid>
      )}
      {row.original.numbers === '2' && (
        <Grid container spacing={0.5} alignItems="center">
          {t('riskManage.tie')}
        </Grid>
      )}
    </>
  );
}
