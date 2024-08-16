import { Outlet } from 'react-router-dom';
import Grid from '@mui/material/Grid';
const SimpleLayout = () => {
  return (
    <Grid container>
      <Outlet />
    </Grid>
  );
};

export default SimpleLayout;
