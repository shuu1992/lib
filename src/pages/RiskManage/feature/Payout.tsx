import { useState, useEffect } from 'react';
import usePage from '@hooks/usePage';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
// api
import { apiPayout } from '@api/RiskManage';

export default function PayoutDialog({
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
      const { code } = await apiPayout({ id: id });
      if (code === 200) {
        await fetchData();
        await fcCloseDialog();
        await fcShowMsg({ type: 'success', msg: t('gameBetRc.payoutSuc') });
      }
    } catch (error: any) {
      fcShowMsg({ type: 'error', msg: error.message });
      return Promise.reject(error);
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
            <p>{t('riskManage.payoutMsg')}</p>
          </Stack>
        </Grid>
      </Grid>
    </CustomizedDialog>
  );
}
