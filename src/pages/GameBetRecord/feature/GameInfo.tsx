import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { TextField, InputLabel, Stack, Button } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import 'mui-player/dist/mui-player.min.css';
import MuiPlayer from 'mui-player';
// api
import { ICardInfo } from '@api/RiskManage/res';

export default function EditDialog({ infoData }: { infoData: ICardInfo }) {
  const { t, fcShowMsg } = usePage();
  const [vedioFlag, setVedioFlag] = useState(false);
  const modal = useModalWindow();

  const fcCloseDialog = () => {
    resetForm();
    modal.close();
  };
  const formik = useFormik({
    initialValues: {
      num1: 0,
      num2: 0,
      num3: 0,
      num4: 0,
      num5: 0,
      num6: 0,
      room_name: '',
      game_no: '',
      rounds: 0,
      rounds_no: 0,
      video: '',
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
    const numAry = infoData.numbers ? infoData.numbers.split(',').map(Number) : [0, 0, 0, 0, 0, 0];
    setValues({
      ...values,
      num1: numAry[0],
      num2: numAry[1],
      num3: numAry[2],
      num4: numAry[3],
      num5: numAry[4],
      num6: numAry[5],
      room_name: infoData.room_name,
      game_no: infoData.game_no,
      rounds: infoData.rounds,
      rounds_no: infoData.rounds_no,
    });
  }, [infoData]);

  useEffect(() => {
    if (vedioFlag) {
      const mp = new MuiPlayer({
        container: '#mui-player',
        title: 'RG-Live',
        src: infoData.video,
        autoplay: true,
      });
    }
  }, [vedioFlag]);
  return (
    <div>
      <FormikProvider value={formik}>
        <CustomizedDialog
          flag={!modal.closed}
          title={t('gameBetRc.lotteryDetail')}
          confirmCfg={{
            flag: false,
            txt: t('sys.edit'),
            fcConfirm: async () => {
              return;
            },
          }}
          cancelCfg={{
            flag: true,
            txt: t('sys.close'),
          }}
          fcChangeDialog={fcCloseDialog}
        >
          <Stack spacing={2}>
            <Grid container spacing={2} p={1} alignItems="center">
              {/* 遊戲編號 */}
              <Grid xs={12}>
                <InputLabel>
                  {t('sys.vedio')}
                  <Button
                    variant="contained"
                    sx={{ ml: 5 }}
                    onClick={() => {
                      setVedioFlag(!vedioFlag);
                    }}
                  >
                    {vedioFlag ? t('sys.close') : t('sys.open')}
                  </Button>
                </InputLabel>
                <div id="mui-player" style={{ display: vedioFlag ? 'block' : 'none' }}></div>
              </Grid>
              {/* 開獎內容 */}
              <Grid xs={12}>
                <InputLabel>{t('riskManage.numbers')}</InputLabel>
                <Grid xs={12} display="flex">
                  <Grid xs={12} sx={{ borderRight: '1px solid ', width: '50%' }}>
                    <Grid textAlign="center" justifyContent="center">
                      {t('sys.player')}
                    </Grid>
                    <Grid mt={2} container textAlign="center" justifyContent="center">
                      {[4, 5, 6].map((item, index) => {
                        const cardNum = values[`num${item}` as keyof typeof values];
                        let cardCss = `card card${cardNum}`;
                        if (index === 2) {
                          cardCss += ' flip';
                        }
                        return (
                          <Grid key={index} xs={4} sm={2} ml={index === 2 ? 1 : 0}>
                            <div className={cardCss}></div>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                  <Grid xs={12} sx={{ width: '50%' }}>
                    <Grid textAlign="center" justifyContent="center">
                      {t('sys.banker')}
                    </Grid>
                    <Grid mt={2} container textAlign="center" justifyContent="center">
                      {[1, 2, 3].map((item, index) => {
                        const cardNum = values[`num${item}` as keyof typeof values];
                        let cardCss = `card card${cardNum}`;
                        if (index === 2) {
                          cardCss += ' flip';
                        }
                        return (
                          <Grid key={index} xs={4} sm={2} ml={index === 2 ? 1 : 0}>
                            <div className={cardCss}></div>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* 遊戲房間 */}
              <Grid xs={12}>
                <InputLabel>{t('riskManage.room_id')}</InputLabel>
                <TextField
                  name="name"
                  placeholder={t('sys.name')}
                  fullWidth
                  value={infoData.room_name}
                />
              </Grid>
              {/* 總靴數/薛數 */}
              <Grid xs={12}>
                <InputLabel>
                  {t('gameBetRc.rounds_no')}/ {t('gameBetRc.rounds')}
                </InputLabel>
                <TextField
                  name="sort"
                  placeholder={t('sys.sort')}
                  fullWidth
                  value={`${infoData.rounds_no}/${infoData.rounds}`}
                />
              </Grid>
              {/* 遊戲編號 */}
              <Grid xs={12}>
                <InputLabel>{t('riskManage.game_no')}</InputLabel>
                <TextField
                  name="name"
                  placeholder={t('sys.name')}
                  fullWidth
                  onBlur={handleBlur('name')}
                  onChange={handleChange('name')}
                  value={infoData.game_no}
                />
              </Grid>
            </Grid>
          </Stack>
        </CustomizedDialog>
      </FormikProvider>
    </div>
  );
}
