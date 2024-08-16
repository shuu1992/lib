import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { IResInfo } from '@api/UserAgent/res';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { FormHelperText, TextField, InputLabel } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import PasswordInput from '@components/form/PasswordInput';
import IpLimit from '@components/form/IpLimit';
// api
import { apiAdd } from '@src/api/UserAgent';

export default function SubAccAddDialog({
  parentData,
  fetchData,
}: {
  parentData: { pid: string };
  fetchData: () => Promise<void>;
}) {
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();
  const [groupOptions, setGroupOptions] = useState<TbSelectProps[]>([]);
  const fcCloseDialog = () => {
    resetForm();
    modal.close();
  };

  const formik = useFormik({
    initialValues: {
      pid: '',
      username: '',
      password: '',
      name: '',
      type: 1,
      status: 1,
      sub: 1,
      check_pwd: '',
      ip_limit: '',
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required(t('vt.require', { key: t('sys.username') })),
      password: Yup.string().required(t('vt.require', { key: t('sys.password') })),
      name: Yup.string().required(t('vt.require', { key: t('sys.name') })),
      check_pwd: Yup.string().required(t('vt.require', { key: t('sys.adminPwd') })),
    }),
    validateOnChange: true,
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

  useEffect(() => {
    setValues({
      ...values,
      pid: parentData.pid,
    });
  }, [modal.closed]);

  return (
    <FormikProvider value={formik}>
      <CustomizedDialog
        flag={!modal.closed}
        title={`${t('sys.add')}-${t('sys.subacc')}`}
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
          <Grid xs={12}>
            <InputLabel className="requireClass">{t('sys.username')}</InputLabel>
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
          <Grid xs={12}>
            <InputLabel className="requireClass">{t('sys.password')}</InputLabel>
            <PasswordInput
              value={values.password}
              setValue={(value: string) => {
                setFieldValue('password', value);
              }}
            />
            {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
          </Grid>
          {/* 真實姓名 */}
          <Grid xs={12}>
            <InputLabel className="requireClass">{t('sys.name')}</InputLabel>
            <TextField
              name="name"
              placeholder={t('sys.name')}
              fullWidth
              onBlur={handleBlur('name')}
              onChange={handleChange('name')}
              value={values.name}
              error={Boolean(errors.name)}
              helperText={errors.name ? errors.name : null}
            />
          </Grid>
          {/* IP 限制 */}
          <Grid xs={12}>
            <InputLabel>{t('userAgent.ip_limit')}</InputLabel>
            <IpLimit
              value={values.ip_limit}
              setValue={(value: string) => {
                setFieldValue('ip_limit', value);
              }}
            />
          </Grid>
          {/* 後台密碼 */}
          <Grid xs={12}>
            <InputLabel>{t('sys.adminPwd')}</InputLabel>
            <PasswordInput
              value={values.check_pwd}
              setValue={(value: string) => {
                setFieldValue('check_pwd', value);
              }}
            />
            {errors.check_pwd && <FormHelperText error>{errors.check_pwd}</FormHelperText>}
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
