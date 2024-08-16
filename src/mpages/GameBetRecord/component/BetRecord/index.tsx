import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { FormHelperText, TextField, InputLabel } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/MFormDialog';
import GameBetRecord from './GameBetRecord';

export default function BetDialog({ defaultSearchProps }: { defaultSearchProps: any }) {
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();

  const fcCloseDialog = () => {
    modal.close();
  };

  return (
    <CustomizedDialog
      flag={!modal.closed}
      className="xs"
      title={t('sys.betList')}
      confirmCfg={{
        flag: false,
        txt: '',
        fcConfirm: async () => {
          return;
        },
      }}
      fcChangeDialog={fcCloseDialog}
    >
      <Grid container spacing={2} p={0} alignItems="center">
        <Grid xs={12} p={0}>
          <GameBetRecord defaultSearchProps={defaultSearchProps} />
        </Grid>
      </Grid>
    </CustomizedDialog>
  );
}
