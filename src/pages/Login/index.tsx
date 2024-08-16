import { useEffect, useState } from 'react';
import { apiLogin, apiLanguage } from '@api/Auth';
import { TbSelectProps } from '@type/page';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
// third party
import { useFormik, FormikProvider } from 'formik';
import { useTheme } from '@mui/material/styles';
// project import
import IconButton from '@components/@extended/IconButton';
import AnimateButton from '@components/@extended/AnimateButton';
import LoadingButton from '@components/@extended/LoadingButton';
import i18n, { resources } from '@i18n/index';
import SelectBase from '@components/form/BaseSelect';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import useAuth from '@hooks/useAuth';
import { actionLogin, actionLogout } from '@store/reducers/auth';
import { actionInitial } from '@store/reducers/menu';
import { dispatch } from '@src/store/index';
// ============================|| JWT - LOGIN ||============================ //
import Turnstile, { useTurnstile } from 'react-turnstile';
const cfKey = import.meta.env.VITE_CF_KEY;
// cloudflare key
const AuthLogin = () => {
  const { t, fcShowMsg } = usePage();
  const theme = useTheme();
  const { authDispatch } = useAuth();
  const turnstile = useTurnstile();
  const [showPassword, setShowPassword] = useState(false);
  const [langOptions, setLangOptions] = useState<TbSelectProps[]>([]);
  //取的後端api語系
  const fcLanguage = async () => {
    try {
      const { data } = await apiLanguage();
      fcI18nCheckLang(data);
    } catch (error: any) {
      throw error;
    }
  };
  // 檢查後端api語系與前端語系是否匹配
  const fcI18nCheckLang = (data: any) => {
    const options: TbSelectProps[] = [];
    Object.keys(resources).forEach((i18nItem) => {
      Object.keys(data).forEach((backendItem) => {
        if (i18nItem === backendItem) {
          options.push({ text: data[backendItem], value: backendItem });
        }
      });
    });
    setLangOptions(options);
  };
  //更改cloudflare語系
  const fcCloudFlareCheckLang = () => {
    const supportedLanguages: Record<string, string> = {
      //key=i18n lang, value cloudflare lang
      zh_TW: 'zh-tw',
      zh_CN: 'zh-cn',
      en: 'en',
      vi: 'en',
    };
    return supportedLanguages[i18n.language] || 'zh-tw';
  };
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      cftoken: '',
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required(t('vt.require', { key: t('sys.username') })),
      password: Yup.string().required(t('vt.require', { key: t('sys.password') })),
    }),
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { code, data } = await apiLogin(values);
        if (code === 200) {
          authDispatch(
            actionLogin({
              token: data.token,
              user: {
                role_id: data.role_id,
                username: data.username,
                created_at: data.created_at,
                login_ip: data.login_ip,
                login_time: data.login_time,
              },
            }),
          );
        } else {
          turnstile.reset();
        }
      } catch (error: any) {
        const { message } = error;
        setSubmitting(false);
        fcShowMsg({ type: 'error', msg: message });
        authDispatch(actionLogout());
        dispatch(actionInitial());
        turnstile.reset();
        throw error;
      }
    },
  });
  const { setValues, values, errors } = formik;
  // 初始化
  useEffect(() => {
    fcLanguage();
  }, []);
  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* 登入標題 */}
          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
              sx={{ mb: { xs: -0.5, sm: 0.5 } }}
            >
              <Typography variant="h3">{t('login.login')}</Typography>
            </Stack>
          </Grid>
          {/* account */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel>{t('login.account')}</InputLabel>
              <OutlinedInput
                type="account"
                name="username"
                placeholder={t('login.plzInputAccount')}
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.username}
                error={Boolean(errors.username)}
              />
            </Stack>
          </Grid>
          {formik.errors.username && (
            <Grid item xs={12} mt={-2}>
              <FormHelperText error>{formik.errors.username}</FormHelperText>
            </Grid>
          )}
          {/* Password */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="password-login">{t('login.password')}</InputLabel>
              <OutlinedInput
                fullWidth
                type={showPassword ? 'text' : 'password'}
                name="password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      edge="end"
                      color="secondary"
                    >
                      {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </IconButton>
                  </InputAdornment>
                }
                placeholder={t('login.plzInputPassword')}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                error={Boolean(errors.password)}
              />
            </Stack>
          </Grid>
          {formik.errors.password && (
            <Grid item xs={12} mt={-2}>
              <FormHelperText error>{formik.errors.password}</FormHelperText>
            </Grid>
          )}
          {/* 語系 */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel>{t('login.lang')}</InputLabel>
              <SelectBase
                options={langOptions}
                value={i18n.language}
                setValue={(value: string) => {
                  i18n.changeLanguage(value);
                  window.localStorage.setItem('lang', value);
                }}
              />
            </Stack>
          </Grid>
          {/*cloudflare  */}
          {langOptions.length > 0 && (
            <Grid item xs={12}>
              <Turnstile
                sitekey={cfKey}
                theme={theme.palette.mode === 'dark' ? 'dark' : 'light'}
                language={fcCloudFlareCheckLang()}
                onVerify={(token, bound) => {
                  if (token === '') {
                    bound.reset();
                    return;
                  }
                  setValues({
                    ...values,
                    cftoken: token,
                  });
                }}
                onError={() => turnstile.reset()}
              />
            </Grid>
          )}
          {/* Submit */}
          <Grid item xs={12}>
            <AnimateButton>
              <LoadingButton
                loading={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                disabled={!values.cftoken || !values.password || !values.username}
              >
                {t('login.login')}
              </LoadingButton>
            </AnimateButton>
          </Grid>
        </Grid>
      </form>
    </FormikProvider>
  );
};

export default AuthLogin;
