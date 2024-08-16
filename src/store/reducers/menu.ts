import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// types
import { MenuProps, NavItemType } from '@type/menu';
import { apiSidebar } from '@api/Auth';
import menuItem from '@menuItems/index';
import { fcExtractRoutes } from '@utils/method';
// initial state
const initialState: MenuProps = {
  openItem: [],
  selectedID: null,
  selectedItem: null, //當前選擇的項目
  allPermission: [], // 所有權限
  historySelect: [], // 歷史頁面
  drawerOpen: false, // 左側欄開關
  menuItems: [], //後台map後的menu列表
  defaultMenu: [], // 預設menu
};

export const fetchMenu = createAsyncThunk('', async () => {
  const { data } = await apiSidebar();
  return data;
});
// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    actionActiveItem(state, action) {
      state.openItem = action.payload.openItem;
    },
    actionActiveID(state, action) {
      state.selectedID = action.payload;
    },
    actionOpenDrawer(state, action) {
      state.drawerOpen = action.payload;
    },
    actionResetSelectedItem(state) {
      state.selectedItem = [];
    },
    actionSelectedItem(state, action) {
      //設定所在頁面有哪些權限
      if (action.payload.length === 0) return;
      const selectItem = action.payload[0];
      state.selectedItem = selectItem;
      state.historySelect.find((x) => x.id === selectItem.id) ||
        state.historySelect.push(selectItem);
    },
    // 清除歷史資訊
    actionDelHistoryItem(state, action) {
      const delIndex = state.historySelect.findIndex((x) => x.id === action.payload);
      state.historySelect.splice(delIndex, 1);
    },
    actionInitial(state) {
      state.menuItems = [];
      state.openItem = [];
      state.selectedID = null;
      state.selectedItem = null;
      state.historySelect = [];
      state.drawerOpen = false;
    },
  },
  extraReducers(builder) {
    //設定所有menu
    builder.addCase(fetchMenu.fulfilled, (state, action) => {
      const menuList: any = [];
      state.defaultMenu = action.payload;
      // 新增dashboard
      menuList.push(menuItem.items.find((x) => x.url === '/dashboard'));

      state.defaultMenu.forEach((item: any, key: number) => {
        // 單一項目
        // if (item.children.length === 0) {
        //   const objItem: any = menuItem.items.find((x) => x.url === item.url);
        //   const copyOfChild = { ...objItem.children[0] };

        //   if (objItem && objItem.children) {
        //     copyOfChild.icon = item.icon;
        //   }
        //   menuList.push(Object.assign({}, objItem, { id: item.id }));
        //   return;
        // }
        const obj = { id: key, type: 'group', children: [] as NavItemType[] };
        let childObj = {} as NavItemType;
        const menu = menuItem.items.find((x) => x.url === item.url);
        if (!menu) return;
        childObj = {
          ...item,
          ...menu,
          url: '',
          icon: item.icon,
          children: [],
        };
        item.children.forEach((child: any) => {
          const submenu = menu?.children?.find((x) => x.url === child.url);
          if (!submenu) return;
          childObj?.children?.push({ ...submenu, ...child });
        });
        obj.children?.push(childObj);
        menuList.push(obj);
      });

      // 設定所有權限
      const allPermission: string[] = [];
      state.defaultMenu.forEach((item: any) => {
        allPermission.push(...fcExtractRoutes(item));
      });
      state.allPermission = allPermission;
      state.menuItems = menuList;
      // 設定預設頁面
      const defaultHistorySelect = menuList.find((x: any) => x.url === '/dashboard');
      state.historySelect.push(defaultHistorySelect['children'][0]);
    });
  },
});

export default menu.reducer;

export const {
  actionActiveItem,
  actionOpenDrawer,
  actionActiveID,
  actionSelectedItem,
  actionResetSelectedItem,
  actionDelHistoryItem,
  actionInitial,
} = menu.actions;
