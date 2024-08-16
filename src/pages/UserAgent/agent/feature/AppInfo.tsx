import { useEffect, useState } from 'react';
import usePage from '@hooks/usePage';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
import ToolTipCopy from '@components/ToolTip/Copy';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { TextField, InputLabel, InputAdornment, OutlinedInput } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import { CopyOutlined } from '@ant-design/icons';
// api
import { IResInfo } from '@api/UserAgent/res';

export default function InfoDialog({ infoData }: { infoData: IResInfo }) {
  const { t } = usePage();
  const modal = useModalWindow();
  const fcCloseDialog = () => {
    resetForm();
    modal.close();
  };
  const formik = useFormik({
    initialValues: {
      username: '',
      name: '',
      appkey: '',
      appsecret: '',
    },
    onSubmit: () => {
      return;
    },
  });
  const { values, resetForm, setValues } = formik;

  useEffect(() => {
    if (!infoData) return;
    setValues({
      username: infoData.username,
      name: infoData.name,
      appkey: infoData.appkey,
      appsecret: infoData.appsecret,
    });
  }, [infoData, setValues]);

  return (
    <FormikProvider value={formik}>
      <CustomizedDialog
        flag={!modal.closed}
        title={t('userAgent.app')}
        confirmCfg={{
          flag: false,
          txt: t('sys.edit'),
          fcConfirm: async () => {
            return;
          },
        }}
        fcChangeDialog={fcCloseDialog}
      >
        <Grid container spacing={2} p={1} alignItems="center">
          {/* 帳號 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.username')}</InputLabel>
            <TextField
              name="username"
              placeholder={t('sys.username')}
              fullWidth
              value={values.username}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 真實姓名 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.name')}</InputLabel>
            <TextField
              name="name"
              placeholder={t('sys.name')}
              fullWidth
              value={values.name}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* appKey */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('userAgent.appkey')}</InputLabel>
            <ToolTipCopy text={values.appkey}>
              <OutlinedInput
                name="appkey"
                value={values.appkey}
                sx={{
                  '&.MuiOutlinedInput-root,input': {
                    cursor: 'copy',
                  },
                }}
                placeholder={t('userAgent.appkey')}
                fullWidth
                inputProps={{ readOnly: true }}
                endAdornment={
                  <InputAdornment position="end">
                    <CopyOutlined />
                  </InputAdornment>
                }
              />
            </ToolTipCopy>
          </Grid>

          {/* appSecret */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('userAgent.appsecret')}</InputLabel>
            <ToolTipCopy text={values.appsecret}>
              <OutlinedInput
                name="appsecret"
                value={values.appsecret}
                sx={{
                  '&.MuiOutlinedInput-root,input': {
                    cursor: 'copy',
                  },
                }}
                placeholder={t('userAgent.appsecret')}
                fullWidth
                inputProps={{ readOnly: true }}
                endAdornment={
                  <InputAdornment position="end">
                    <CopyOutlined />
                  </InputAdornment>
                }
              />
            </ToolTipCopy>
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
