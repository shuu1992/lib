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
import SelectBase from '@components/form/BaseSelect';
// api
import { apiEdit } from '@api/GameManage';
import { IResInfo } from '@api/GameManage/res';

export default function EditDialog({
  infoData,
  statusList,
  fetchData,
}: {
  infoData: IResInfo;
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
      id: 0,
      name: '',
      sort: 0,
      status: 1,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t('vt.require', { key: t('sys.name') })),
      sort: Yup.string().required(t('vt.require', { key: t('sys.sort') })),
      status: Yup.string().required(t('vt.require', { key: t('sys.status') })),
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
  } = formik;
  useEffect(() => {
    setValues({
      ...values,
      id: infoData.id,
      name: infoData.name,
      sort: infoData.sort,
      status: infoData.status,
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
          {/* 遊戲名稱 */}
          <Grid xs={12} md={6}>
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
          {/* Sort */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.sort')}</InputLabel>
            <TextField
              name="sort"
              placeholder={t('sys.sort')}
              fullWidth
              onBlur={handleBlur('sort')}
              onChange={handleChange('sort')}
              value={values.sort}
              error={Boolean(errors.sort)}
              helperText={errors.sort ? errors.sort : null}
            />
          </Grid>
          {/* 狀態 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('sys.status')}</InputLabel>
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
