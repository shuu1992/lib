import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import useAuth from '@hooks/useAuth';
import { TbSelectProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
import { v4 as uuid4 } from 'uuid';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { FormHelperText, TextField, InputLabel, InputAdornment, IconButton } from '@mui/material';
// and-design
import { SyncOutlined } from '@ant-design/icons';
// custom Components
import { findPowersOfTwoAsString } from '@utils/method';
import CustomizedDialog from '@components/dialog/FormDialog';
import PasswordInput from '@components/form/PasswordInput';
import SelectBase from '@components/form/BaseSelect';
import SelectMultiple from '@components/form/MultipleSelect';
import IpLimit from '@components/form/IpLimit';

// api
import { apiEdit } from '@src/api/UserAgent';
import { IResInfo } from '@api/UserAgent/res';

export default function EditDialog({
  parentData,
  infoData,
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
  infoData: IResInfo;
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
      pid: '',
      username: '',
      password: '',
      type: 0,
      name: '',
      money_limit: 0,
      money_type: 0,
      share: 0,
      rakeback: 0,
      group_id: '',
      currency: '',
      flag_ary: '',
      status: 0,
      wallet_type: '',
      api_url: '',
      exclude_room_type: '',
      check_pwd: '',
      ip_limit: '',
      remark: '',
      wtoken: '',
      //不可編輯
      user_count: 0,
      agent_count: 0,
      created_at: '',
      created_by: '',
      credit: 0,
      level: 0,
      login_ip: '',
      login_time: '',
      updated_at: '',
      updated_by: '',
    },
    validationSchema: Yup.object().shape({
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
    onSubmit: async (values: any) => {
      try {
        const postData = {
          id: values.id,
          pid: values.pid,
          username: values.username,
          password: values.password,
          type: values.type,
          name: values.name,
          money_type: values.money_type,
          money_limit: values.money_limit,
          share: values.share,
          rakeback: values.rakeback,
          group_id: values.group_id,
          currency: values.currency,
          status: values.status,
          wallet_type: values.wallet_type,
          api_url: values.wallet_type == '1' ? '' : values.api_url,
          exclude_room_type: values.exclude_room_type,
          remark: values.remark,
          check_pwd: values.check_pwd,
          ip_limit: values.ip_limit,
          wtoken: values.wtoken,
          flag: values.flag_ary.split(',').reduce((acc, cur) => acc + (parseInt(cur, 10) || 0), 0),
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
  } = formik;

  useEffect(() => {
    setValues({
      ...values,
      id: infoData.id as string,
      pid: infoData.pid,
      username: infoData.username,
      type: infoData.type,
      name: infoData.name,
      money_limit: infoData.money_limit,
      money_type: infoData.money_type,
      share: infoData.share,
      rakeback: infoData.rakeback,
      group_id: infoData.group_id,
      currency: infoData.currency,
      wallet_type: infoData.wallet_type as string,
      exclude_room_type: infoData.exclude_room_type,
      api_url: infoData.api_url,
      flag_ary: findPowersOfTwoAsString(infoData.flag),
      status: infoData.status,
      remark: infoData.remark,
      ip_limit: infoData.ip_limit,
      wtoken: infoData.wtoken,
      //不可編輯
      user_count: infoData.user_count,
      agent_count: infoData.agent_count,
      created_at: infoData.created_at,
      created_by: infoData.created_by,
      credit: infoData.credit,
      level: infoData.level,
      login_ip: infoData.login_ip || '-',
      login_time: infoData.login_time,
      updated_at: infoData.updated_at,
      updated_by: infoData.updated_by,
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
            {errors.password && <FormHelperText error>{errors.password.toString()}</FormHelperText>}
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
              helperText={errors.name ? errors.name.toString() : null}
            />
          </Grid>
          {/* 帳號類型 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('userAgent.money_type')}</InputLabel>
            <SelectBase
              disabled={true}
              options={moneyTypeList}
              value={values.money_type}
              errors={errors.money_type}
              setValue={(value: string) => {
                handleChange('money_type');
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
              disabled={parentData.currency === undefined ? false : true}
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
            <InputLabel className={authState.user?.backstage === 1 ? 'requireClass' : ''}>
              {t('userAgent.share')}
            </InputLabel>
            <TextField
              fullWidth
              type="number"
              inputProps={{ step: 0.01, readOnly: authState.user?.backstage === 2 }}
              name="share"
              placeholder={t('userAgent.share')}
              onBlur={handleBlur('share')}
              onChange={handleChange('share')}
              value={values.share}
              error={Boolean(errors.share)}
              helperText={errors.share ? errors.share.toString() : null}
            />
          </Grid>
          {/* 返水 */}
          <Grid xs={12} md={6}>
            <InputLabel className={authState.user?.backstage === 1 ? 'requireClass' : ''}>
              {t('userAgent.rakeback')}
            </InputLabel>
            <TextField
              fullWidth
              type="number"
              inputProps={{ step: 0.01, readOnly: authState.user?.backstage === 2 }}
              name="rakeback"
              placeholder={t('userAgent.rakeback')}
              onBlur={handleBlur('rakeback')}
              onChange={handleChange('rakeback')}
              value={values.rakeback}
              error={Boolean(errors.rakeback)}
              helperText={errors.rakeback ? errors.rakeback.toString() : null}
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
          {values.wallet_type == '2' && (
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
                helperText={errors.api_url ? errors.api_url.toString() : null}
              />
            </Grid>
          )}
          {values.wallet_type == '2' && (
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
                helperText={errors.wtoken ? errors.wtoken.toString() : null}
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
          {/* 會員總數 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('userAgent.agent_count')}</InputLabel>
            <TextField
              name="agent_count"
              fullWidth
              value={values.agent_count}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 會員總數 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('userAgent.user_count')}</InputLabel>
            <TextField
              name="user_count"
              fullWidth
              value={values.user_count}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 建立者 */}
          <Grid xs={12} md={6}>
            <InputLabel>
              {t('sys.created_at')} / {t('sys.created_by')}
            </InputLabel>
            <TextField
              fullWidth
              value={`${values.created_at}   /   ${values.created_by}`}
              inputProps={{ readOnly: true }}
            />
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
