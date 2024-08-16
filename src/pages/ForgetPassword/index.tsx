import { Link } from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Typography, Button, InputLabel, OutlinedInput } from '@mui/material';
import AnimateButton from '@components/@extended/AnimateButton';

// ================================|| FORGOT PASSWORD ||================================ //

const ForgotPassword = () => {
  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
          sx={{ mb: { xs: -0.5, sm: 0.5 } }}
        >
          <Typography variant="h3">Forgot Password</Typography>
          <Typography
            component={Link}
            to={'/login'}
            variant="body1"
            sx={{ textDecoration: 'none' }}
            color="primary"
          >
            Back to Login
          </Typography>
        </Stack>
      </Grid>
      <Grid xs={12}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email-forgot">Email Address</InputLabel>
              <OutlinedInput
                fullWidth
                type="email"
                value=""
                name="email"
                placeholder="Enter email address"
              />
            </Stack>
          </Grid>
          <Grid xs={12}>
            <AnimateButton>
              <Button
                disableElevation
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              >
                Send Password Reset Email
              </Button>
            </AnimateButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
