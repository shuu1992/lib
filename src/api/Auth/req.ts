export interface ILoginReq {
  username: string;
  password: string;
  cftoken: string;
}

export interface IUpdatePasswordReq {
  old_password: string;
  password: string;
  confirm_password: string;
}
