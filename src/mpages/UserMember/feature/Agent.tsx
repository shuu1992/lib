import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { useFormik, FormikProvider } from 'formik';
import { useModalWindow } from 'react-modal-global';
// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Breadcrumbs, Link } from '@mui/material';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import CustomizedDialog from '@components/dialog/FormDialog';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AgentDetail from './AgentDetail';

const Modal = new ModalController();
export default function AgentDialog({
  agent_path,
}: {
  agent_path: { step: number; agent_id: number; username: string }[];
}) {
  const theme = useTheme();
  const { t, fcShowMsg } = usePage();
  const modal = useModalWindow();

  const fcCloseDialog = () => {
    resetForm();
    modal.close();
  };

  const formik = useFormik({
    initialValues: {},
    validationSchema: {},
    validateOnChange: true,
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

  return (
    <FormikProvider value={formik}>
      <CustomizedDialog
        flag={!modal.closed}
        className="xs"
        title={t('userMember.agentPath')}
        confirmCfg={{
          flag: false,
          txt: t('sys.add'),
          fcConfirm: async () => {
            return;
          },
        }}
        fcChangeDialog={fcCloseDialog}
      >
        <Grid container spacing={2} p={1} alignItems="center">
          <Grid xs={12}>
            <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
              {agent_path.map((item, key) => {
                return (
                  <Link
                    key={`userMember${key}`}
                    underline="hover"
                    style={{ color: theme.palette.info.main, cursor: 'pointer' }}
                    onClick={async () => {
                      await Modal.open(AgentDetail, {
                        defaultSearchProps: {
                          username: item.username,
                          pid: item.agent_id.toString(),
                        },
                      });
                    }}
                  >
                    {item.username}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Grid>
        </Grid>
      </CustomizedDialog>
      <ModalContainer controller={Modal} />
    </FormikProvider>
  );
}
