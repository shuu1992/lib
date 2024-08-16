import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// material-ui
import ScrollToTop from 'react-scroll-up';
import { useTheme } from '@mui/material/styles';
import { UpOutlined } from '@ant-design/icons';
import { useMediaQuery, Box, Container, Toolbar, Fab, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
// project import
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from '@components/@extended/Breadcrumbs';
import HorizontalBar from './Drawer/HorizontalBar';
import useConfig from '@hooks/useConfig';
import { dispatch, useSelector } from '@store/index';
import { actionOpenDrawer, actionSelectedItem } from '@store/reducers/menu';
import { fcFindObjectByPath } from '@utils/method';
import { MenuOrientation } from '@type/config';
import { apiTopinfo, apiSystime } from '@api/Auth';
import { actionTopinfo, actionSystime } from '@store/reducers/global';
// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const menuState = useSelector((state) => state.menu);
  const globalState = useSelector((state) => state.global);
  const matchDownXL = useMediaQuery(theme.breakpoints.down('xl'));
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { container, miniDrawer, menuOrientation } = useConfig();

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;
  const { pathname } = useLocation();
  const [timeCount, setTimeCount] = useState(0);
  const fcTopinfo = async () => {
    try {
      const { data } = await apiTopinfo();
      dispatch(actionTopinfo(data));
    } catch (error: any) {
      throw error;
    }
  };
  const fcSystime = async () => {
    try {
      const { data } = await apiSystime();
      dispatch(actionSystime({ sysTime: data.time }));
    } catch (error: any) {
      throw error;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fcTopinfo();
    const interval = setInterval(() => {
      setTimeCount((prevStatus) => prevStatus + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (globalState.sysTime === null) return;
    //  每1分鐘同步一次
    if (timeCount % 60 === 0 && timeCount !== 0) {
      fcTopinfo();
      fcSystime();
    }
  }, [timeCount]);

  useEffect(() => {
    const selectItem = fcFindObjectByPath(menuState.menuItems, pathname);
    dispatch(actionSelectedItem(selectItem));
  }, [pathname, menuState.menuItems]);
  // set media wise responsive drawer
  useEffect(() => {
    if (!miniDrawer) {
      dispatch(actionOpenDrawer(!matchDownXL));
    }
  }, [matchDownXL]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      {!isHorizontal ? <Drawer /> : <HorizontalBar />}
      <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar sx={{ mt: isHorizontal ? 8 : 'inherit' }} />
        <Container
          maxWidth={container ? 'xl' : false}
          sx={{
            ...(container && { px: { xs: 0, sm: 2 } }),
            position: 'relative',
            minHeight: 'calc(100vh - 110px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Breadcrumbs
            navigation={menuState.menuItems}
            title
            titleBottom
            card={false}
            divider={false}
            sx={{ marginBottom: '10px' }}
          />
          <Outlet />
          <Footer />
        </Container>
      </Box>
      <ScrollToTop showUnder={160} style={{ zIndex: 3, bottom: 25, right: 25 }}>
        <Tooltip title={t('cp.scrollTop')}>
          <Fab size="small" color="primary">
            <UpOutlined />
          </Fab>
        </Tooltip>
      </ScrollToTop>
    </Box>
  );
};

export default MainLayout;
