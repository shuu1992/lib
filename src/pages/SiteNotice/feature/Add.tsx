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
import SelectBase from '@components/form/BaseSelect';
import DateTimeRangePicker from '@components/form/DateTimeRangePicker';
import SelectMultiple from '@components/form/MultipleSelect';
// api
import { apiAdd } from '@api/SiteNotice';
import { IResInfo } from '@api/SiteNotice/res';

export default function AddDialog({
  list,
  typeList,
  statusList,
  flagList,
  fetchData,
}: {
  list: IResInfo[];
  typeList: TbSelectProps[];
  flagList: TbSelectProps[];
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
      name: '',
      content: '',
      flag: '',
      start_time: '',
      end_time: '',
      sort: '',
      flag_ary: '',
      status: 1,
    },
    validationSchema: Yup.object().shape({
      type: Yup.string().required(t('vt.require', { key: t('siteNotice.type') })),
      name: Yup.string().required(t('vt.require', { key: t('sys.name') })),
      content: Yup.string().required(t('vt.require', { key: t('siteNotice.content') })),
      start_time: Yup.string().required(
        t('vt.require', { key: `${t('sys.start_time')},${t('sys.end_time')}` }),
      ),
      end_time: Yup.string().required(
        t('vt.require', { key: `${t('sys.start_time')},${t('sys.end_time')}` }),
      ),
      flag_ary: Yup.string().required(t('vt.require', { key: t('siteNotice.flag') })),
      status: Yup.string().required(t('vt.require', { key: t('sys.status') })),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const postData = {
          ...values,
          flag: values.flag_ary.split(',').reduce((acc, cur) => acc + (parseInt(cur, 10) || 0), 0),
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

  useEffect(() => {
    setValues({
      ...values,
      sort: (list.length + 1).toString(),
    });
  }, []);
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
          {/* 公告類型 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('siteNotice.type')}</InputLabel>
            <SelectBase
              options={typeList}
              value={values.type}
              errors={errors.type}
              setValue={(value: string) => {
                setFieldValue('type', value);
              }}
            />
          </Grid>
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
          {/* 公告類型開關 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('siteNotice.flag')}</InputLabel>
            <SelectMultiple
              options={flagList}
              value={values.flag_ary}
              errors={errors.flag_ary}
              setValue={(value: string) => {
                setFieldValue('flag_ary', value);
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
          {/* 搜尋日期 */}
          <Grid xs={6} md={12}>
            <InputLabel className="requireClass">{t('sys.annDate')}</InputLabel>
            <DateTimeRangePicker
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
          {/* 內文 */}
          <Grid xs={12} md={12}>
            <InputLabel className="requireClass">{t('siteNotice.content')}</InputLabel>
            <TextField
              name="content"
              placeholder={t('siteNotice.content')}
              fullWidth
              multiline
              rows={4}
              onBlur={handleBlur('content')}
              onChange={handleChange('content')}
              value={values.content}
              error={Boolean(errors.content)}
              helperText={errors.content ? errors.content : null}
            />
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
