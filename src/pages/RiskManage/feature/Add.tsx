import { useEffect, useMemo, useRef } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { InputLabel } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import SelectBase from '@components/form/BaseSelect';
import DateTimeRangePicker from '@components/form/DateTimeRangePicker';
import { apiAdd } from '@api/RiskManage';
import BoxingSetting from '../component/BoxingSetting';
import { RoomType } from '../index';
// api
export default function AddDialog({
  gameList,
  rooms,
  fetchData,
}: {
  gameList: TbSelectProps[];
  rooms: RoomType[];
  fetchData: () => Promise<void>;
}) {
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();
  const childRef = useRef<{ validate: () => Promise<any> } | null>(null);
  const fcCloseDialog = () => {
    resetForm();
    modal.close();
  };

  const formik = useFormik({
    initialValues: {
      game: '',
      room_id: '',
      start_time: '',
      end_time: '',
      payload: '',
    },
    validationSchema: Yup.object().shape({
      game: Yup.string().required(t('vt.require', { key: t('siteNotice.type') })),
      room_id: Yup.string().required(t('vt.require', { key: t('sys.name') })),
      start_time: Yup.string().required(
        t('vt.require', { key: `${t('sys.start_time')},${t('sys.end_time')}` }),
      ),
      end_time: Yup.string().required(
        t('vt.require', { key: `${t('sys.start_time')},${t('sys.end_time')}` }),
      ),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const postData: {
          start_time: string;
          end_time: string;
          room_id: number;
          payload?: string | object;
        } = {
          ...values,
          start_time: values.start_time,
          end_time: values.end_time,
          room_id: Number(values.room_id),
          payload: values.payload,
        };
        if (values.payload === '') {
          delete postData.payload;
        }
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
  const { values, errors, handleSubmit, validateForm, setFieldValue, resetForm, setValues } =
    formik;

  const roomList = useMemo(() => {
    return rooms
      .filter((item: RoomType) => item.game_id.toString() === values.game)
      .map(
        (item: RoomType): TbSelectProps => ({
          text: item.name,
          value: item.id,
        }),
      );
  }, [rooms, values.game]);

  useEffect(() => {
    setValues({
      ...values,
      payload: '',
    });
  }, [values.game]);

  return (
    <FormikProvider value={formik}>
      <CustomizedDialog
        flag={!modal.closed}
        title={t('sys.add')}
        confirmCfg={{
          flag: true,
          txt: t('sys.add'),
          fcConfirm: async () => {
            //*當payload資料有需要時各自component會自行set與validate
            let childDataIsValid = true;
            if (childRef.current) {
              const childData = await childRef.current.validate();
              childDataIsValid = childData.isValid;
              setValues({
                ...values,
                ...childData.postData,
                payload: childData.postData.payload,
              });
            }
            const valRes = await validateForm();
            if (Object.keys(valRes).length > 0 || !childDataIsValid) return Promise.reject();
            handleSubmit();
            return Promise.resolve();
          },
        }}
        fcChangeDialog={fcCloseDialog}
      >
        <Grid container spacing={2} p={1} alignItems="center">
          {/* 遊戲類型 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('riskManage.gameType')}</InputLabel>
            <SelectBase
              options={gameList}
              value={values.game}
              errors={errors.game}
              setValue={(value: string) => {
                setFieldValue('game', value);
              }}
            />
          </Grid>
          {/* 房間 */}
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('riskManage.room_id')}</InputLabel>
            <SelectBase
              options={roomList}
              value={values.room_id}
              errors={errors.room_id}
              setValue={(value: string) => {
                setFieldValue('room_id', value);
              }}
            />
          </Grid>
          {/* 設定日期 */}
          <Grid xs={12} md={12}>
            <InputLabel className="requireClass">{t('riskManage.settingTime')}</InputLabel>
            <DateTimeRangePicker
              start={values.start_time || ''}
              end={values.end_time || ''}
              startKey={'start_time'}
              endKey={'end_time'}
              errors={errors.start_time || errors.end_time}
              setValue={(key: string, value: string) => {
                setFieldValue(key, value);
              }}
            />
          </Grid>
          {/* 拳賽   */}
          {values.game === '5' && <BoxingSetting ref={childRef} />}
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
