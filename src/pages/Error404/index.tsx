import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// project import
import { APP_DEFAULT_PATH } from '@src/config';

// assets
import error404 from '@assets/images/maintenance/Error404.webp';
import TwoCone from '@assets/images/maintenance/TwoCone.webp';

// ==============================|| ERROR 404 - MAIN ||============================== //

function Error404() {
  const { t } = useTranslation();
  return (
    <>
      <Grid
        container
        spacing={10}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh', pt: 1.5, pb: 1, overflow: 'hidden' }}
      >
        <Grid item xs={12}>
          <Stack direction="row">
            <Grid>
              <Box sx={{ width: { xs: 250, sm: 590 }, height: { xs: 130, sm: 300 } }}>
                <img src={error404} alt="mantis" style={{ width: '100%', height: '100%' }} />
              </Box>
            </Grid>
            <Grid sx={{ position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 60,
                  left: -40,
                  width: { xs: 130, sm: 390 },
                  height: { xs: 115, sm: 330 },
                }}
              >
                <img src={TwoCone} alt="mantis" style={{ width: '100%', height: '100%' }} />
              </Box>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Typography variant="h1">{t('sys.pageNotFound')}</Typography>
            <Typography
              color="textSecondary"
              align="center"
              sx={{ width: { xs: '73%', sm: '61%' } }}
            >
              {t('sys.pageNotFoundDesc')}
            </Typography>
            <Button component={Link} to={APP_DEFAULT_PATH} variant="contained">
              {t('sys.backHome')}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default Error404;
