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
// api
import { apiAdd } from '@api/RechargeDepRec';

export default function AddDialog({ fetchData }: { fetchData: () => Promise<void> }) {
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();

  const fcCloseDialog = () => {
    resetForm();
    modal.close();
  };

  const formik = useFormik({
    initialValues: {},
    validationSchema: Yup.object().shape({}),
    validateOnChange: false,

    onSubmit: async (values) => {
      try {
        // const { code } = await apiAdd(values);
        // if (code === 200) {
        //   await fetchData();
        //   await fcCloseDialog();
        //   await fcShowMsg({ type: 'success', msg: t('sys.addSuc') });
        // }
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
          {/* 狀態 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.status')}</InputLabel>
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
