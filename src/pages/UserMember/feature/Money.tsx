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
import CustomizedDialog from '@components/dialog/FormDialog';
import NumberTextField from '@components/form/NumberTextField';
import PasswordInput from '@components/form/PasswordInput';
// api
import { apiStorageMoeny } from '@api/UserMember';

export default function MoneyDialog({
  id,
  fetchData,
}: {
  id: number | string;
  fetchData: () => Promise<void>;
}) {
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();

  const fcCloseDialog = () => {
    resetForm();
    modal.close();
  };

  const formik = useFormik({
    initialValues: {
      id: id,
      money: 0,
      password: '',
      description: '',
    },
    validationSchema: Yup.object().shape({
      money: Yup.number().required(t('vt.require', { key: t('sys.credit') })),
      password: Yup.string().required(t('vt.require', { key: t('sys.password') })),
    }),
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        const { code } = await apiStorageMoeny(values);
        if (code === 200) {
          await fetchData();
          await fcCloseDialog();
          await fcShowMsg({ type: 'success', msg: t('sys.addSuc') });
        }
      } catch (error: any) {
        fcShowMsg({ type: 'error', msg: error.message });
        throw error;
      }
    },
  });

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    validateForm,
    setFieldValue,
    resetForm,
    setValues,
    setErrors,
  } = formik;

  return (
    <FormikProvider value={formik}>
      <CustomizedDialog
        flag={!modal.closed}
        title={t('sys.storage')}
        confirmCfg={{
          flag: true,
          txt: t('sys.add'),
          fcConfirm: async () => {
            const valRes = await validateForm();
            if (Object.keys(valRes).length > 0) return Promise.reject();
            handleSubmit();
            return Promise.resolve();
          },
        }}
        fcChangeDialog={fcCloseDialog}
      >
        <Grid container spacing={2} p={1} alignItems="center">
          {/* 點數 */}
          <Grid xs={12}>
            <InputLabel className="requireClass">{t('sys.credit')}</InputLabel>
            <NumberTextField
              placeholder={t('sys.credit')}
              value={values.money}
              errors={errors.money}
              setValue={(value: string | number) => {
                handleChange('money');
                setFieldValue('money', value);
              }}
            />
          </Grid>
          {/* 密碼 */}
          <Grid xs={12} md={12}>
            <InputLabel className="requireClass">{t('sys.password')}</InputLabel>
            <PasswordInput
              value={values.password}
              setValue={(value: string) => {
                setFieldValue('password', value);
              }}
            />
            {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
          </Grid>
          {/* 描述 */}
          <Grid xs={12}>
            <InputLabel>{t('sys.description')}</InputLabel>
            <TextField
              name="description"
              placeholder={t('sys.description')}
              fullWidth
              multiline
              rows={4}
              onBlur={handleBlur('description')}
              onChange={handleChange('description')}
              value={values.description}
              error={Boolean(errors.description)}
              helperText={errors.description ? errors.description : null}
            />
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
