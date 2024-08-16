import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { FormHelperText, TextField, InputLabel } from '@mui/material';
// custom Components
import { useModalWindow } from 'react-modal-global';
import CustomizedDialog from '@components/dialog/FormDialog';
import PasswordInput from '@components/form/PasswordInput';
import SelectBase from '@components/form/BaseSelect';
// api
import { apiAdd } from '@api/AdminUser';

export default function AddDialog({
  roleList,
  statusList,
  fetchData,
}: {
  roleList: TbSelectProps[];
  statusList: TbSelectProps[];
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
      username: '',
      password: '',
      role_id: '',
      status: 1,
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required(t('vt.require', { key: t('sys.username') })),
      role_id: Yup.string().required(t('vt.require', { key: t('sys.role') })),
      status: Yup.string().required(t('vt.require', { key: t('sys.status') })),
    }),
    validateOnChange: false,

    onSubmit: async (values) => {
      try {
        const { code } = await apiAdd(values);
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
        title={t('sys.add')}
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
          {/* 帳號 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.username')}</InputLabel>
            <TextField
              name="username"
              placeholder={t('sys.username')}
              fullWidth
              onBlur={handleBlur('username')}
              onChange={handleChange('username')}
              value={values.username}
              error={Boolean(errors.username)}
              helperText={errors.username ? errors.username : null}
            />
          </Grid>
          {/* 密碼 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.password')}</InputLabel>
            <PasswordInput
              value={values.password}
              setValue={(value: string) => {
                setFieldValue('password', value);
              }}
            />
            {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
          </Grid>
          {/* 角色 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.role')}</InputLabel>
            <SelectBase
              options={roleList}
              value={values.role_id}
              errors={errors.role_id}
              setValue={(value: string) => {
                setFieldValue('role_id', value);
              }}
            />
          </Grid>
          {/* 狀態 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.status')}</InputLabel>
            <SelectBase
              options={statusList}
              value={values.status}
              errors={errors.status}
              setValue={(value: string) => {
                setFieldValue('status', value);
              }}
            />
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
