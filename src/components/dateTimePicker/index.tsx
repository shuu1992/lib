import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CustomLayout from '@components/dateTimePicker/layout';
import ActionBar from '@components/dateTimePicker/actionbar';
export default function CustomizedDateTimePicker(props: any) {
  return (
    <DateTimePicker
      slots={{
        layout: CustomLayout,
        actionBar: ActionBar,
      }}
      dayOfWeekFormatter={(_day, weekday: any) => `${weekday.format('dd')}`}
      {...props}
    />
  );
}
