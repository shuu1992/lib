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
import DateRgPicker from '@components/form/DateRangePicker';
import FileUpload from '@components/form/FileUpload';
// api
import { apiAdd } from '@api/SiteBanner';

export default function AddDialog({
  typeList,
  statusList,
  fetchData,
}: {
  typeList: TbSelectProps[];
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
      type: '',
      image: '',
      image_app: '',
      url: '',
      start_time: '',
      end_time: '',
      sort: '',
      status: '',
    },
    validateOnChange: false,

    validationSchema: Yup.object().shape({
      type: Yup.string().required(t('vt.require', { key: t('sys.type') })),
      image: Yup.string().required(t('vt.require', { key: t('siteBanner.img') })),
      image_app: Yup.string().required(t('vt.require', { key: t('siteBanner.imgApp') })),
      status: Yup.string().required(t('vt.require', { key: t('sys.status') })),
    }),
    onSubmit: async (values) => {
      try {
        const postData = {
          ...values,
          image: values.image.replace(import.meta.env.VITE_IMG_URL, ''),
          image_app: values.image_app.replace(import.meta.env.VITE_IMG_URL, ''),
        };
        const { code } = await apiAdd(postData);
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
          {/* 類型 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('sys.type')}</InputLabel>
            <SelectBase
              options={typeList}
              value={values.type}
              errors={errors.type}
              setValue={(value: string) => {
                setFieldValue('type', value);
              }}
            />
          </Grid>
          {/* 搜尋日期 */}
          <Grid xs={6} md={6}>
            <InputLabel className="requireClass">{t('siteBanner.annDate')}</InputLabel>
            <DateRgPicker
              placeholder={t('siteBanner.annDate')}
              start={values.start_time || ''}
              end={values.end_time || ''}
              startKey={'start_time'}
              endKey={'end_time'}
              errors={errors.start_time || errors.end_time}
              setValue={(key: string, value: string) => {
                setFieldValue(key, value);
              }}
            />
          </Grid>
          {/* PC Image */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">
              {t('siteBanner.img')}
              <span className="labelNotic">({t('siteBanner.imgNotice')})</span>
            </InputLabel>
            <FileUpload
              dirname="siteBanner"
              limitWidth={1200}
              limitHeight={300}
              value={values.image}
              errors={errors.image}
              setValue={(value: string) => {
                setFieldValue('image', value);
              }}
            />
          </Grid>
          {/* App Image */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">
              {t('siteBanner.imgApp')}
              <span className="labelNotic">({t('siteBanner.imgAppNotice')})</span>
            </InputLabel>
            <FileUpload
              dirname="siteBanner"
              limitWidth={856}
              limitHeight={247}
              value={values.image_app}
              errors={errors.image_app}
              setValue={(value: string) => {
                setFieldValue('image_app', value);
              }}
            />
          </Grid>
          {/* Url */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.url')}</InputLabel>
            <TextField
              name="url"
              placeholder={t('sys.url')}
              fullWidth
              onBlur={handleBlur('url')}
              onChange={handleChange('url')}
              value={values.url}
              error={Boolean(errors.url)}
              helperText={errors.url ? errors.url : null}
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
          {/* 排序 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.sort')}</InputLabel>
            <TextField
              name="sort"
              type="number"
              placeholder={t('sys.sort')}
              fullWidth
              onBlur={handleBlur('sort')}
              onChange={handleChange('sort')}
              value={values.sort}
              error={Boolean(errors.sort)}
              helperText={errors.sort ? errors.sort : null}
            />
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
