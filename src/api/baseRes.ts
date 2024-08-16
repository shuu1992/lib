export interface BaseRes<T> {
  code: number;
  data: T;
  message: string;
}
