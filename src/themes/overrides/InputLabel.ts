// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - INPUT LABEL ||============================== //

export default function InputLabel(theme: Theme) {
  return {
    MuiInputLabel: {
      defaultProps: {
        sx: {
          top: '-0.5rem',
          lineHeight: 'inherit',
        },
      },
      styleOverrides: {
        root: {
          color: theme.palette.grey[600],
          '&.MuiInputLabel-root, label': {
            fontSize: '1rem',
          },
        },
        outlined: {
          lineHeight: '0.8em',

          '&.MuiInputLabel-sizeSmall': {
            lineHeight: '1em',
          },
          '&.MuiInputLabel-shrink': {
            background: theme.palette.background.paper,
            padding: '0 8px',
            marginLeft: -6,
            lineHeight: '1.4375em',
          },
        },
      },
    },
  };
}
