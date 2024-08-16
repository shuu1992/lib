import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/MFormDialog';
import UserAgnetPage from '@mpages/UserAgent/component/index';
import { IComAgnetSearchProps } from '@mpages/UserAgent/component/index';

export default function AgentDetailDialog({
  defaultSearchProps,
}: {
  defaultSearchProps: IComAgnetSearchProps;
}) {
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();

  const fcCloseDialog = () => {
    resetForm();
    modal.close();
  };

  const formik = useFormik({
    initialValues: {},
    validationSchema: {},
    validateOnChange: true,
    onSubmit: async (values) => {
      return;
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
        className="xl"
        title={t('userMember.agentDetail')}
        confirmCfg={{
          flag: false,
          txt: t('sys.add'),
          fcConfirm: async () => {
            return;
          },
        }}
        fcChangeDialog={fcCloseDialog}
      >
        <Grid container alignItems="center">
          <Grid xs={12}>
            <Stack>
              <UserAgnetPage defaultSearchProps={defaultSearchProps} />
            </Stack>
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
