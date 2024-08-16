import { useTheme } from '@mui/material/styles';
import { Dayjs } from 'dayjs';
import {
  PickersLayoutProps,
  usePickerLayout,
  pickersLayoutClasses,
  PickersLayoutRoot,
  PickersLayoutContentWrapper,
} from '@mui/x-date-pickers/PickersLayout';
import { DateView } from '@mui/x-date-pickers/models';

export default function CustomLayout(props: PickersLayoutProps<Dayjs | null, Dayjs, DateView>) {
  const theme = useTheme();
  const { toolbar, content, actionBar } = usePickerLayout(props);
  return (
    <PickersLayoutRoot
      ownerState={props}
      sx={{
        overflow: 'auto',
        [`.${pickersLayoutClasses.actionBar}`]: {
          gridColumn: 1,
          gridRow: 2,
        },
      }}
    >
      {toolbar}
      <PickersLayoutContentWrapper
        className={pickersLayoutClasses.contentWrapper}
        sx={{
          '.MuiList-root ': {
            '&::-webkit-scrollbar ': {
              width: '3px',
            },
            '&::-webkit-scrollbar-track ': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb ': {
              background: theme.palette.text.secondary,
              borderRadius: '2px',
            },
            '&::-webkit-scrollbar-thumb:hover ': {
              background: theme.palette.text.secondary,
            },
          },
        }}
      >
        {content}
        {actionBar}
      </PickersLayoutContentWrapper>
    </PickersLayoutRoot>
  );
}
