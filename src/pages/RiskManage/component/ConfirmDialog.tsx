import usePage from '@hooks/usePage';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';

export default function ConfirmDialog({ handleSubmit }: { handleSubmit: () => Promise<void> }) {
  const { t } = usePage();
  const modal = useModalWindow();

  const fcCloseDialog = () => {
    modal.close();
  };
  const fcSubmit = async () => {
    modal.close();
    handleSubmit();
  };
  return (
    <CustomizedDialog
      className="xs"
      flag={!modal.closed}
      title={t('sys.notice')}
      confirmCfg={{
        flag: true,
        txt: t('riskManage.confirmTitle'),
        fcConfirm: async () => {
          fcSubmit();
          return Promise.resolve();
        },
      }}
      fcChangeDialog={fcCloseDialog}
    >
      <Grid container spacing={2} p={1} alignItems="center">
        <Grid xs={12} md={6}>
          <Stack spacing={0.5}>
            <p>{t('riskManage.confirmText')}</p>
          </Stack>
        </Grid>
      </Grid>
    </CustomizedDialog>
  );
}
