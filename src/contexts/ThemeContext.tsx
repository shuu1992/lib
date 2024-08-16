import { createContext, ReactNode, useMemo } from 'react';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import {
  createTheme,
  Theme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
  TypographyVariantsOptions,
} from '@mui/material/styles';
// project import
import useConfig from '@hooks/useConfig';
// types
import { CustomShadowProps } from '@type/theme';
import Palette from '@themes/palette';
import CustomShadows from '@themes/shadows';
import Typography from '@themes/typography';
import componentsOverride from '@themes/overrides';

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext({});

type AppThemeProviderProps = {
  children: ReactNode;
};

function AppThemeProvider({ children }: AppThemeProviderProps) {
  const { themeDirection, mode, presetColor, fontFamily } = useConfig();

  const theme: Theme = useMemo<Theme>(() => Palette(mode, presetColor), [mode, presetColor]);

  const themeTypography: TypographyVariantsOptions = useMemo<TypographyVariantsOptions>(
    () => Typography(mode, fontFamily, theme),
    [mode, fontFamily],
  );
  const themeCustomShadows: CustomShadowProps = useMemo<CustomShadowProps>(
    () => CustomShadows(theme),
    [theme],
  );

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1920,
        },
      },
      direction: themeDirection,
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8,
        },
      },
      palette: theme.palette,
      customShadows: themeCustomShadows,
      typography: themeTypography,
    }),
    [themeDirection, theme, themeTypography, themeCustomShadows],
  );

  const themes: Theme = createTheme(themeOptions);
  themes.components = componentsOverride(themes);

  return (
    <ConfigContext.Provider value={{}}>
      <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={themes}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </StyledEngineProvider>
    </ConfigContext.Provider>
  );
}

export { AppThemeProvider, ConfigContext };
