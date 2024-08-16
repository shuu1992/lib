import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { FormHelperText, InputLabel } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import PasswordInput from '@components/form/PasswordInput';
// api
import { apiEdit } from '@api/RiskManage';
import { IResInfo } from '@api/RiskManage/res';

import dayjs from 'dayjs';
const STOP_BETTING = 1;
export default function EditStatus({
  infoData,
  fetchData,
}: {
  infoData: IResInfo;
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
      check_pwd: '',
    },
    validationSchema: Yup.object().shape({
      check_pwd: Yup.string().required(t('vt.require', { key: t('sys.adminPwd') })),
    }),
    validateOnChange: true,
    onSubmit: async (values) => {
      //修改狀態為停止下注, 並且結束時間為當下時間
      try {
        const postData = {
          id: infoData.id,
          status: STOP_BETTING,
          check_pwd: values.check_pwd,
          end_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
        const { code } = await apiEdit(postData);
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
  const { values, errors, handleSubmit, validateForm, setFieldValue, resetForm } = formik;

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
          {/* 後台密碼 */}
          <Grid xs={12}>
            <InputLabel>{t('sys.adminPwd')}</InputLabel>
            <PasswordInput
              value={values.check_pwd}
              setValue={(value: string) => {
                setFieldValue('check_pwd', value);
              }}
            />
            {errors.check_pwd && <FormHelperText error>{errors.check_pwd}</FormHelperText>}
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
