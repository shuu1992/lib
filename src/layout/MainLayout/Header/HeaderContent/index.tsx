import { useMemo } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

// project import
import Search from './Search';
import MenuTab from './MenuTab';
import Online from './Online';
import Register from './Register';
import Localization from './Localization';
import Profile from './Profile';
import MobileSection from './MobileSection';
import Customization from './Customization';

import useConfig from '@hooks/useConfig';
import DrawerHeader from '../../Drawer/DrawerHeader';

// types
import { MenuOrientation } from '@type/config';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      {!downSM && <MenuTab />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      <Localization />
      <Online />
      <Register />
      <Customization />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
};

export default HeaderContent;
