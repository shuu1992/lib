// material-ui
import { useTheme } from '@mui/material/styles';
import logoIconDark from '@config/img/logodark.svg';
import logoIcon from '@config/img/logo.svg';
import { ThemeMode } from '@type/config';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoIconDark from 'assets/images/logo-icon-dark.svg';
 * import logoIcon from 'assets/images/logo-icon.svg';
 * import { ThemeMode } from 'types/config';
 *
 */

// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = () => {
  const theme = useTheme();
  return (
    <img
      src={theme.palette.mode === ThemeMode.DARK ? logoIconDark : logoIcon}
      alt="Mantis"
      width="100"
    />
  );
};

export default LogoIcon;
