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
import { findPowersOfTwoAsString } from '@utils/method';
import CustomizedDialog from '@components/dialog/FormDialog';
import PasswordInput from '@components/form/PasswordInput';
import SelectBase from '@components/form/BaseSelect';
import NumberTextField from '@components/form/NumberTextField';
import SelectMultiple from '@components/form/MultipleSelect';
// api
import { apiEdit } from '@src/api/UserMember';
import { IResInfo } from '@api/UserMember/res';
import { IResInfo as IAgResInfo } from '@api/UserAgent/res';
import { fcMoneyFormat } from '@src/utils/method';

export default function EditDialog({
  parentData,
  infoData,
  flagList,
  groupList,
  moneyTypeList,
  typeList,
  statusList,
  fetchData,
}: {
  parentData: IAgResInfo;
  infoData: IResInfo;
  flagList: TbSelectProps[];
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
      id: 0,
      username: '',
      password: '',
      name: '',
      money_limit: 0,
      lose_limit: 0,
      money_type: 0,
      rakeback: 0,
      group_id: 0,
      flag: '',
      flag_ary: '',
      status: 0,
      check_pwd: '',
      remark: '',
      //不可以更改
      type: 0,
      register_ip: '',
      created_at: '',
      created_by: '',
      login_ip: '',
      login_time: '',
      updated_at: '',
      updated_by: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t('vt.require', { key: t('sys.name') })),
      money_limit: Yup.number()
        .required(t('vt.require', { key: t('userAgent.money_limit') }))
        .min(0, t('vt.min', { num: 0 })),
      rakeback: Yup.number()
        .required(t('vt.require', { key: t('userAgent.rakeback') }))
        .min(0, t('vt.min', { num: 0 }))
        .max(parentData.rakeback, t('vt.max', { num: fcMoneyFormat(parentData.rakeback) })),
      group_id: Yup.string().required(t('vt.require', { key: t('userAgent.group_id') })),
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
          money_limit: values.money_limit,
          lose_limit: values.lose_limit,
          money_type: values.money_type,
          rakeback: values.rakeback,
          group_id: values.group_id,
          flag: values.flag_ary.split(',').reduce((acc, cur) => acc + (parseInt(cur, 10) || 0), 0),
          status: values.status,
          check_pwd: values.check_pwd,
          remark: values.remark,
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
      username: infoData.username,
      name: infoData.name,
      money_limit: infoData.money_limit,
      lose_limit: infoData.lose_limit,
      money_type: infoData.money_type,
      rakeback: infoData.rakeback,
      group_id: infoData.group_id,
      flag: infoData.flag.toString(),
      flag_ary: findPowersOfTwoAsString(infoData.flag),
      status: infoData.status,
      check_pwd: infoData.check_pwd,
      remark: infoData.remark,
      //不可編輯
      id: infoData.id,
      type: infoData.type,
      created_at: infoData.created_at,
      created_by: infoData.created_by,
      login_ip: infoData.login_ip || '-',
      login_time: infoData.login_time,
      updated_at: infoData.updated_at,
      updated_by: infoData.updated_by,
    });
  }, [modal.closed]);

  useEffect(() => {
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
  }, [parentData]);

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
            <InputLabel>{t('userAgent.money_type')}</InputLabel>
            <SelectBase
              disabled={values.money_type !== 0}
              options={moneyTypeList}
              value={values.money_type}
              errors={errors.money_type}
              setValue={(value: string) => {
                setFieldValue('money_type', value);
              }}
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
              helperText={errors.rakeback ? errors.rakeback : null}
            />
          </Grid>
          {/* 最大限額 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('userAgent.money_limit')}</InputLabel>
            <NumberTextField
              placeholder={t('userAgent.money_limit')}
              value={values.money_limit}
              errors={errors.money_limit}
              setValue={(value: string | number) => {
                handleChange('money_limit');
                setFieldValue('money_limit', value);
              }}
            />
          </Grid>
          {/* 最大輸額 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('userAgent.lose_limit')}</InputLabel>
            <NumberTextField
              placeholder={t('userAgent.lose_limit')}
              value={values.lose_limit}
              errors={errors.lose_limit}
              setValue={(value: string | number) => {
                handleChange('lose_limit');
                setFieldValue('lose_limit', value);
              }}
            />
          </Grid>
          {/* 可用限紅組 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('userAgent.group_id')}</InputLabel>
            <SelectBase
              options={groupOptions}
              value={values.group_id}
              errors={errors.group_id}
              setValue={(value: string) => {
                setFieldValue('group_id', value);
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
          {/* 顯示註記 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('userMember.flag')}</InputLabel>
            <SelectMultiple
              options={flagList}
              value={values.flag_ary}
              errors={errors.flag_ary}
              setValue={(value: string) => {
                setFieldValue('flag_ary', value);
              }}
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
