import React, { FC } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

interface MyButtonProps extends ButtonProps {
  color?:
    | 'primary'
    | 'secondary'
    | 'inherit'
    | 'default'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
}

const MyButton: FC<MyButtonProps> = (props) => {
  const { color = 'primary', ...rest } = props;
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      color={color}
      style={{
        backgroundColor: theme.palette[color].main,
        color: theme.palette[color].contrastText,
      }}
      {...rest}
    >
      {props.children}
    </Button>
  );
};

export default MyButton;
