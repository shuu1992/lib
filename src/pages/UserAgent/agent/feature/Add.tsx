import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps } from '@type/page';
import { IResInfo } from '@api/UserAgent/res';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
import { v4 as uuid4 } from 'uuid';

// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { FormHelperText, TextField, InputLabel, InputAdornment, IconButton } from '@mui/material';
// and-design
import { SyncOutlined } from '@ant-design/icons';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import PasswordInput from '@components/form/PasswordInput';
import SelectBase from '@components/form/BaseSelect';
import SelectMultiple from '@components/form/MultipleSelect';
import IpLimit from '@components/form/IpLimit';
// api
import { apiAdd } from '@src/api/UserAgent';

export default function AddDialog({
  parentData,
  groupList = [],
  moneyTypeList = [],
  typeList = [],
  statusList = [],
  currencyList = [],
  walletTypeList = [],
  roomTypeList = [],
  flagList = [],
  fetchData,
}: {
  parentData: IResInfo;
  groupList: TbSelectProps[];
  moneyTypeList: TbSelectProps[];
  typeList: TbSelectProps[];
  statusList: TbSelectProps[];
  currencyList: TbSelectProps[];
  walletTypeList: TbSelectProps[];
  roomTypeList: TbSelectProps[];
  flagList: TbSelectProps[];
  fetchData: () => Promise<void>;
}) {
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();
  const [groupOptions, setGroupOptions] = useState<TbSelectProps[]>([]);
  const fcCloseDialog = () => {
    resetForm();
    modal.close();
  };

  const formik = useFormik({
    initialValues: {
      pid: '',
      level: 0,
      username: '',
      password: '',
      type: 1,
      name: '',
      money_limit: 0,
      money_type: 0,
      share: 0,
      rakeback: 0,
      group_id: '',
      currency: '',
      wallet_type: 1,
      api_url: '',
      exclude_room_type: '',
      flag_ary: '',
      status: '',
      check_pwd: '',
      ip_limit: '',
      remark: '',
      wtoken: '',
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required(t('vt.require', { key: t('sys.username') })),
      password: Yup.string().required(t('vt.require', { key: t('sys.password') })),
      type: Yup.string().required(t('vt.require', { key: t('sys.type') })),
      name: Yup.string().required(t('vt.require', { key: t('sys.name') })),
      money_type: Yup.string().required(t('vt.require', { key: t('userAgent.money_type') })),
      share: Yup.number()
        .required(t('vt.require', { key: t('userAgent.share') }))
        .min(0, t('vt.min', { num: 0 }))
        .max(parentData.share, t('vt.max', { num: parentData.share })),
      rakeback: Yup.number()
        .required(t('vt.require', { key: t('userAgent.rakeback') }))
        .min(0, t('vt.min', { num: 0 }))
        .max(parentData.rakeback, t('vt.max', { num: parentData.rakeback })),
      group_id: Yup.string().required(t('vt.require', { key: t('userAgent.group_id') })),
      currency: Yup.string().required(t('vt.require', { key: t('userAgent.currency') })),
      status: Yup.string().required(t('vt.require', { key: t('sys.status') })),
      wallet_type: Yup.string().required(t('vt.require', { key: t('userAgent.wallet_type') })),
      api_url: Yup.string().when('wallet_type', ([wallet_type]) => {
        return wallet_type === '2'
          ? Yup.string()
              .required(t('vt.require', { key: t('userAgent.api_url') }))
              .url(t('vt.url'))
              .matches(/.*\/$/, t('vt.trailing_slash'))
          : Yup.string();
      }),
      check_pwd: Yup.string().required(t('vt.require', { key: t('sys.adminPwd') })),
      wtoken: Yup.string().when('wallet_type', ([wallet_type]) => {
        return wallet_type === '2'
          ? Yup.string().required(t('vt.require', { key: t('userAgent.wtoken') }))
          : Yup.string();
      }),
    }),
    validateOnChange: true,
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
  } = formik;
  useEffect(() => {
    if (values.wallet_type == 2) {
      setFieldValue('wtoken', uuid4());
    }
  }, [setFieldValue, values.wallet_type]);
  useEffect(() => {
    setValues({
      ...values,
      pid: parentData.pid,
      level: parentData.level,
      money_type: parentData.money_type,
    });
    if (!parentData.group_id) {
      setGroupOptions(groupList);
      return;
    }
    const options: TbSelectProps[] = [];
    parentData.group_id.split(',').forEach((item) => {
      const group = groupList.find((group) => group.value === item);
      if (group) options.push(group);
    });
    setGroupOptions(options);
  }, [modal.closed]);

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
          {/* 帳號 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('sys.username')}</InputLabel>
            <TextField
              name="username"
              placeholder={t('sys.username')}
              fullWidth
              onBlur={handleBlur('username')}
              onChange={handleChange('username')}
              value={values.username}
              error={Boolean(errors.username)}
              helperText={errors.username ? errors.username : null}
            />
          </Grid>
          {/* 密碼 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('sys.password')}</InputLabel>
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
          {/* 帳號類型 */}
          <Grid xs={12} md={6}>
            <InputLabel className={values.level === 0 ? 'requireClass' : ''}>
              {t('userAgent.money_type')}
            </InputLabel>
            <SelectBase
              disabled={parentData.type === undefined ? false : true}
              options={moneyTypeList}
              value={values.money_type}
              errors={errors.money_type}
              setValue={(value: string) => {
                setFieldValue('money_type', value);
              }}
            />
          </Grid>
          {/* 幣別 */}
          <Grid xs={12} md={6}>
            <InputLabel className={values.level === 0 ? 'requireClass' : ''}>
              {t('userAgent.currency')}
            </InputLabel>
            <SelectBase
              options={currencyList}
              value={values.currency}
              errors={errors.currency}
              setValue={(value: string) => {
                setFieldValue('currency', value);
              }}
            />
          </Grid>
          {/* 佔成 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('userAgent.share')}</InputLabel>
            <TextField
              fullWidth
              type="number"
              inputProps={{ step: 0.01 }}
              name="share"
              placeholder={t('userAgent.share')}
              onBlur={handleBlur('share')}
              onChange={handleChange('share')}
              value={values.share}
              error={Boolean(errors.share)}
              helperText={errors.share ? errors.share : null}
            />
          </Grid>
          {/* 返水 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('userAgent.rakeback')}</InputLabel>
            <TextField
              fullWidth
              type="number"
              inputProps={{ step: 0.01 }}
              name="rakeback"
              placeholder={t('userAgent.rakeback')}
              onBlur={handleBlur('rakeback')}
              onChange={handleChange('rakeback')}
              value={values.rakeback}
              error={Boolean(errors.rakeback)}
              helperText={errors.rakeback ? errors.rakeback : null}
            />
          </Grid>
          {/* 可用限紅組 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('userAgent.group_id')}</InputLabel>
            <SelectMultiple
              options={groupOptions}
              value={values.group_id}
              errors={errors.group_id}
              isSelectAllEnabled={true}
              setValue={(value: string) => {
                setFieldValue('group_id', value);
              }}
            />
          </Grid>
          {/* 錢包類型  */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('userAgent.wallet_type')}</InputLabel>
            <SelectBase
              options={walletTypeList}
              value={values.wallet_type}
              errors={errors.wallet_type}
              setValue={(value: string) => {
                setFieldValue('wallet_type', value);
              }}
            />
          </Grid>
          {/* 錢包Url */}
          {values.wallet_type == 2 && (
            <Grid xs={12} md={6}>
              <InputLabel className="requireClass">{t('userAgent.api_url')}</InputLabel>
              <TextField
                name="api_url"
                placeholder={t('userAgent.api_url')}
                fullWidth
                onBlur={handleBlur('api_url')}
                onChange={handleChange('api_url')}
                value={values.api_url}
                error={Boolean(errors.api_url)}
                helperText={errors.api_url ? errors.api_url : null}
              />
            </Grid>
          )}
          {values.wallet_type == 2 && (
            <Grid xs={12} md={6}>
              <InputLabel className="requireClass">{t('userAgent.wtoken')}</InputLabel>
              <TextField
                name="wtoken"
                placeholder={t('userAgent.wtoken')}
                fullWidth
                onBlur={handleBlur('wtoken')}
                onChange={handleChange('wtoken')}
                value={values.wtoken}
                error={Boolean(errors.wtoken)}
                helperText={errors.wtoken ? errors.wtoken : null}
                InputProps={{
                  readOnly: true,
                  disabled: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="generate uuid"
                        onClick={() => {
                          setFieldValue('wtoken', uuid4());
                        }}
                        edge="end"
                        color="secondary"
                      >
                        <SyncOutlined />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
          {/* 排除廳別 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('userAgent.exclude_room_type')}</InputLabel>
            <SelectMultiple
              options={roomTypeList}
              value={values.exclude_room_type}
              errors={errors.exclude_room_type}
              setValue={(value: string) => {
                setFieldValue('exclude_room_type', value);
              }}
            />
          </Grid>
          {/* Flag */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('userAgent.flag')}</InputLabel>
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
          {/* 備註 */}
          <Grid xs={12}>
            <InputLabel>{t('sys.remark')}</InputLabel>
            <TextField
              name="remark"
              placeholder={t('sys.remark')}
              fullWidth
              multiline
              rows={4}
              onBlur={handleBlur('remark')}
              onChange={handleChange('remark')}
              value={values.remark}
              error={Boolean(errors.remark)}
              helperText={errors.remark ? errors.remark : null}
            />
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
