import { useEffect, useRef, useState } from 'react';
import i18n, { resources } from '@i18n/index';
import { useTranslation } from 'react-i18next';
import { apiLanguage } from '@api/Auth';
import { TbSelectProps } from '@type/page';
// material-ui
import { useTheme } from '@mui/material/styles';

import {
  Box,
  ClickAwayListener,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Typography,
  useMediaQuery,
} from '@mui/material';

// project import
import IconButton from '@components/@extended/IconButton';
import Transitions from '@components/@extended/Transitions';

// assets
import { TranslationOutlined } from '@ant-design/icons';
import { ThemeMode } from '@type/config';

// ==============================|| HEADER CONTENT - LOCALIZATION ||============================== //

const Localization = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const anchorRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [langOptions, setLangOptions] = useState<TbSelectProps[]>([]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (lang: string) => {
    if (lang === i18n.language) {
      setOpen(false);
      return;
    }
    i18n.changeLanguage(lang);
    window.localStorage.setItem('lang', lang);
    setOpen(false);
  };

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? 'grey.200' : 'grey.300';
  const iconBackColor = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.100';
  //取的後端api語系
  const fcLanguage = async () => {
    try {
      const { data } = await apiLanguage();
      fcI18nCheckLang(data);
    } catch (error: any) {
      throw error;
    }
  };
  // 檢查後端api語系與前端語系是否匹配
  const fcI18nCheckLang = (data: any) => {
    const options: TbSelectProps[] = [];
    Object.keys(resources).forEach((i18nItem) => {
      Object.keys(data).forEach((backendItem) => {
        if (i18nItem === backendItem) {
          options.push({ text: data[backendItem], value: backendItem });
        }
      });
    });
    setLangOptions(options);
  };
  // 初始化
  useEffect(() => {
    fcLanguage();
  }, []);

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
        aria-label="open localization"
        ref={anchorRef}
        aria-controls={open ? 'localization-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <TranslationOutlined />
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom-start' : 'bottom'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? 0 : 0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions
            type="grow"
            position={matchesXs ? 'top-right' : 'top'}
            in={open}
            {...TransitionProps}
          >
            <Paper sx={{ boxShadow: theme.customShadows.z1 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  component="nav"
                  sx={{
                    p: 0,
                    width: '100%',
                    minWidth: 200,
                    maxWidth: 290,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 0.5,
                    [theme.breakpoints.down('md')]: {
                      maxWidth: 250,
                    },
                  }}
                >
                  {langOptions.map((lang, key) => (
                    <ListItemButton
                      key={key}
                      selected={i18n.language === lang.value}
                      onClick={() => handleListItemClick(lang.value)}
                    >
                      <ListItemText
                        primary={
                          <Grid container>
                            <Typography color="textPrimary">{lang.text}</Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                              ({lang.value})
                            </Typography>
                          </Grid>
                        }
                      />
                    </ListItemButton>
                  ))}
                </List>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Localization;
