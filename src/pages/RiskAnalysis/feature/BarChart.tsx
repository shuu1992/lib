import { useTheme } from '@mui/material/styles';
import usePage from '@hooks/usePage';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { fcMoneyFormat } from '@src/utils/method';

export default function RiskPieChart({
  win = 0,
  lose = 0,
  disableTotal = false,
}: {
  win: number;
  lose: number;
  disableTotal?: boolean;
}) {
  const theme = useTheme();
  const { t } = usePage();
  const data = [
    { label: t('sys.win'), value: win, color: theme.palette.error.main },
    { label: t('sys.lose'), value: lose, color: '#0088FE' },
  ];
  const total = data.map((item) => item.value).reduce((a, b) => a + b, 0);
  const getArcLabel = (params: number) => {
    const percent = params / total;
    return `${parseFloat((percent * 100).toFixed(0)) || 0}%`;
  };
  return (
    <Grid xs={12} sx={{ height: '50px' }} mt={2}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
      >
        {data.map((item, key) => {
          const value = parseInt(String(item.value)) || 0;
          const width = item.value === 0 ? '50%' : `${(value / total) * 100}%`;
          return (
            <span
              key={key}
              style={{
                backgroundColor: item.color,
                width: width,
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                borderRadius: key === 0 ? '5px 0 0 5px' : '0 5px 5px 0',
              }}
            >
              {getArcLabel(value)}
            </span>
          );
        })}
      </div>
      <Grid container mt={1}>
        <Grid xs={disableTotal === false ? 4 : 6} textAlign="left">
          {t('sys.win')} ({' '}
          {<span style={{ color: data[0].color }}>{fcMoneyFormat(data[0].value)}</span>} )
        </Grid>
        {disableTotal === false && (
          <Grid xs={4} textAlign="center">
            {t('sys.total')}:{' '}
            {<span style={{ color: theme.palette.info.main }}>{fcMoneyFormat(total)}</span>}
          </Grid>
        )}
        <Grid xs={disableTotal === false ? 4 : 6} textAlign="right">
          {t('sys.lose')} ({' '}
          {<span style={{ color: data[1].color }}>{fcMoneyFormat(data[1].value)}</span>} )
        </Grid>
      </Grid>
    </Grid>
  );
}
