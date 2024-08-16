import { Button, Grid } from '@mui/material';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import { useTranslation } from 'react-i18next';
export default function ActionList(props: PickersActionBarProps) {
  const { t } = useTranslation();
  const { onClear, onCancel } = props;
  const actions = [
    { i18nKey: 'sys.clear', type: 'Clear', method: onClear },
    { i18nKey: 'sys.cancel', type: 'Cancel', method: onCancel },
  ];
  return (
    <Grid container p={2} spacing={2} justifyContent="right">
      {actions.map(({ i18nKey, type, method }) => (
        <Grid item key={type}>
          <Button variant="outlined" color={type === 'Clear' ? 'error' : 'info'} onClick={method}>
            {t(i18nKey)}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}
