export const keyName = import.meta.env.VITE_TITLE + '_';
/**
 * 存儲localStorage
 */
export const setLocalStorage = (name: string, content: string) => {
  const localName = keyName + name;
  window.localStorage.setItem(localName, content);
};

/**
 * 獲取localStorage
 */
export const getLocalStorage = (name: string) => {
  const localName = keyName + name;
  const value: string | null = window.localStorage.getItem(localName);
  if (value && value != 'undefined' && value != 'null') {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }
  return null;
};

/**
 * 刪除localStorage
 */
export const removeLocalStorage = (name: string) => {
  const localName = keyName + name;
  if (!localName) return;
  window.window.localStorage.removeItem(localName);
};
/**
 * 刪除All localStorage
 */
export const removeAllLocalStorage = () => {
  const noRemove = ['agentCode', 'inviteCode', 'loginData', 'remFlag', 'device', 'newDialogFlag'];
  Object.keys(localStorage).filter((item) => {
    if (item.indexOf(keyName) !== -1) {
      const localName = item.replace(keyName, '');
      if (!noRemove.includes(localName)) {
        window.window.localStorage.removeItem(item);
      }
    }
  });
};

/**
 * 語系map
 */
export const mapLang = (lang: string) => {
  let defaultLang = '';
  switch (lang) {
    case 'zh-TW':
      defaultLang = 'zh_tw';
      break;
    case 'vi':
      defaultLang = 'vi_vn';
      break;
    default:
      defaultLang = 'zh_tw';
      break;
  }
  return defaultLang;
};
export function getTokenFromURL() {
  const url = window.location.href;
  const tokenRegex = /token=([^&]+)/;
  const match = url.match(tokenRegex);

  if (match) {
    return decodeURIComponent(match[1].replace(/%20/g, ' '));
  }
  return null;
}
export interface IMenuItem {
  title?: string;
  name: string;
  type?: string;
  url?: string;
  id: number;
  pid: number;
  icon?: string;
  route: string;
  final: number;
  children: IMenuItem[];
  pname?: string;
}

export const fcExtractRoutes = (item: IMenuItem): string[] => {
  let routes = item.route ? item.route.split(',') : [];
  if (item.children === undefined) return routes;
  item.children.forEach((child: IMenuItem) => {
    routes = routes.concat(fcExtractRoutes(child));
  });

  return routes;
};

export const fcFindObjectByPath = (arr: IMenuItem[], targetURL: string): IMenuItem[] => {
  const result: IMenuItem[] = [];

  function searchObjectsRecursive(items: IMenuItem[]) {
    for (const item of items) {
      if (item.url === targetURL) {
        result.push(item);
      }
      if (item.children) {
        searchObjectsRecursive(item.children);
      }
    }
  }

  searchObjectsRecursive(arr);

  return result;
};
