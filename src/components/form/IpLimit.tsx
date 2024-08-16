import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';
import { TbSelectProps } from '@type/page';
// material-ui
import { styled } from '@mui/material/styles';
import { Chip, Paper, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@components/@extended/LoadingButton';
import Collapse from '@mui/material/Collapse';
// custom Components
import { useTranslation } from 'react-i18next';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const IpLimit = ({
  value = '',
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) => {
  const { t } = useTranslation();
  const [addFlag, setAddFlag] = useState(false); // 新增ip
  const [selectedData, setSelectedData] = useState<TbSelectProps[]>([]); // 預選
  const handleDelete = (chipToDelete: TbSelectProps) => () => {
    setSelectedData((chips) => chips.filter((chip) => chip.value !== chipToDelete.value));
    setValue(
      selectedData
        .filter((data) => data.value !== chipToDelete.value)
        .map((data) => data.value)
        .join(','),
    );
  };
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  const formik = useFormik({
    initialValues: {
      addIp: '',
    },
    validationSchema: Yup.object().shape({
      addIp: Yup.string()
        .required(t('vt.require', { key: t('cp.addIp') }))
        .matches(ipRegex, t('vt.invalidIp', { key: t('cp.addIp') })),
    }),
    validateOnChange: true,
    onSubmit: (values) => {
      const ip = values.addIp;
      if (selectedData.some((data) => data.value === ip)) {
        return;
      }
      setSelectedData((prev) => [...prev, { value: ip, text: ip }]);
      setValue([...selectedData, { value: ip, text: ip }].map((data) => data.value).join(','));
      setAddFlag(false);
      resetForm();
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
    if (value === '') return;
    setSelectedData(value.split(',').map((ip) => ({ value: ip, text: ip })));
  }, [value]);

  return (
    <Grid container spacing={2.5} alignItems="center">
      <Grid xs={9}>
        <Paper
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 0.5,
            m: 0,
            minHeight: 40,
          }}
          component="ul"
        >
          {selectedData.map((data) => {
            return (
              <ListItem key={data.value}>
                <Chip label={data.text} onDelete={handleDelete(data)} />
              </ListItem>
            );
          })}
        </Paper>
      </Grid>
      <Grid xs={2}>
        <LoadingButton
          color="primary"
          variant="contained"
          fullWidth
          onClick={async () => {
            setAddFlag(!addFlag);
          }}
        >
          {!addFlag ? t('sys.add') : t('sys.close')}
        </LoadingButton>
      </Grid>
      {addFlag && (
        <Grid xs={12}>
          <FormikProvider value={formik}>
            <Collapse in={addFlag}>
              <Grid container spacing={2.5} alignItems="center">
                <Grid xs={10}>
                  <TextField
                    fullWidth
                    name="addIp"
                    placeholder={t('cp.addIp')}
                    onBlur={handleBlur('addIp')}
                    onChange={handleChange('addIp')}
                    value={values.addIp}
                    error={Boolean(errors.addIp)}
                    helperText={errors.addIp ? errors.addIp : null}
                  />
                </Grid>
                <Grid xs={1}>
                  <Button
                    color="error"
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    {t('sys.confirm')}
                  </Button>
                </Grid>
              </Grid>
            </Collapse>
          </FormikProvider>
        </Grid>
      )}
    </Grid>
  );
};

export default IpLimit;
