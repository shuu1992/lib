import usePage from '@hooks/usePage';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import { ICompareSearchProps } from './BetList';
import BetList from './BetList';

export default function RestoreDialog({
  defaultSearchProps,
}: {
  defaultSearchProps: ICompareSearchProps;
}) {
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();

  const fcCloseDialog = () => {
    modal.close();
  };

  return (
    <CustomizedDialog
      className="xl"
      flag={!modal.closed}
      title={`${t('gameBetRc.game_no')} : ${defaultSearchProps.game_no}`}
      confirmCfg={{
        flag: false,
        txt: t('sys.confirm'),
        fcConfirm: async () => {
          return;
        },
      }}
      fcChangeDialog={fcCloseDialog}
    >
      <Grid container spacing={2} p={1} alignItems="center">
        <Grid xs={12} md={6}>
          <Stack spacing={0.5}>
            <BetList defaultSearchProps={defaultSearchProps} />
          </Stack>
        </Grid>
        <Grid xs={12} md={6}>
          <Stack spacing={0.5}>
            <BetList defaultSearchProps={{ ...defaultSearchProps, username: '' }} />
          </Stack>
        </Grid>
      </Grid>
    </CustomizedDialog>
  );
}
