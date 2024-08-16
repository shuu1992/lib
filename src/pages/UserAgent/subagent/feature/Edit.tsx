import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import useAuth from '@hooks/useAuth';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { FormHelperText, TextField, InputLabel } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import PasswordInput from '@components/form/PasswordInput';
import SelectBase from '@components/form/BaseSelect';
import IpLimit from '@components/form/IpLimit';
// api
import { apiEdit } from '@src/api/UserAgent';
import { IResInfo } from '@api/UserAgent/res';

export default function EditDialog({
  parentData,
  infoData,
  groupList,
  moneyTypeList,
  typeList,
  statusList,
  fetchData,
}: {
  parentData: IResInfo;
  infoData: IResInfo;
  groupList: TbSelectProps[];
  moneyTypeList: TbSelectProps[];
  typeList: TbSelectProps[];
  statusList: TbSelectProps[];
  fetchData: () => Promise<void>;
}) {
  const { t, fcShowMsg } = usePage();
  const { authState } = useAuth();
  const modal = useModalWindow();
  const [groupOptions, setGroupOptions] = useState<TbSelectProps[]>([]);
  const fcCloseDialog = () => {
    resetForm();
    modal.close();
  };
  const formik = useFormik({
    initialValues: {
      id: '',
      username: '',
      password: '',
      name: '',
      status: 0,
      check_pwd: '',
      ip_limit: '',
      //不可編輯
      login_ip: '',
      login_time: '',
      updated_at: '',
      updated_by: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t('vt.require', { key: t('sys.name') })),
      status: Yup.string().required(t('vt.require', { key: t('sys.status') })),
      check_pwd: Yup.string().required(t('vt.require', { key: t('sys.adminPwd') })),
    }),
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        const postData = {
          id: values.id,
          username: values.username,
          password: values.password,
          name: values.name,
          status: values.status,
          check_pwd: values.check_pwd,
          ip_limit: values.ip_limit,
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
      id: infoData.id as string,
      username: infoData.username,
      name: infoData.name,
      status: infoData.status,
      ip_limit: infoData.ip_limit,
      //不可編輯
      login_ip: infoData.login_ip || '-',
      login_time: infoData.login_time,
      updated_at: infoData.updated_at,
      updated_by: infoData.updated_by,
    });
  }, [modal.closed]);

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
          {/* 帳號 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.username')}</InputLabel>
            <TextField
              name="username"
              placeholder={t('sys.username')}
              fullWidth
              value={values.username}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 密碼 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.password')}</InputLabel>
            <PasswordInput
              value={values.password}
              setValue={(value: string) => {
                setFieldValue('password', value);
              }}
            />
            {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
          </Grid>
          {/* 真實姓名 */}
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
          {/* IP 限制 */}
          <Grid xs={12}>
            <InputLabel>{t('userAgent.ip_limit')}</InputLabel>
            <IpLimit
              value={values.ip_limit}
              setValue={(value: string) => {
                setFieldValue('ip_limit', value);
              }}
            />
          </Grid>
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
          {/* 更新者 */}
          <Grid xs={12} md={6}>
            <InputLabel>
              {t('sys.updated_at')} / {t('sys.updated_by')}
            </InputLabel>
            <TextField
              fullWidth
              value={`${values.updated_at}   /   ${values.updated_by}`}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 登入 */}
          <Grid xs={12} md={6}>
            <InputLabel>
              {t('sys.login_ip')} / {t('sys.login_time')}
            </InputLabel>
            <TextField
              fullWidth
              value={`${values.login_ip}  /   ${values.login_time}`}
              inputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
