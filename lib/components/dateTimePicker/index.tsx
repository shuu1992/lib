import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CustomLayout from './layout';
import ActionBar from './actionbar';
import { ThemeProvider, useTheme } from '@mui/material/styles';

export default function CustomizedDateTimePicker(props: any) {
  const theme = useTheme();
  console.error(theme);
  return (
    <ThemeProvider theme={theme}>
      <DateTimePicker
        slots={{
          layout: CustomLayout,
          actionBar: ActionBar,
        }}
        dayOfWeekFormatter={(_day, weekday: any) => `${weekday.format('dd')}`}
        {...props}
      />
    </ThemeProvider>
  );
}
