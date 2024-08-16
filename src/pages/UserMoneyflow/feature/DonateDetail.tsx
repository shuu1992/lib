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
import NumberTextField from '@components/form/NumberTextField';
// api
import { IResInfo } from '@api/GameDonate/res';

export default function InfoDialog({ infoData, refer }: { infoData: IResInfo; refer: any }) {
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();
  const fcCloseDialog = () => {
    resetForm();
    modal.close();
  };
  // set options
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  const [roomList, setRoomList] = useState<TbSelectProps[]>([]);
  const [giftList, setGiftList] = useState<TbSelectProps[]>([]);
  const [anchorList, setAnchorList] = useState<TbSelectProps[]>([]);

  const formik = useFormik({
    initialValues: {
      anchor_id: 0,
      created_at: '',
      created_by: '',
      donate: 0,
      gift_count: 0,
      gift_id: 0,
      order_sn: '',
      room_id: 0,
      status: 0,
      uid: 0,
      updated_at: '',
      updated_by: '',
      username: '',
    },
    validationSchema: Yup.object().shape({}),
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
      anchor_id: infoData.anchor_id,
      created_at: infoData.created_at,
      created_by: infoData.created_by,
      donate: infoData.donate,
      gift_count: infoData.gift_count,
      gift_id: infoData.gift_id,
      order_sn: infoData.order_sn,
      room_id: infoData.room_id,
      status: infoData.status,
      uid: infoData.uid,
      updated_at: infoData.updated_at,
      updated_by: infoData.updated_by,
      username: infoData.username,
    });
  }, [infoData]);

  useEffect(() => {
    const anchorList: TbSelectProps[] = Object.entries(refer.anchor).map(
      ([value, name]): TbSelectProps => ({
        text: name as string,
        value: value,
      }),
    );
    const giftList: TbSelectProps[] = Object.entries(refer.gift).map(
      ([value, name]): TbSelectProps => ({
        text: name as string,
        value: value,
      }),
    );
    const roomList: TbSelectProps[] = Object.entries(refer.room).map(
      ([value, name]): TbSelectProps => ({
        text: name as string,
        value: value,
      }),
    );
    const statusList: TbSelectProps[] = Object.entries(refer.status).map(
      ([value, text]): TbSelectProps => ({
        text: text as string,
        value: value,
      }),
    );

    //Search Cfg
    setAnchorList(anchorList);
    setGiftList(giftList);
    setRoomList(roomList);
    setStatusList(statusList);
  }, [refer]);

  return (
    <FormikProvider value={formik}>
      <CustomizedDialog
        flag={!modal.closed}
        title={t('sys.donateDetails')}
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
          {/* 帳號*/}
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
          {/* 遊戲房間*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameDonate.room_id')}</InputLabel>
            <SelectBase
              disabled={true}
              options={roomList}
              value={values.room_id}
              errors={errors.room_id}
              setValue={() => {}}
            />
          </Grid>
          {/* 主播暱稱*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameDonate.anchor_id')}</InputLabel>
            <SelectBase
              disabled={true}
              options={anchorList}
              value={values.anchor_id}
              errors={errors.anchor_id}
              setValue={() => {}}
            />
          </Grid>
          {/* 打賞編號*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameDonate.order_sn')}</InputLabel>
            <TextField
              name="order_sn"
              placeholder={t('gameDonate.order_sn')}
              fullWidth
              value={values.order_sn}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 禮物名稱*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameDonate.gift_id')}</InputLabel>
            <SelectBase
              disabled={true}
              options={giftList}
              value={values.gift_id}
              errors={errors.gift_id}
              setValue={() => {}}
            />
          </Grid>
          {/* 禮物數量*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameDonate.gift_count')}</InputLabel>
            <NumberTextField
              disabled={true}
              value={values.gift_count}
              errors={errors.gift_count}
              setValue={() => {}}
            />
          </Grid>
          {/* 打賞金額*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameDonate.donate')}</InputLabel>
            <NumberTextField
              disabled={true}
              value={values.donate}
              errors={errors.donate}
              setValue={() => {}}
            />
          </Grid>
          {/* 狀態*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.status')}</InputLabel>
            <SelectBase
              disabled={true}
              options={statusList}
              value={values.status}
              errors={errors.status}
              setValue={() => {}}
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
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
