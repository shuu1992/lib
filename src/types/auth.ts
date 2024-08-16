// ==============================|| AUTH TYPES  ||============================== //
export type UserProfile = {
  id: number;
  flag: number | null;
  role_id: number;
  role_name: string;
  username: string;
  login_ip: string;
  login_time: string;
  login_count: number;
  status: number;
  backstage: number; // 1:總後台 2:代理後台
  money_type: number; // 1:現金 2:信用
};

export interface AuthProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null;
  token?: string | null;
}
export type JWTContextType = {
  authState: AuthProps;
  authDispatch: React.Dispatch<any>;
};
