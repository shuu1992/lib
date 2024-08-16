import { useEffect } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { TextField, InputLabel } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import { Android12Switch } from '@components/switch/CustomizedSwitches';
import SelectBase from '@components/form/BaseSelect';
// api
import { apiAdd } from '@api/SiteConfig';

export default function AddDialog({
  groupList,
  typeList,
  dataList,
  fetchData,
}: {
  groupList: TbSelectProps[];
  typeList: TbSelectProps[];
  dataList: any[];
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
      groupid: '',
      type: '',
      skey: '',
      svalue: '',
      info: '',
      sort: '',
    },
    validationSchema: Yup.object().shape({
      groupid: Yup.string().required(t('vt.require', { key: t('siteConfig.groupid') })),
      type: Yup.string().required(t('vt.require', { key: t('sys.type') })),
      skey: Yup.string().required(t('vt.require', { key: t('siteConfig.skey') })),
      svalue: Yup.string().required(t('vt.require', { key: t('siteConfig.svalue') })),
      info: Yup.string().required(t('vt.require', { key: t('siteConfig.info') })),
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
  } = formik;

  useEffect(() => {
    if (values.groupid == '') return;
    const list = dataList.filter((item) => item.groupid == values.groupid);
    setValues({
      ...values,
      sort: (list.length + 1).toString(),
    });
  }, [values.groupid]);

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
          {/* 參數群組 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('siteConfig.groupid')}</InputLabel>
            <SelectBase
              options={groupList}
              value={values.groupid}
              errors={errors.groupid}
              setValue={(value: string) => {
                setFieldValue('groupid', value);
              }}
            />
          </Grid>
          {/* 參數名稱 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('siteConfig.skey')}</InputLabel>
            <TextField
              name="skey"
              placeholder={t('siteConfig.skey')}
              fullWidth
              onBlur={handleBlur('skey')}
              onChange={handleChange('skey')}
              value={values.skey}
              error={Boolean(errors.skey)}
              helperText={errors.skey ? errors.skey : null}
            />
          </Grid>
          {/* type */}
          <Grid xs={12} md={12}>
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
          {/* 參數值 */}
          <Grid xs={12} md={12}>
            <InputLabel className="requireClass">{t('siteConfig.svalue')}</InputLabel>
            {(values.type == '' || values.type == '1') && (
              <TextField
                name="svalue"
                placeholder={t('siteConfig.svalue')}
                fullWidth
                onBlur={handleBlur('svalue')}
                onChange={handleChange('svalue')}
                value={values.svalue}
                error={Boolean(errors.svalue)}
                helperText={errors.svalue ? errors.svalue : null}
              />
            )}
            {values.type == '2' && (
              <TextField
                name="svalue"
                type="number"
                placeholder={t('siteConfig.svalue')}
                fullWidth
                onBlur={handleBlur('svalue')}
                onChange={handleChange('svalue')}
                value={values.svalue}
                error={Boolean(errors.svalue)}
                helperText={errors.svalue ? errors.svalue : null}
              />
            )}
            {values.type == '3' && (
              <TextField
                name="svalue"
                placeholder={t('siteConfig.svalue')}
                fullWidth
                multiline
                rows={4}
                onBlur={handleBlur('svalue')}
                onChange={handleChange('svalue')}
                value={values.svalue}
                error={Boolean(errors.svalue)}
                helperText={errors.svalue ? errors.svalue : null}
              />
            )}
            {values.type == '4' && (
              <Android12Switch
                name="svalue"
                checked={Boolean(values.svalue) === true}
                onChange={(event, checked) => {
                  setFieldValue('svalue', checked ? 'Y' : 'N');
                }}
              />
            )}
          </Grid>
          {/* 參數說明 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('siteConfig.info')}</InputLabel>
            <TextField
              name="info"
              placeholder={t('siteConfig.info')}
              fullWidth
              onBlur={handleBlur('info')}
              onChange={handleChange('info')}
              value={values.info}
              error={Boolean(errors.info)}
              helperText={errors.info ? errors.info : null}
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
