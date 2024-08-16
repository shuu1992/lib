import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
// material-ui
import { Box, Tabs, Tab, TextField, InputLabel } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
interface PlatformObjProps {
  id: number | string;
  value: number;
}

export interface PlatformSetProps {
  platform_type_id: number;
  name: string;
  platform: { [key: number]: string };
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default function Rakeback({
  platform_set,
  value = null,
  setValue,
}: {
  platform_set: PlatformSetProps[];
  value: { [key: number]: { [key: number]: number } } | null;
  setValue: (value: any) => void;
}) {
  const { t, fcShowMsg } = usePage();
  const [initData, setInitData] = useState<PlatformObjProps[][]>([]);
  const formik = useFormik({
    initialValues: {
      platformValue: [] as PlatformObjProps[][],
    },
    validationSchema: Yup.object().shape({}),
    validateOnChange: true,
    onSubmit: async (values) => {},
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

  const [tab, setTab] = useState(1);
  const chagneTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    if (value === null) {
      const initialValue: { [key: number]: { [key: number]: number } } = {};
      platform_set.forEach((platform) => {
        const platformId = platform.platform_type_id;
        const tempObj: { [key: number]: number } = {};
        for (const id in platform.platform) {
          tempObj[Number(id)] = 0; // 确保 id 被转换为数字类型
        }
        initialValue[platformId] = tempObj;
      });
      value = initialValue;
    }
    const nestedList: PlatformObjProps[][] = platform_set.map((platform) => {
      const platformId = platform.platform_type_id;
      const platformValues = value![platformId] || {};
      const result: PlatformObjProps[] = [];

      if (Object.keys(platformValues).length > 0) {
        if (platformValues.hasOwnProperty(0) === false) {
          platformValues[0] = 0;
        } else {
          for (const id in platform.platform) {
            if (platformValues.hasOwnProperty(id) === false) {
              platformValues[id] = platformValues[0];
            }
          }
        }
        for (const [id, val] of Object.entries(platformValues)) {
          result.push({ id: parseInt(id), value: val });
        }
      } else {
        result.push({ id: 0, value: 0 });
        for (const id in platform.platform) {
          result.push({ id: parseInt(id), value: 0 });
        }
      }
      return result;
    });
    setValues({ platformValue: nestedList });
    setInitData((prevState: any) => nestedList);
  }, [value]);
  // 回傳父層
  useEffect(() => {
    const newValue: { [key: number]: { [key: number]: number } } = {};
    values.platformValue.forEach((platform, key) => {
      const platformId = platform_set[key].platform_type_id;
      const tempObj: { [key: number]: number } = {};

      platform.forEach((obj) => {
        if (obj.id === 0 || obj.value >= 0) {
          tempObj[obj.id as number] = obj.value;
        }
      });

      if (Object.keys(tempObj).length > 0) {
        newValue[platformId] = tempObj;
      }
    });

    // 判斷是否有變動
    setTimeout(() => {
      if (JSON.stringify(values.platformValue) !== JSON.stringify(initData)) {
        setValue(newValue);
      }
    }, 500);
  }, [values]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={chagneTab} variant="scrollable" scrollButtons="auto">
          {platform_set.map((item, key) => (
            <Tab
              label={item.name}
              {...a11yProps(key)}
              value={item.platform_type_id}
              key={`${item.name}${key}`}
            />
          ))}
        </Tabs>
      </Box>
      <FormikProvider value={formik}>
        {platform_set.map((item, key) => {
          return (
            <CustomTabPanel value={tab} index={item.platform_type_id} key={key}>
              <Grid container spacing={2}>
                <Grid xs={6} md={3}>
                  <InputLabel className="requireClass">{t('sys.default')}</InputLabel>
                  <TextField
                    name={`platformValue.${key}.0.value`}
                    fullWidth
                    type="number"
                    inputProps={{ step: 0.01, min: 0 }}
                    value={values.platformValue[key]?.find((obj) => obj.id === 0)?.value ?? 0}
                    onBlur={(e) => {
                      handleBlur(e);
                      setFieldValue(
                        `platformValue.${key}.0.value`,
                        parseFloat(e.target.value) || 0,
                      );
                    }}
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue(`platformValue.${key}.0.value`, parseFloat(e.target.value));
                    }}
                  />
                </Grid>
                {Object.entries(item.platform).map(([platformKey, platformValue]) => {
                  const arrayKey = values.platformValue[key]?.findIndex(
                    (obj) => obj.id === parseInt(platformKey),
                  );
                  return (
                    <Grid xs={6} md={3} key={`${platformValue}${platformKey}`}>
                      <InputLabel className="requireClass">{platformValue}</InputLabel>
                      <TextField
                        name={`platformValue.${key}.${arrayKey}`}
                        fullWidth
                        type="number"
                        inputProps={{ step: 0.01, min: 0 }}
                        value={values.platformValue[key]?.[arrayKey]?.value ?? 0}
                        onBlur={(e) => {
                          handleBlur(e);
                          const currentItem = values.platformValue[key]?.[arrayKey];

                          setFieldValue(`platformValue.${key}.${arrayKey}`, {
                            ...currentItem,
                            value: parseFloat(e.target.value) || 0,
                          });
                        }}
                        onChange={(e) => {
                          handleChange(e);
                          const currentItem = values.platformValue[key]?.[arrayKey];

                          setFieldValue(`platformValue.${key}.${arrayKey}`, {
                            ...currentItem,
                            value: parseFloat(e.target.value) || 0,
                          });
                        }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </CustomTabPanel>
          );
        })}
      </FormikProvider>
    </Box>
  );
}
