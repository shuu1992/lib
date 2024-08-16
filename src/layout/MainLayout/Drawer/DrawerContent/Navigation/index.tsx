import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Typography, useMediaQuery } from '@mui/material';

// project import
import NavGroup from './NavGroup';

import { useSelector } from '@store/index';
import useConfig from '@hooks/useConfig';
import { HORIZONTAL_MAX_ITEM } from '@src/config';

// types
import { NavItemType } from '@type/menu';
import { MenuOrientation } from '@type/config';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const theme = useTheme();
  const { menuItems, drawerOpen } = useSelector((state) => state.menu);
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { menuOrientation } = useConfig();
  const [selectedItems, setSelectedItems] = useState<string | number | undefined>('');
  const [selectedLevel, setSelectedLevel] = useState<number>(0);

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  const [lastItemIndex, setLastItemIndex] = useState(0);
  const [remItems, setRemItems] = useState<NavItemType[]>([]);
  const [lastItemId, setLastItemId] = useState('');

  useEffect(() => {
    if (lastItem && menuItems.length > lastItem) {
      const newLastItemIndex = lastItem - 1;
      setLastItemIndex(newLastItemIndex);
      setLastItemId(menuItems[newLastItemIndex].id);
      const newRemItems = menuItems.slice(lastItem - 1).map((item: any) => ({
        title: item.title,
        elements: item.children,
        icon: item.icon,
      }));
      setRemItems(newRemItems);
    } else {
      setLastItemIndex(menuItems?.length - 1 ?? 0);
      setRemItems([]);
      setLastItemId('');
    }
  }, [menuItems, lastItem]); // Dependency array includes menuItems and lastItem

  useEffect(() => {
    setRemItems([]);
  }, []);

  const navGroups = menuItems
    ? menuItems.slice(0, lastItemIndex + 1).map((item: any) => {
        switch (item.type) {
          case 'group':
            return (
              <NavGroup
                key={item.id}
                setSelectedItems={setSelectedItems}
                setSelectedLevel={setSelectedLevel}
                selectedLevel={selectedLevel}
                selectedItems={selectedItems}
                lastItem={lastItem!}
                remItems={remItems}
                lastItemId={lastItemId}
                item={item}
              />
            );
          default:
            return (
              <Typography key={item.id} variant="h6" color="error" align="center">
                Fix - Navigation Group
              </Typography>
            );
        }
      })
    : [];
  return (
    <Box
      sx={{
        pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
        '& > ul:first-of-type': { mt: 0 },
        display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block',
      }}
    >
      {navGroups}
    </Box>
  );
};

export default Navigation;
