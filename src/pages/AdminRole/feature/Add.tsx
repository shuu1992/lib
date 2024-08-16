import { useState, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { useSelector } from '@store/index';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { FormHelperText, TextField, InputLabel } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import { Android12Switch } from '@components/switch/CustomizedSwitches';
import CheckboxTree from '@components/treeView/CheckboxTree';
import SelectBase from '@components/form/BaseSelect';
// api
import { apiAdd } from '@api/AdminRole';

export default function AddDialog({
  platformList,
  fetchData,
}: {
  platformList: TbSelectProps[];
  fetchData: () => Promise<void>;
}) {
  const modal = useModalWindow();
  const menuState = useSelector((state) => state.menu);
  const { defaultMenu } = menuState;
  const [permission, setPermission] = useState<number[]>([]);
  const { t, fcShowMsg } = usePage();
  const fcGetSelected = (selected: never[]) => {
    setPermission(selected as number[]);
  };

  const fcCloseDialog = () => {
    setPermission([]);
    resetForm();
    modal.close();
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      platform: '',
      allow_nav: [] as number[],
      status: 1,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(t('vt.require', { key: t('adminRole.roleName') })),
    }),
    validateOnChange: false,

    onSubmit: async (values) => {
      try {
        const { code } = await apiAdd(values);
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

  return (
    <FormikProvider value={formik}>
      <CustomizedDialog
        flag={!modal.closed}
        title={t('sys.add')}
        confirmCfg={{
          flag: true,
          txt: t('sys.add'),
          fcConfirm: async () => {
            if (permission.length > 0) {
              values.allow_nav = permission;
            } else {
              setErrors(
                Object.assign({}, errors, {
                  allow_nav: t('adminRole.placSelectpermission'),
                }),
              );
              return Promise.reject();
            }
            const valRes = await validateForm();
            if (Object.keys(valRes).length > 0) return Promise.reject();
            handleSubmit();
            return Promise.resolve();
          },
        }}
        fcChangeDialog={fcCloseDialog}
      >
        <Grid container spacing={2} p={1} alignItems="center">
          <Grid xs={12} md={6}>
            <InputLabel>{t('adminRole.roleName')}</InputLabel>
            <TextField
              name="name"
              placeholder={t('adminRole.placRoleName')}
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              variant="outlined"
              error={Boolean(errors.name)}
              helperText={errors.name ? errors.name : null}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <InputLabel>{t('adminRole.platform')}</InputLabel>
            <SelectBase
              options={platformList}
              value={values.platform}
              errors={errors.platform}
              setValue={(value: string) => {
                setFieldValue('platform', value);
              }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <InputLabel>{t('sys.status')}</InputLabel>
            <Android12Switch
              name="status"
              checked={values.status === 1}
              onChange={(event, checked) => {
                setFieldValue('status', checked ? 1 : 0);
              }}
            />
          </Grid>
          <Grid xs={12}>
            <InputLabel>{t('adminRole.permissionSetting')}</InputLabel>
            {errors.allow_nav && <FormHelperText error>{errors.allow_nav}</FormHelperText>}
            <CheckboxTree
              data={defaultMenu}
              expandAll={true}
              defaultSelect={permission}
              fcGetSelected={fcGetSelected}
            />
          </Grid>
        </Grid>
      </CustomizedDialog>
    </FormikProvider>
  );
}
