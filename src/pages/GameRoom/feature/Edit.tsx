import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { TextField, InputLabel } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import SelectBase from '@components/form/BaseSelect';
// api
import { apiEdit } from '@api/GameRoom';
import { IResInfo } from '@api/GameRoom/res';

export default function EditDialog({
  infoData,
  anchorList,
  gameList,
  hotList,
  typeList,
  statusList,
  fetchData,
}: {
  infoData: IResInfo;
  anchorList: TbSelectProps[];
  gameList: TbSelectProps[];
  hotList: TbSelectProps[];
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
      id: 0,
      name: '',
      game_id: 0,
      type: 0,
      anchor_id: 0,
      hot: 0,
      live_id: 0,
      sort: 0,
      status: 0,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t('vt.require', { key: t('gameRoom.name') })),
      game_id: Yup.string().required(t('vt.require', { key: t('gameRoom.game_id') })),
      type: Yup.string().required(t('vt.require', { key: t('gameRoom.type') })),
      anchor_id: Yup.string().required(t('vt.require', { key: t('gameRoom.anchor_id') })),
      hot: Yup.string().required(t('vt.require', { key: t('gameRoom.hot') })),
      live_id: Yup.string().required(t('vt.require', { key: t('gameRoom.live_id') })),
      sort: Yup.string().required(t('vt.require', { key: t('sys.sort') })),
      status: Yup.string().required(t('vt.require', { key: t('sys.status') })),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const { code } = await apiEdit(values);
        if (code === 200) {
          await fetchData();
          await fcCloseDialog();
          await fcShowMsg({ type: 'success', msg: t('sys.editSuc') });
        }
      } catch (error: any) {
        fcShowMsg({ type: 'error', msg: error.message });
        return Promise.reject(error);
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
      name: infoData.name,
      game_id: infoData.game_id,
      type: infoData.type,
      anchor_id: infoData.anchor_id,
      hot: infoData.hot,
      live_id: infoData.live_id,
      sort: infoData.sort,
      status: infoData.status,
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
          {/* 遊戲名稱 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('gameRoom.name')}</InputLabel>
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
          {/* 房間類型 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('gameRoom.type')}</InputLabel>
            <SelectBase
              options={typeList}
              value={values.type}
              errors={errors.type}
              setValue={(value: string) => {
                setFieldValue('type', value);
              }}
            />
          </Grid>
          {/* 遊戲類別 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('gameRoom.game_id')}</InputLabel>
            <SelectBase
              options={gameList}
              value={values.game_id}
              errors={errors.game_id}
              setValue={(value: string) => {
                setFieldValue('game_id', value);
              }}
            />
          </Grid>
          {/* 主播暱稱 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('gameRoom.anchor_id')}</InputLabel>
            <SelectBase
              options={anchorList}
              value={values.anchor_id}
              errors={errors.anchor_id}
              setValue={(value: string) => {
                setFieldValue('anchor_id', value);
              }}
            />
          </Grid>
          {/* 直播ID */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('gameRoom.live_id')}</InputLabel>
            <TextField
              name="live_id"
              type="number"
              placeholder={t('gameRoom.live_id')}
              fullWidth
              onBlur={handleBlur('live_id')}
              onChange={handleChange('live_id')}
              value={values.live_id}
              error={Boolean(errors.live_id)}
              helperText={errors.live_id ? errors.live_id : null}
            />
          </Grid>
          {/* 熱門 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('gameRoom.hot')}</InputLabel>
            <SelectBase
              options={hotList}
              value={values.hot}
              errors={errors.hot}
              setValue={(value: string) => {
                setFieldValue('hot', value);
              }}
            />
          </Grid>
          {/* Sort */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('sys.sort')}</InputLabel>
            <TextField
              name="sort"
              placeholder={t('gameRoom.sort')}
              fullWidth
              onBlur={handleBlur('sort')}
              onChange={handleChange('sort')}
              value={values.sort}
              error={Boolean(errors.sort)}
              helperText={errors.sort ? errors.sort : null}
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
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
