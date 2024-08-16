import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { TextField, InputLabel } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import SelectBase from '@components/form/BaseSelect';
import NumberTextField from '@components/form/NumberTextField';
// api
import { IResInfo } from '@api/GameBetRecord/res';

export default function InfoDialog({ infoData, refer }: { infoData: IResInfo; refer: any }) {
  const theme = useTheme();
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();
  // set options
  const [betareaList, setBetareaList] = useState<TbSelectProps[]>([]);
  const [roomList, setRoomList] = useState<TbSelectProps[]>([]);
  const [winloseList, setWinloseList] = useState<TbSelectProps[]>([]);
  const [statusList, setStatusList] = useState<TbSelectProps[]>([]);
  const fcCloseDialog = () => {
    resetForm();
    modal.close();
  };
  const formik = useFormik({
    initialValues: {
      bet_no: '',
      bet_real: 0,
      bet_total: 0,
      betarea: '',
      betarea_id: 0,
      game_id: 0,
      game_no: '',
      is_lose_win: 0,
      odds: 0,
      payoff: 0,
      payout: 0,
      payout_time: '',
      rebate: '',
      record: '',
      report_time: '',
      room_id: 0,
      status: 0,
      username: '',
      created_at: '',
      created_by: '',
      updated_at: '',
      updated_by: '',
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
      bet_no: infoData.bet_no,
      bet_real: infoData.bet_real,
      bet_total: infoData.bet_total,
      betarea: infoData.betarea,
      betarea_id: infoData.betarea_id,
      game_id: infoData.game_id,
      game_no: infoData.game_no,
      is_lose_win: infoData.is_lose_win,
      odds: infoData.odds,
      payoff: infoData.payoff,
      payout: infoData.payout,
      payout_time: infoData.payout_time,
      rebate: infoData.rebate,
      record: infoData.record as string,
      report_time: infoData.report_time,
      room_id: infoData.room_id,
      status: infoData.status,
      username: infoData.username,
    });
  }, [infoData]);

  useEffect(() => {
    const betareaList: TbSelectProps[] = Object.entries(refer.betarea).map(
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
    const winloseList: TbSelectProps[] = Object.entries(refer.is_lose_win).map(
      ([value, name]): TbSelectProps => ({
        text: name as string,
        value: value,
      }),
    );
    const statusList: TbSelectProps[] = Object.entries(refer.status).map(
      ([value, name]): TbSelectProps => ({
        text: name as string,
        value: value,
      }),
    );
    //Search Cfg
    setBetareaList(betareaList);
    setRoomList(roomList);
    setWinloseList(winloseList);
    setStatusList(statusList);
  }, [refer]);

  return (
    <FormikProvider value={formik}>
      <CustomizedDialog
        flag={!modal.closed}
        title={t('sys.betDetails')}
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
            <InputLabel>{t('gameBetRc.room_id')}</InputLabel>
            <SelectBase
              disabled={true}
              options={roomList}
              value={values.room_id}
              errors={errors.room_id}
              setValue={() => {}}
            />
          </Grid>
          {/* 注單編號*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameBetRc.bet_no')}</InputLabel>
            <TextField
              name="bet_no"
              placeholder={t('sys.bet_no')}
              fullWidth
              value={values.bet_no}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 遊戲編號*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameBetRc.game_no')}</InputLabel>
            <TextField
              name="game_no"
              placeholder={t('sys.game_no')}
              fullWidth
              value={values.game_no}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 有效投注額*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameBetRc.bet_real')}</InputLabel>
            <NumberTextField
              disabled={true}
              value={values.bet_real}
              errors={errors.bet_real}
              setValue={() => {}}
            />
          </Grid>
          {/* 投注總額*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameBetRc.bet_total')}</InputLabel>
            <NumberTextField
              disabled={true}
              value={values.bet_total}
              errors={errors.bet_total}
              setValue={() => {}}
            />
          </Grid>
          {/* 注區*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameBetRc.betarea_id')}</InputLabel>
            <SelectBase
              disabled={true}
              options={betareaList}
              value={values.betarea_id}
              errors={errors.betarea_id}
              setValue={() => {}}
            />
          </Grid>
          {/* 輸贏*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameBetRc.payoff')}</InputLabel>
            <NumberTextField
              disabled={true}
              value={values.payoff}
              errors={errors.payoff}
              setValue={() => {}}
            />
          </Grid>
          {/* 派彩*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameBetRc.payout')}</InputLabel>
            <NumberTextField
              disabled={true}
              value={values.payout}
              errors={errors.payout}
              setValue={() => {}}
            />
          </Grid>
          {/* 賠率*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameBetRc.odds')}</InputLabel>
            <TextField
              name="odds"
              placeholder={t('sys.odds')}
              fullWidth
              value={values.odds}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 輸贏*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameBetRc.is_lose_win')}</InputLabel>
            <SelectBase
              disabled={true}
              options={winloseList}
              value={values.is_lose_win}
              errors={errors.is_lose_win}
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
          {/* 派彩時間*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameBetRc.payout_time')}</InputLabel>
            <TextField
              name="payout_time"
              placeholder={t('sys.payout_time')}
              fullWidth
              value={values.payout_time}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          {/* 報表時間*/}
          <Grid xs={12} md={6}>
            <InputLabel>{t('gameBetRc.report_time')}</InputLabel>
            <TextField
              name="report_time"
              placeholder={t('sys.report_time')}
              fullWidth
              value={values.report_time}
              inputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
