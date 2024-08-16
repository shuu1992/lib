import { useState } from 'react';
import usePage from '@hooks/usePage';
import { useSelector } from '@store/index';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Stack, Typography } from '@mui/material';
// ant-design
import { DollarOutlined, PayCircleOutlined, PropertySafetyOutlined } from '@ant-design/icons';
// Custom Components
import MainCard from '@components/MainCard';
import Notice from './feature/Notice';
import ReportCard from './feature/ReportCard';
import OnlineChart from './feature/OnlineChart';

const Dashboard = () => {
  const { t, theme, fcShowMsg } = usePage();
  const globalState = useSelector((state) => state.global);
  const menuState = useSelector((state) => state.menu);
  const { allPermission } = menuState;
  return (
    <Grid container spacing={2} p={1}>
      <Grid xs={12} md={4}>
        <ReportCard
          primary={`${t('sys.thisWeek')}${t('report.bet_total')}`}
          countNumber={globalState.bet_total}
          iconPrimary={PayCircleOutlined}
          color={theme.palette.primary.main}
        />
      </Grid>
      <Grid xs={12} md={4}>
        <ReportCard
          primary={`${t('sys.thisWeek')}${t('report.bet_real')}`}
          countNumber={globalState.bet_real}
          iconPrimary={PropertySafetyOutlined}
          color={theme.palette.info.main}
        />
      </Grid>
      <Grid xs={12} md={4}>
        <ReportCard
          primary={`${t('sys.thisWeek')}${t('report.memberWinlose')}`}
          countNumber={globalState.payoff}
          iconPrimary={DollarOutlined}
          color={theme.palette.error.main}
        />
      </Grid>
      {allPermission.includes('chart.online_count') && (
        <Grid xs={12}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h3">{t('sys.onlineCount')}</Typography>
            </Stack>
          </Box>
          <OnlineChart />
        </Grid>
      )}
      <Grid xs={12}>
        <MainCard title={`${t('dashboard.notice')}`}>
          <Notice />
        </MainCard>
      </Grid>
    </Grid>
  );
};
export default Dashboard;
