import { useEffect, useState } from 'react';
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
import { apiEdit } from '@api/AdminLanguage';
import { IResInfo } from '@api/AdminLanguage/res';

export default function EditDialog({
  infoData,
  typeList,
  translateList,
  fetchData,
}: {
  infoData: IResInfo;
  typeList: TbSelectProps[];
  translateList: TbSelectProps[];
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
      id: 0,
      keystr: '',
      type: 0,
      code_id: '',
      content: '',
      translate: 0,
    },
    validationSchema: Yup.object().shape({
      // content: Yup.string().required(t('vt.require', { key: t('adminLanguage.content') })),
    }),
    validateOnChange: false,

    onSubmit: async (values) => {
      try {
        const { code } = await apiEdit(values);
        if (code === 200) {
          await fetchData();
          await fcCloseDialog();
          await fcShowMsg({ type: 'success', msg: t('sys.editSuc') });
        }
      } catch (error: any) {
        fcShowMsg({ type: 'error', msg: error.message });
        return Promise.reject(error);
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
      id: infoData.id,
      keystr: infoData.keystr,
      type: infoData.type,
      code_id: infoData.code_id as string,
      content: infoData.content,
      translate: infoData.translate,
    });
  }, [infoData]);

  return (
    <FormikProvider value={formik}>
      <CustomizedDialog
        flag={!modal.closed}
        title={t('sys.edit')}
        confirmCfg={{
          flag: true,
          txt: t('sys.edit'),
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
              inputProps={{ readOnly: true }}
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
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 角色 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.role')}</InputLabel>
            <SelectBase
              disabled
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
            <InputLabel className="requireClass">{t('adminLanguage.content')}</InputLabel>
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
          {/* 是否翻譯 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('adminLanguage.translate')}</InputLabel>
            <SelectBase
              options={translateList}
              value={values.translate}
              errors={errors.translate}
              setValue={(value: string) => {
                setFieldValue('translate', value);
              }}
            />
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
