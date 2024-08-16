import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from '@store/index';
import { MenuProps } from '@type/menu';
import { GlobalProps } from '@type/global';
import { PgCfgProps } from '@type/page';
// mui
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

export const defaultPageHocProps = {
  theme: {},
  menuState: {} as MenuProps,
  globalState: {} as GlobalProps,
  dataList: [],
  setDataList: () => {},
  loadingFlag: false,
  setLoadingFlag: () => {},
  pgCfg: {} as PgCfgProps,
  setPgCfg: () => {},
  tSearchCfg: {},
  setTSearchCfg: () => {},
  editLoading: null,
  setEditLoading: () => {},
};
export interface WithPageHocProps {
  pageHocProps?: {
    theme: any;
    menuState: MenuProps;
    globalState: GlobalProps;
    dataList: any[];
    setDataList: <T>(prevState: (value: T[]) => T[]) => void;
    loadingFlag: boolean;
    setLoadingFlag: (flag: boolean) => void;
    pgCfg: PgCfgProps;
    setPgCfg: (cb: (value: PgCfgProps) => PgCfgProps) => void;
    tSearchCfg: any;
    setTSearchCfg: (cb: (value: any) => any) => void;
    editLoading: number | null;
    setEditLoading: (index: number | null) => void;
  };
}
export const withPageHoc = <P extends WithPageHocProps>(Component: React.ComponentType<P>) => {
  const WithPage = React.memo((props: P) => {
    const theme = useTheme();
    const menuState = useSelector((state) => state.menu);
    const globalState = useSelector((state) => state.global);
    const [dataList, setDataList] = useState<any[]>([]);
    const [loadingFlag, setLoadingFlag] = useState(false);
    const pgCfgState = useMemo(
      () => ({
        pageIndex: 0,
        pageSize: 50,
        pageTotal: 0,
      }),
      [],
    );
    const [pgCfg, setPgCfg] = useState(pgCfgState);
    const [tSearchCfg, setTSearchCfg] = useState({});
    const [editLoading, setEditLoading] = useState<number | null>(null);
    const location = useLocation();
    const prevPathname = useRef(location.pathname);
    //path有變化才會回預設滾動位置
    useEffect(() => {
      if (prevPathname.current !== location.pathname) {
        window.scrollTo(0, 0);
        prevPathname.current = location.pathname;
      }
    }, [location.pathname]);

    return (
      <Component
        {...props}
        pageHocProps={{
          theme,
          menuState,
          globalState,
          dataList,
          setDataList,
          loadingFlag,
          setLoadingFlag,
          pgCfg,
          setPgCfg,
          tSearchCfg,
          setTSearchCfg,
          editLoading,
          setEditLoading,
        }}
      />
    );
  });

  WithPage.displayName = `withPage(${Component.displayName || Component.name || 'Component'})`;
  return WithPage;
};
