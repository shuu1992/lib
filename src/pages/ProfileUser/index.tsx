import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';
import { useSelector } from '@store/index';
import { actionLogout } from '@store/reducers/auth';
import useAuth from '@hooks/useAuth';
import usePage from '@hooks/usePage';
import { apiUpdatePassword } from '@api/Auth';
import { IUpdatePasswordReq } from '@api/Auth/req';
// material-ui
import { useTheme } from '@mui/material/styles';
// custom component
import PasswordInput from '@components/form/PasswordInput';
import AnimateButton from '@components/@extended/AnimateButton';
import MainCard from '@components/MainCard';
import Avatar from '@components/@extended/Avatar';
import avatar1 from '@assets/images/users/avatar-1.webp';
import {
  Box,
  Divider,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  Button,
} from '@mui/material';

const ProfileUser = () => {
  const theme = useTheme();
  const { global } = useSelector((state) => state);
  const { authState, authDispatch } = useAuth();
  const { user } = authState;
  const { t, fcShowMsg } = usePage();
  const formik = useFormik({
    initialValues: {
      old_password: '',
      password: '',
      confirm_password: '',
    },
    validationSchema: Yup.object().shape({
      old_password: Yup.string().required(t('vt.require', { key: t('profileUser.old_password') })),
      password: Yup.string()
        .required(t('vt.require', { key: t('profileUser.new_password') }))
        .test('password-match', t('profileUser.samePasswordError'), function () {
          return this.parent.password !== this.parent.old_password;
        }),
      confirm_password: Yup.string()
        .required(t('vt.require', { key: t('profileUser.new_password') }))
        .test('password-match', t('profileUser.confirm_passwordError'), function () {
          return this.parent.password === this.parent.confirm_password;
        }),
    }),
    validateOnChange: false,
    onSubmit: async (values: IUpdatePasswordReq, { setSubmitting }) => {
      try {
        const { code } = await apiUpdatePassword(values);
        if (code === 200) {
          fcShowMsg({ type: 'success', msg: t('profileUser.editSucMsg') });
          window.localStorage.removeItem('token');
          authDispatch(actionLogout());
        }
      } catch (error: any) {
        setSubmitting(false);
        fcShowMsg({ type: 'error', msg: error.message });
        throw error;
      }
    },
  });
  const { values, errors, setFieldValue, resetForm, handleSubmit, validateForm } = formik;

  useEffect(() => {
    if (authState.user?.backstage === 2) {
      if (authState.user?.flag !== null && (authState.user?.flag & 1) === 0) {
        fcShowMsg({ type: 'error', msg: t('sys.plzEditPwd') });
      }
    }
  }, [authState.user?.flag, location.pathname]);
  return (
    <MainCard>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <Grid item xs={12}>
            <Stack spacing={2.5} alignItems="center">
              <Avatar
                alt="Avatar 1"
                src={avatar1}
                sx={{ width: 124, height: 124, border: '1px dashed' }}
              />
              <TextField
                type="file"
                id="change-avtar"
                placeholder="Outlined"
                variant="outlined"
                sx={{ display: 'none' }}
              />
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="h5">{user?.username}</Typography>
                <Typography color="secondary">{global.sysTime}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} mt={2}>
            <Stack direction="row" justifyContent="space-around" alignItems="center">
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="h5">{user?.login_count}</Typography>
                <Typography color="secondary">{t('profileUser.login_count')}</Typography>
              </Stack>
              <Divider orientation="vertical" flexItem />
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="h5" sx={{ color: theme.palette.error.main }}>
                  {user?.role_name}
                </Typography>
                <Typography color="secondary">{t('sys.role')}</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={8}>
          <MainCard
            content={false}
            title={t('profileUser.personalInformation')}
            sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
          >
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-designation">
                      {t('profileUser.login_ip')}
                    </InputLabel>
                    <TextField
                      fullWidth
                      value={user?.login_ip}
                      name="designation"
                      placeholder={t('profileUser.login_ip')}
                      inputProps={{ readOnly: true }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-designation">
                      {t('profileUser.login_time')}
                    </InputLabel>
                    <TextField
                      fullWidth
                      value={user?.login_time}
                      name="login_time"
                      placeholder={t('profileUser.login_time')}
                      inputProps={{ readOnly: true }}
                    />
                  </Stack>
                </Grid>
                <FormikProvider value={formik}>
                  {/* 舊密碼 */}
                  <Grid item xs={12}>
                    <InputLabel className="requireClass">
                      {t('profileUser.old_password')}
                    </InputLabel>
                    <PasswordInput
                      value={values.old_password}
                      setValue={(value: string) => {
                        setFieldValue('old_password', value);
                      }}
                    />
                    {errors.password && (
                      <FormHelperText error>{errors.old_password}</FormHelperText>
                    )}
                  </Grid>
                  {/* 密碼 */}
                  <Grid item xs={12}>
                    <InputLabel className="requireClass">
                      {t('profileUser.new_password')}
                    </InputLabel>
                    <PasswordInput
                      value={values.password}
                      setValue={(value: string) => {
                        setFieldValue('password', value);
                      }}
                    />
                    {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                  </Grid>
                  {/* 確認密碼 */}
                  <Grid item xs={12}>
                    <InputLabel className="requireClass">
                      {t('profileUser.confirm_password')}
                    </InputLabel>
                    <PasswordInput
                      value={values.confirm_password}
                      setValue={(value: string) => {
                        setFieldValue('confirm_password', value);
                      }}
                    />
                    {errors.confirm_password && (
                      <FormHelperText error>{errors.confirm_password}</FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <AnimateButton>
                      <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="error"
                        onClick={() => {
                          resetForm();
                        }}
                      >
                        {t('sys.reset')}
                      </Button>
                    </AnimateButton>
                  </Grid>
                  <Grid item xs={6}>
                    <AnimateButton>
                      <Button
                        disableElevation
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={
                          !values.old_password || !values.password || !values.confirm_password
                        }
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        {t('sys.confirm')}
                      </Button>
                    </AnimateButton>
                  </Grid>
                </FormikProvider>
              </Grid>
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ProfileUser;
