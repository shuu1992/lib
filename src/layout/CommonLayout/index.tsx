import { Outlet } from 'react-router-dom';
// material-ui
import { Box, Grid } from '@mui/material';
// assets
import AuthBackground from '@assets/images/auth/AuthBackground';
import Logo from '@components/logo';
import Body from './Body';
import Footer from './Footer';
// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = () => (
  <Box sx={{ minHeight: '100vh' }}>
    <AuthBackground />
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      sx={{
        minHeight: '100vh',
      }}
    >
      <Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
        <Logo />
      </Grid>
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            minHeight: {
              xs: 'calc(100vh - 210px)',
              sm: 'calc(100vh - 134px)',
              md: 'calc(100vh - 112px)',
            },
          }}
        >
          <Grid>
            <Body>
              <Outlet />
            </Body>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        <Footer />
      </Grid>
    </Grid>
  </Box>
);

export default AuthWrapper;
