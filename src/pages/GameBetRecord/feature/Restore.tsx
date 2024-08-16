import usePage from '@hooks/usePage';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
// api
import { apiRestore } from '@api/GameBetRecord';

export default function RestoreDialog({
  id,
  fetchData,
}: {
  id: number;
  fetchData: () => Promise<void>;
}) {
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();

  const fcCloseDialog = () => {
    modal.close();
  };

  const fcSubmit = async () => {
    try {
      const { code } = await apiRestore({ id });
      if (code === 200) {
        await fetchData();
        await fcCloseDialog();
        await fcShowMsg({ type: 'success', msg: t('gameBetRc.restoreSuc') });
      }
    } catch (error: any) {
      fcShowMsg({ type: 'error', msg: error.message });
      throw error;
    }
  };
  return (
    <CustomizedDialog
      className="xs"
      flag={!modal.closed}
      title={t('sys.notice')}
      confirmCfg={{
        flag: true,
        txt: t('sys.confirm'),
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
            <p>{t('gameBetRc.restoreMsg')}</p>
          </Stack>
        </Grid>
      </Grid>
    </CustomizedDialog>
  );
}
