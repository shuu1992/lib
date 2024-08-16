import { forwardRef, useImperativeHandle, useEffect } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { useFormik } from 'formik';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { TextField, InputLabel } from '@mui/material';
// custom Components
import FileUpload from '@components/form/FileUpload';
import SelectBase from '@components/form/BaseSelect';
const resultList = [
  {
    text: '紅方',
    value: '0',
  },
  {
    text: '藍方',
    value: '1',
  },
  {
    text: '平手',
    value: '2',
  },
];
type ValueType = {
  payload: {
    red: {
      name: string;
      brief: string;
      image: string;
    };
    blue: {
      name: string;
      brief: string;
      image: string;
    };
  };
  numbers: string;
  rounds_no: string | number;
  rounds: string | number;
};
type BoxingSettingProps = {
  value?: ValueType;
  editMode?: boolean;
  readOnly?: boolean;
};

export default forwardRef(
  ({ value, editMode = false, readOnly = false }: BoxingSettingProps, ref) => {
    const { t } = usePage();

    const formik = useFormik({
      initialValues: {
        red: { name: '', brief: '', image: '' },
        blue: { name: '', brief: '', image: '' },
        result: '',
        rounds: 0,
        rounds_no: 0,
      },
      validationSchema: Yup.object().shape({
        red: Yup.object().shape({
          name: Yup.string().required(t('vt.require', { key: t('riskManage.username') })),
          brief: Yup.string().required(t('vt.require', { key: t('riskManage.profile') })),
          image: Yup.string().required(t('vt.require', { key: t('riskManage.playerPic') })),
        }),
        blue: Yup.object().shape({
          name: Yup.string().required(t('vt.require', { key: t('riskManage.username') })),
          brief: Yup.string().required(t('vt.require', { key: t('riskManage.profile') })),
          image: Yup.string().required(t('vt.require', { key: t('riskManage.playerPic') })),
        }),
        rounds: Yup.number().required(t('vt.require', { key: t('riskManage.rounds') })),
        rounds_no: Yup.number().required(t('vt.require', { key: t('riskManage.rounds_no') })),
      }),

      validateOnChange: false,
      onSubmit: () => {},
    });

    const { values, errors, handleChange, validateForm, setFieldValue, setValues } = formik;

    useEffect(() => {
      if (!value) return;
      const payload = value?.payload;
      setValues({
        red: payload?.red,
        blue: payload?.blue,
        result: value?.numbers,
        rounds: value.rounds as number,
        rounds_no: value.rounds_no as number,
      });
    }, [setValues, value]);

    const validate = async () => {
      let isValid = true;
      const needConfirm = values.result ? true : false;
      const valRes = await validateForm();

      if (Object.keys(valRes).length > 0) {
        isValid = false;
      }

      const postData: any = {
        payload: {
          red: values?.red,
          blue: values?.blue,
        },
        rounds: values?.rounds,
        rounds_no: values?.rounds_no,
      };
      if (values.result) {
        postData.numbers = values.result;
      }
      return {
        isValid,
        postData,
        needConfirm,
      };
    };

    useImperativeHandle(ref, () => ({
      validate: () => validate(),
    }));

    return (
      <>
        <Grid container spacing={2} p={2} alignItems="center">
          {/* 紅方選手 Image */}
          <Grid xs={12} md={6}>
            <Grid xs={12} md={12}>
              <InputLabel className="requireClass">{t('riskManage.redPlayer')}</InputLabel>
              <FileUpload
                dirname="redPlayerPic"
                value={values?.red?.image}
                errors={errors?.red?.image}
                setValue={(value: string) => {
                  setFieldValue('red.image', value);
                }}
                disabled={readOnly}
              />
            </Grid>
            <Grid xs={12} md={12} mt={2}>
              <InputLabel className="requireClass">{t('riskManage.username')}</InputLabel>
              <TextField
                name="redUsername"
                placeholder={t('riskManage.username')}
                fullWidth
                disabled={readOnly}
                onChange={handleChange('red.name')}
                value={values?.red?.name}
                error={Boolean(errors?.red?.name)}
                helperText={errors?.red?.name ? errors.red.name : null}
              />
            </Grid>
            <Grid xs={12} md={12} mt={2}>
              <InputLabel className="requireClass">{t('riskManage.profile')}</InputLabel>
              <TextField
                name="redProfile"
                disabled={readOnly}
                placeholder={t('riskManage.profile')}
                fullWidth
                onChange={handleChange('red.brief')}
                value={values?.red?.brief}
                error={Boolean(errors?.red?.brief)}
                helperText={errors?.red?.brief ? errors.red.brief : null}
              />
            </Grid>
          </Grid>
          {/* 藍方選手 Image */}
          <Grid xs={12} md={6}>
            <Grid xs={12} md={12}>
              <InputLabel className="requireClass">{t('riskManage.bluePlayer')}</InputLabel>
              <FileUpload
                dirname="bluePlayerPic"
                value={values?.blue?.image}
                errors={errors?.blue?.image}
                setValue={(value: string) => {
                  setFieldValue('blue.image', value);
                }}
                disabled={readOnly}
              />
            </Grid>
            <Grid xs={12} md={12} mt={2}>
              <InputLabel className="requireClass">{t('riskManage.username')}</InputLabel>
              <TextField
                name="blueUsername"
                placeholder={t('riskManage.username')}
                fullWidth
                disabled={readOnly}
                onChange={handleChange('blue.name')}
                value={values?.blue?.name}
                error={Boolean(errors?.blue?.name)}
                helperText={errors?.blue?.name ? errors.blue.name : null}
              />
            </Grid>
            <Grid xs={12} md={12} mt={2}>
              <InputLabel className="requireClass">{t('riskManage.profile')}</InputLabel>
              <TextField
                name="blueProfile"
                placeholder={t('riskManage.profile')}
                fullWidth
                disabled={readOnly}
                onChange={handleChange('blue.brief')}
                value={values?.blue?.brief}
                error={Boolean(errors?.blue?.brief)}
                helperText={errors?.blue?.brief ? errors.blue.brief : null}
              />
            </Grid>
          </Grid>
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('riskManage.rounds')}</InputLabel>
            <TextField
              name="rounds"
              placeholder={t('riskManage.rounds')}
              fullWidth
              onChange={handleChange('rounds')}
              value={values.rounds}
              error={Boolean(errors.rounds)}
              helperText={errors.rounds ? errors.rounds : null}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <InputLabel className="requireClass">{t('riskManage.rounds_no')}</InputLabel>
            <TextField
              name="rounds_no"
              placeholder={t('riskManage.rounds_no')}
              fullWidth
              onChange={handleChange('rounds_no')}
              value={values.rounds_no}
              error={Boolean(errors.rounds_no)}
              helperText={errors.rounds_no ? errors.rounds_no : null}
            />
          </Grid>

          {editMode && (
            <Grid xs={12} md={6}>
              <InputLabel className="requireClass">{t('riskManage.result')}</InputLabel>
              <SelectBase
                options={resultList}
                value={values.result}
                errors={errors.result}
                setValue={(value: string) => {
                  setFieldValue('result', value);
                }}
              />
            </Grid>
          )}
        </Grid>
      </>
    );
  },
);
