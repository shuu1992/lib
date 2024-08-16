import { Theme } from '@mui/material/styles';
export const getLangColor = (theme: Theme, value: string) => {
  switch (value) {
    case 'zh_TW':
      return theme.palette.primary.main;
    case 'vi':
      return theme.palette.success.main;
    default:
      return theme.palette.primary.main;
  }
};

export const getValueColor = (theme: Theme, value?: number) => {
  switch (value) {
    case 1:
      return 'success';
    case 2:
      return 'error';
    case 3:
      return 'warning';
    default:
      return 'primary';
  }
};

export const getStyleColor = (theme: Theme, value: number) => {
  switch (value) {
    case 1:
      return theme.palette.primary.main;
    case 2:
      return theme.palette.success.main;
    case 3:
      return theme.palette.warning.main;
    default:
      return theme.palette.primary.main;
  }
};

export const getWinLostColor = (theme: Theme, value: number) => {
  switch (value) {
    case 0:
      return theme.palette.error.main;
    case 1:
      return theme.palette.success.main;
    case 2:
      return theme.palette.warning.main;
    default:
      return theme.palette.primary.main;
  }
};
