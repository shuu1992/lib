import { useEffect, useState } from 'react';
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
import SelectBase from '@components/form/BaseSelect';
import NumberTextField from '@components/form/NumberTextField';

// api
import { IResInfo } from '@api/UserOnline/res';

export default function InfoDialog({
  infoData,
  groupList,
  moneyTypeList,
  typeList,
  statusList,
  fetchData,
}: {
  infoData: IResInfo;
  groupList: TbSelectProps[];
  moneyTypeList: TbSelectProps[];
  typeList: TbSelectProps[];
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
      id: '',
      username: '',
      password: '',
      type: 0,
      name: '',
      money_limit: 0,
      money_type: '',
      rakeback: 0,
      group_id: 0,
      status: 0,
      remark: '',
      //不可以更改
      register_ip: '',
      created_at: '',
      created_by: '',
      login_ip: '',
      login_time: '',
      updated_at: '',
      updated_by: '',
      bet_money: 0,
      level: 0,
      path: '',
      pid: 0,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t('vt.require', { key: t('sys.name') })),
      money_limit: Yup.number().required(t('vt.require', { key: t('userAgent.money_limit') })),
      rakeback: Yup.number()
        .required(t('vt.require', { key: t('userAgent.rakeback') }))
        .min(0, t('vt.min', { num: 0 })),
      group_id: Yup.string().required(t('vt.require', { key: t('userAgent.group_id') })),
      status: Yup.string().required(t('vt.require', { key: t('sys.status') })),
    }),
    validateOnChange: false,
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

  useEffect(() => {
    if (!infoData) return;
    setValues({
      ...values,
      id: infoData.id as string,
      username: infoData.username,
      type: infoData.type as number,
      name: infoData.name,
      money_limit: infoData.money_limit as number,
      money_type: infoData.money_type as string,
      rakeback: infoData.rakeback as number,
      group_id: infoData.group_id as number,
      status: infoData.status as number,
      remark: infoData.remark,
      //不可編輯
      created_at: infoData.created_at,
      created_by: infoData.created_by,
      login_ip: infoData.login_ip || '-',
      login_time: infoData.login_time,
      updated_at: infoData.updated_at,
      updated_by: infoData.updated_by,
    });
  }, [infoData]);

  return (
    <FormikProvider value={formik}>
      <CustomizedDialog
        flag={!modal.closed}
        title={t('sys.details')}
        confirmCfg={{
          flag: false,
          txt: t('sys.edit'),
          fcConfirm: async () => {
            return;
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
              onBlur={handleBlur('username')}
              onChange={handleChange('username')}
              value={values.username}
              error={Boolean(errors.username)}
              helperText={errors.username ? errors.username : null}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 真實姓名 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.name')}</InputLabel>
            <TextField
              name="name"
              placeholder={t('sys.name')}
              fullWidth
              onBlur={handleBlur('name')}
              onChange={handleChange('name')}
              value={values.name}
              error={Boolean(errors.name)}
              helperText={errors.name ? errors.name : null}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 角色 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.role')}</InputLabel>
            <SelectBase
              disabled={true}
              options={typeList}
              value={values.type}
              errors={errors.type}
              setValue={(value: string) => {
                setFieldValue('type', value);
              }}
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
                setFieldValue('money_type', value);
              }}
            />
          </Grid>
          {/* 最大限額 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('userAgent.money_limit')}</InputLabel>
            <NumberTextField
              placeholder={t('userAgent.money_limit')}
              disabled={true}
              value={values.money_limit}
              errors={errors.money_limit}
              setValue={(value: string | number) => {
                handleChange('money_limit');
                setFieldValue('money_limit', value);
              }}
            />
          </Grid>
          {/* 返水 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('userAgent.rakeback')}</InputLabel>
            <NumberTextField
              placeholder={t('userAgent.rakeback')}
              disabled={true}
              value={values.rakeback}
              errors={errors.rakeback}
              setValue={(value: string | number) => {
                handleChange('rakeback');
                setFieldValue('rakeback', value);
              }}
            />
          </Grid>
          {/* 可用限紅組 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('userAgent.group_id')}</InputLabel>
            <SelectBase
              disabled={true}
              options={groupList}
              value={values.group_id}
              errors={errors.group_id}
              setValue={(value: string) => {
                setFieldValue('group_id', value);
              }}
            />
          </Grid>
          {/* 狀態 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.status')}</InputLabel>
            <SelectBase
              disabled={true}
              options={statusList}
              value={values.status}
              errors={errors.status}
              setValue={(value: string) => {
                setFieldValue('status', value);
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
