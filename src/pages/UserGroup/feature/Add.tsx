import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { InputLabel, TextField } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import SelectBase from '@components/form/BaseSelect';
import NumberTextField from '@components/form/NumberTextField';

// api
import { apiAdd } from '@api/UserGroup';

export default function AddDialog({
  defautSort,
  typeList,
  statusList,
  fetchData,
}: {
  defautSort: number;
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
      name: '',
      type: '',
      bet_min: 0,
      bet_max: 0,
      sort: 0,
      status: 0,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t('vt.require', { key: t('sys.name') })),
      type: Yup.string().required(t('vt.require', { key: t('sys.type') })),
      bet_min: Yup.number()
        .required(t('vt.require', { key: t('sys.bet_min') }))
        .min(0, t('vt.min', { num: 0 })),
      bet_max: Yup.number()
        .required(t('vt.require', { key: t('sys.bet_max') }))
        .min(
          Yup.ref('bet_min'),
          t('vt.limitMin', { key: t('sys.bet_max'), minKey: t('sys.bet_min') }),
        ),
      sort: Yup.string().required(t('vt.require', { key: t('sys.sort') })),
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

  useEffect(() => {
    setValues({
      ...values,
      sort: defautSort,
    });
  }, [modal]);

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
          {/* 名稱 */}
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
          {/* Type */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('sys.role')}</InputLabel>
            <SelectBase
              options={typeList}
              value={values.type}
              errors={errors.type}
              setValue={(value: string) => {
                setFieldValue('type', value);
              }}
            />
          </Grid>
          {/* 最小下注 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('sys.bet_min')}</InputLabel>
            <NumberTextField
              placeholder={t('sys.bet_min')}
              value={values.bet_min}
              errors={errors.bet_min}
              setValue={(value: string | number) => {
                handleChange('bet_min');
                setFieldValue('bet_min', value);
              }}
            />
          </Grid>
          {/* 最大下注 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('sys.bet_max')}</InputLabel>
            <NumberTextField
              placeholder={t('sys.bet_max')}
              value={values.bet_max}
              errors={errors.bet_max}
              setValue={(value: string | number) => {
                handleChange('bet_max');
                setFieldValue('bet_max', value);
              }}
            />
          </Grid>
          {/* 排序 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('sys.sort')}</InputLabel>
            <NumberTextField
              placeholder={t('sys.sort')}
              value={values.sort}
              errors={errors.sort}
              setValue={(value: string | number) => {
                handleChange('sort');
                setFieldValue('sort', value);
              }}
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
