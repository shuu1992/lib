// material-ui
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

// loader style
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 3001,
  width: '100%',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& > * + *': {
    marginTop: theme.spacing(2),
  },
}));

// ==============================|| Loader ||============================== //

const Loader = () => (
  <LoaderWrapper>
    <CircularProgress color="secondary" />
  </LoaderWrapper>
);

export default Loader;
