// material-ui
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from '@type/config';
import logoDark from '@config/img/logodark.svg';
import logo from '@config/img/logo.svg';

// ==============================|| LOGO SVG ||============================== //

const LogoMain = ({ reverse, ...others }: { reverse?: boolean }) => {
  const theme = useTheme();

  return (
    <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="Mantis" width="100" />
  );
};

export default LogoMain;
