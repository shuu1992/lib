import _ from 'lodash';
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
//遞迴找出所有routes權限
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

/**
 * 檢查兩個陣列是否具有相同順序的相同元素。
 *
 * @template T - 陣列中元素的類型。
 * @param {T[]} arr1 - 第一個陣列。
 * @param {T[]} arr2 - 第二個陣列。
 * @returns {boolean} - 如果陣列具有相同順序的相同元素，則返回 true，否則返回 false。
 */
export const fcArraysSame = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((item, index) => item === arr2[index]);
};

/**
 * 將輸入的數字或字串轉換為二進制表示的冪次數字陣列的字串。
 * 如果輸入無效或為零，則返回空字串。
 * @param input 要轉換的數字或字串
 * @returns 二進制表示的冪次數字陣列的字串
 */
export const findPowersOfTwoAsString = (input: string | number): string => {
  const num = typeof input === 'string' ? parseInt(input, 10) : input;

  // 檢查轉換後的數字是否為有效的數字
  if (isNaN(num) || num == 0) {
    return '';
  }

  // 使用 Lodash 鏈式調用來生成 2 的冪次的陣列，然後轉換為字串
  return _.chain(_.range(32))
    .filter((i: number) => (num & (1 << i)) !== 0)
    .map((i: number) => 1 << i)
    .join(',') // 將結果陣列轉換為字串
    .value();
};

export const fcMoneyFormat = (value: any): string => {
  let numericValue: number;
  if (isNaN(Number(value))) {
    numericValue = 0;
  } else {
    numericValue = Number(value);
  }
  return new Intl.NumberFormat().format(numericValue);
};

export const fcMoneyDecimalFormat = (value: any): string => {
  let numericValue: number;
  if (isNaN(Number(value))) {
    numericValue = 0;
  } else {
    numericValue = Number(value);
  }
  return new Intl.NumberFormat('zh-TW', { minimumFractionDigits: 2 }).format(numericValue);
};
