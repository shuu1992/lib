import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { FormHelperText, TextField, InputLabel } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import { IRiskHedgingRcSearchProps } from './RiskHedging';
import RiskHedging from './RiskHedging';

export default function BetDialog({
  defaultSearchProps,
}: {
  defaultSearchProps: IRiskHedgingRcSearchProps;
}) {
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();

  const fcCloseDialog = () => {
    modal.close();
  };

  return (
    <CustomizedDialog
      flag={!modal.closed}
      className={'lg'}
      title={t('menu.riskHedging')}
      confirmCfg={{
        flag: false,
        txt: '',
        fcConfirm: async () => {
          return;
        },
      }}
      fcChangeDialog={fcCloseDialog}
    >
      <RiskHedging defaultSearchProps={defaultSearchProps} />
    </CustomizedDialog>
  );
}
