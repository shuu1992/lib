import { useEffect, useRef } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
import Grid from '@mui/material/Unstable_Grid2';
import { InputLabel, FormHelperText } from '@mui/material';
import { ModalController, ModalContainer } from 'react-modal-global';
import CustomizedDialog from '@components/dialog/FormDialog';
import { apiEdit } from '@api/RiskManage';
import { IResInfo } from '@api/RiskManage/res';
import DateTimeRangePicker from '@src/components/form/DateTimeRangePicker';
import BoxingSetting from '../component/BoxingSetting';
import Baccarat from '../component/Baccarat';
import NuiSetting from '../component/NuiSetting';
import ConfirmDialog from '../component/ConfirmDialog';
import PasswordInput from '@src/components/form/PasswordInput';

type IResInfoExtended = IResInfo & { gameType: number };

const Modal = new ModalController();
export default function EditDialog({
  infoData,
  fetchData,
}: {
  infoData: IResInfoExtended;
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
      start_time: '',
      end_time: '',
      check_pwd: '',
    },
    validationSchema: Yup.object().shape({
      start_time: Yup.string().required(
        t('vt.require', { key: `${t('sys.start_time')},${t('sys.end_time')}` }),
      ),
      end_time: Yup.string().required(
        t('vt.require', { key: `${t('sys.start_time')},${t('sys.end_time')}` }),
      ),
      check_pwd: Yup.string().required(t('vt.require', { key: t('sys.adminPwd') })),
    }),
    validateOnChange: false,
    onSubmit: async () => {
      try {
        const postData = {
          ...values,
          id: infoData.id,
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
  const { values, errors, handleSubmit, validateForm, setFieldValue, resetForm, setValues } =
    formik;

  useEffect(() => {
    setValues({
      ...values,
      start_time: infoData?.start_time,
      end_time: infoData?.end_time,
    });
  }, [infoData]);

  return (
    <div>
      <FormikProvider value={formik}>
        <CustomizedDialog
          flag={!modal.closed}
          title={t('sys.edit')}
          confirmCfg={{
            flag: true,
            txt: t('sys.edit'),
            fcConfirm: async () => {
              let childDataIsValid = true;
              let needConfirm = true;
              if (childRef.current) {
                const childData = await childRef.current.validate();
                childDataIsValid = childData.isValid;
                needConfirm = childData.needConfirm;
                setValues({
                  ...values,
                  ...childData.postData,
                });
              }
              const valRes = await validateForm();
              if (Object.keys(valRes).length > 0 || !childDataIsValid) return Promise.reject();
              if (needConfirm) {
                await Modal.open(ConfirmDialog, {
                  handleSubmit: async () => {
                    await handleSubmit();
                  },
                });
              } else {
                handleSubmit();
              }

              return Promise.resolve();
            },
          }}
          fcChangeDialog={fcCloseDialog}
        >
          <Grid container spacing={2} p={1} alignItems="center">
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
            {/* 百家*/}
            {infoData.gameType === 1 && <Baccarat ref={childRef} value={infoData} />}
            {/* 牛牛 */}
            {infoData.gameType === 3 && <NuiSetting ref={childRef} value={infoData} />}
            {/* 拳賽 */}
            {infoData.gameType === 5 && (
              <BoxingSetting ref={childRef} value={infoData} editMode={true} />
            )}
            {/* 管理員密碼 */}
            <Grid xs={12} md={12}>
              <InputLabel className="requireClass">{t('sys.adminPwd')}</InputLabel>
              <PasswordInput
                value={values.check_pwd}
                setValue={(value: string) => {
                  setFieldValue('check_pwd', value);
                }}
              />
              {errors.check_pwd && (
                <FormHelperText style={{ marginTop: '0.5rem' }} error>
                  {errors.check_pwd}
                </FormHelperText>
              )}
            </Grid>
          </Grid>
        </CustomizedDialog>
      </FormikProvider>
      <ModalContainer controller={Modal} />
    </div>
  );
}
