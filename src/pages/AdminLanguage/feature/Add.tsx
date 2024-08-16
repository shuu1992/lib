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
import SelectBase from '@components/form/BaseSelect';
// api
import { apiAdd } from '@api/AdminLanguage';

export default function AddDialog({
  typeList,
  translateList,
  fetchData,
}: {
  typeList: TbSelectProps[];
  translateList: TbSelectProps[];
  fetchData: () => Promise<void>;
}) {
  const modal = useModalWindow();
  const { t, fcShowMsg } = usePage();
  const fcCloseDialog = () => {
    resetForm();
    modal.close();
  };
  const formik = useFormik({
    initialValues: {
      keystr: '',
      type: '',
      code_id: '',
      content: '',
    },
    validationSchema: Yup.object().shape({
      keystr: Yup.string().required(t('vt.require', { key: t('adminLanguage.keystr') })),
      type: Yup.string().required(t('vt.require', { key: t('sys.type') })),
      code_id: Yup.string().required(t('vt.require', { key: t('adminLanguage.code_id') })),
      // content: Yup.string().required(t('vt.require', { key: t('adminLanguage.content') })),
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
          {/*keystr*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('adminLanguage.keystr')}</InputLabel>
            <TextField
              name="keystr"
              placeholder={t('adminLanguage.keystr')}
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.keystr}
              variant="outlined"
              error={Boolean(errors.keystr)}
              helperText={errors.keystr ? errors.keystr : null}
            />
          </Grid>
          {/*CodeId*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('adminLanguage.code_id')}</InputLabel>
            <TextField
              name="code_id"
              type="number"
              placeholder={t('adminLanguage.code_id')}
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.code_id}
              variant="outlined"
              error={Boolean(errors.code_id)}
              helperText={errors.code_id ? errors.code_id : null}
            />
          </Grid>
          {/* 角色 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.role')}</InputLabel>
            <SelectBase
              options={typeList}
              value={values.type}
              errors={errors.type}
              setValue={(value: string) => {
                setFieldValue('type', value);
              }}
            />
          </Grid>
          {/*content */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('adminLanguage.content')}</InputLabel>
            <TextField
              name="content"
              placeholder={t('adminLanguage.content')}
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.content}
              variant="outlined"
              error={Boolean(errors.content)}
              helperText={errors.content ? errors.content : null}
            />
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
