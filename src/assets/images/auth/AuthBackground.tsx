// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import logoIcon from '@config/img/logoBg.svg';
// types
import { ThemeDirection } from '@type/config';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        filter: 'blur(18px)',
        zIndex: -1,
        bottom: 0,
        transform: theme.direction === ThemeDirection.RTL ? 'rotate(180deg)' : 'inherit',
      }}
    >
      <img
        style={{
          width: '100%',
          height: 'calc(100vh - 175px)',
        }}
        src={logoIcon}
        alt="Mantis"
        width="100"
      />
    </Box>
  );
};

export default AuthBackground;
