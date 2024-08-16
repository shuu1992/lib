import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { FormHelperText, TextField, InputLabel } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import SelectBase from '@components/form/BaseSelect';
// api
import { apiEdit } from '@api/GameBet';
import { IResInfo } from '@api/GameBet/res';

export default function EditDialog({
  infoData,
  gameList,
  categoryList,
  fetchData,
}: {
  infoData: IResInfo;
  gameList: TbSelectProps[];
  categoryList: TbSelectProps[];
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
      id: 0,
      odds: 0,
      odds2: 0,
      sort: 0,
      values: '',
      brief: '',
      // 不可修改
      game_id: 0,
      category: 0,
      created_at: '',
      created_by: '',
      updated_at: '',
      updated_by: '',
    },
    validationSchema: Yup.object().shape({
      odds: Yup.number()
        .required(t('vt.require', { key: t('gameBet.odds') }))
        .min(0, t('vt.min', { num: 0 })),
      odds2: Yup.number()
        .required(t('vt.require', { key: t('gameBet.odds2') }))
        .min(0, t('vt.min', { num: 0 })),
      sort: Yup.number()
        .min(0, t('vt.min', { num: 0 }))
        .required(t('vt.require', { key: t('gameBet.sort') })),
      values: Yup.string().required(t('vt.require', { key: t('gameBet.values') })),
      brief: Yup.string(),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const postData = {
          id: values.id,
          odds: values.odds,
          odds2: values.odds2,
          sort: values.sort,
          values: values.values,
          brief: values.brief,
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
      id: infoData.id,
      odds: infoData.odds,
      odds2: infoData.odds2,
      sort: infoData.sort,
      values: infoData.values,
      brief: infoData.brief,
      // 不可修改
      game_id: infoData.game_id,
      category: infoData.category,
      created_at: infoData.created_at,
      created_by: infoData.created_by,
      updated_at: infoData.updated_at,
      updated_by: infoData.updated_by,
    });
  }, [infoData]);

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
          {/* 遊戲類別 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameBet.game_id')}</InputLabel>
            <SelectBase
              disabled={true}
              options={gameList}
              value={values.game_id}
              errors={errors.game_id}
              setValue={(value: string) => {
                setFieldValue('game_id', value);
              }}
            />
          </Grid>
          {/* 分類 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameBet.category')}</InputLabel>
            <SelectBase
              disabled={true}
              options={categoryList}
              value={values.category}
              errors={errors.category}
              setValue={(value: string) => {
                setFieldValue('category', value);
              }}
            />
          </Grid>
          {/* 賠率 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('gameBet.odds')}</InputLabel>
            <TextField
              name="odds"
              type="number"
              placeholder={t('gameBet.odds')}
              fullWidth
              onBlur={handleBlur('odds')}
              onChange={handleChange('odds')}
              value={values.odds}
              error={Boolean(errors.odds)}
              helperText={errors.odds ? errors.odds : null}
            />
          </Grid>
          {/* 特殊賠率 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('gameBet.odds2')}</InputLabel>
            <TextField
              name="odds2"
              type="number"
              placeholder={t('gameBet.odds2')}
              fullWidth
              onBlur={handleBlur('odds2')}
              onChange={handleChange('odds2')}
              value={values.odds2}
              error={Boolean(errors.odds2)}
              helperText={errors.odds2 ? errors.odds2 : null}
            />
          </Grid>
          {/* Sort */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('sys.sort')}</InputLabel>
            <TextField
              name="sort"
              type="number"
              placeholder={t('sys.sort')}
              fullWidth
              onBlur={handleBlur('sort')}
              onChange={handleChange('sort')}
              value={values.sort}
              error={Boolean(errors.sort)}
              helperText={errors.sort ? errors.sort : null}
            />
          </Grid>
          {/* 注區名稱 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('gameBet.values')}</InputLabel>
            <TextField
              name="values"
              placeholder={t('gameBet.values')}
              fullWidth
              onBlur={handleBlur('values')}
              onChange={handleChange('values')}
              value={values.values}
              error={Boolean(errors.values)}
              helperText={errors.values ? errors.values : null}
            />
          </Grid>
          {/* 簡介 */}
          <Grid xs={12}>
            <InputLabel>{t('gameBet.brief')}</InputLabel>
            <TextField
              name="brief"
              placeholder={t('gameBet.brief')}
              fullWidth
              onBlur={handleBlur('brief')}
              onChange={handleChange('brief')}
              value={values.brief}
              error={Boolean(errors.brief)}
              helperText={errors.brief ? errors.brief : null}
            />
          </Grid>
          {/* 更新時間 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.updated_at')}</InputLabel>
            <TextField
              name="updated_at"
              fullWidth
              value={values.updated_at}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 更新人員 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.updated_by')}</InputLabel>
            <TextField
              name="updated_by"
              fullWidth
              value={values.updated_by}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 新增時間 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.created_at')}</InputLabel>
            <TextField
              name="created_at"
              fullWidth
              value={values.created_at}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 新增人員 */}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.created_by')}</InputLabel>
            <TextField
              name="created_by"
              fullWidth
              value={values.created_by}
              inputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
