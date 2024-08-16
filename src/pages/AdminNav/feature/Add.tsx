import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { TextField, InputLabel } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import { Android12Switch } from '@components/switch/CustomizedSwitches';
// api
import { apiAdd } from '@api/AdminNav';

export default function AddDialog({
  defaultData,
  fetchData,
}: {
  defaultData: { pid: number | null; id: number; pname?: string };
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
      pid: 0,
      pname: '',
      name: '',
      icon: '',
      route: '',
      url: '',
      sort: 1,
      action_log: 1,
      status: 1,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t('vt.require', { key: t('sys.name') })),
      route: Yup.string().required(t('vt.require', { key: t('adminNav.route') })),
      url: Yup.string()
        .matches(/\/[a-zA-Z0-9]/g, t('vt.url'))
        .required(t('vt.require', { key: t('adminNav.url') })),
      sort: Yup.string().required(t('vt.require', { key: t('adminNav.sort') })),
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

  useEffect(() => {
    setValues({
      ...values,
      pid: defaultData.id,
      pname: defaultData.pid === null ? t('adminNav.sysLevel') : (defaultData.pname as string),
    });
  }, [defaultData]);
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
          {/* 上層 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('adminNav.pname')}</InputLabel>
            <TextField
              name="pname"
              fullWidth
              value={values.pname}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          {/* 名稱 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('sys.name')}</InputLabel>
            <TextField
              name="name"
              placeholder={t('sys.pld', { key: t('sys.name') })}
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              variant="outlined"
              error={Boolean(errors.name)}
              helperText={errors.name ? errors.name : null}
            />
          </Grid>
          {/* 圖示 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('adminNav.icon')}</InputLabel>
            <TextField
              name="icon"
              placeholder={t('sys.pld', { key: t('adminNav.icon') })}
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.icon}
              variant="outlined"
              error={Boolean(errors.icon)}
              helperText={errors.icon ? errors.icon : null}
            />
          </Grid>
          {/* 權限代碼 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('adminNav.route')}</InputLabel>
            <TextField
              name="route"
              placeholder={t('sys.pld', { key: t('adminNav.route') })}
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.route}
              variant="outlined"
              error={Boolean(errors.route)}
              helperText={errors.route ? errors.route : null}
            />
          </Grid>
          {/* URL */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('adminNav.url')}</InputLabel>
            <TextField
              name="url"
              placeholder={t('sys.pld', { key: t('adminNav.url') })}
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.url}
              variant="outlined"
              error={Boolean(errors.url)}
              helperText={errors.url ? errors.url : null}
            />
          </Grid>
          {/* 排序 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('adminNav.sort')}</InputLabel>
            <TextField
              name="sort"
              placeholder={t('sys.pld', { key: t('adminNav.sort') })}
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.sort}
              variant="outlined"
              error={Boolean(errors.sort)}
              helperText={errors.sort ? errors.sort : null}
            />
          </Grid>
          {/* 操作日誌 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('adminNav.action_log')}</InputLabel>
            <Android12Switch
              name="action_log"
              checked={values.action_log === 1}
              onChange={(event, checked) => {
                setFieldValue('action_log', checked ? 1 : 0);
              }}
            />
          </Grid>
          {/* 狀態 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('sys.status')}</InputLabel>
            <Android12Switch
              name="status"
              checked={values.status === 1}
              onChange={(event, checked) => {
                setFieldValue('status', checked ? 1 : 0);
              }}
            />
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
