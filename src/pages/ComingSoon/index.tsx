// material-ui
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { Box, Grid, Stack, Typography, useMediaQuery, Button } from '@mui/material';
import { useTimer } from 'react-timer-hook';
import MainCard from '@components/MainCard';
import ComingSoonImg from '@config/img/maintenance/ComingSoon.png';

const TimerBox = ({ count, label }: { count: number; label: string }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <MainCard content={false} sx={{ width: { xs: 60, sm: 80 } }}>
      <Stack justifyContent="center" alignItems="center">
        <Box sx={{ py: 1.75 }}>
          <Typography variant={matchDownSM ? 'h4' : 'h2'}>{count}</Typography>
        </Box>
        <Box sx={{ p: 0.5, bgcolor: 'secondary.lighter', width: '100%' }}>
          <Typography align="center" variant="subtitle2">
            {label}
          </Typography>
        </Box>
      </Stack>
    </MainCard>
  );
};

function ComingSoon() {
  const { t } = useTranslation();
  const now: Date = new Date();
  const today: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 167, 24, 0, 0);
  const interval: number = Math.floor((today.getTime() - now.getTime()) / 1000);
  const expirtTime = new Date();
  expirtTime.setSeconds(interval);
  const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp: expirtTime });
  return (
    <>
      <Grid
        container
        spacing={4}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh', py: 2 }}
      >
        <Grid item xs={12}>
          <Box sx={{ height: { xs: 310, sm: 420 }, width: { xs: 360, sm: 'auto' } }}>
            <img src={ComingSoonImg} alt="mantis" style={{ height: '100%', width: '100%' }} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1} justifyContent="center" alignItems="center" sx={{ mt: -2 }}>
            <Typography align="center" variant="h1">
              {t('sys.comingSoon')}
            </Typography>
            <Typography align="center" color="textSecondary">
              {t('sys.comingSoonDesc')}
            </Typography>
            <Button
              onClick={() => {
                history.back();
              }}
              variant="contained"
            >
              {t('sys.goback')}
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} sx={{ width: { xs: '95%', md: '40%' } }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={{ xs: 1, sm: 2 }}
          >
            <TimerBox count={days} label={t('sys.day')} />
            <Typography variant="h1"> : </Typography>
            <TimerBox count={hours} label={t('sys.hour')} />
            <Typography variant="h1"> : </Typography>
            <TimerBox count={minutes} label={t('sys.min')} />
            <Typography variant="h1"> : </Typography>
            <TimerBox count={seconds} label={t('sys.sec')} />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default ComingSoon;
