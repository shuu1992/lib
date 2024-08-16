import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
// material-ui
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Dialog,
  Divider,
  DialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
// project import
import IconButton from '@components/@extended/IconButton';
import Loader from '@components/loading/Circle';
// assets
import { CloseOutlined } from '@ant-design/icons';

// ==============================|| CUSTOMIZED - CONTENT ||============================== //

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1.5),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1.25),
    paddingRight: theme.spacing(2),
  },
}));

// ==============================|| CUSTOMIZED - TITLE ||============================== //

export interface DialogTitleProps {
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = ({ children, onClose, ...other }: DialogTitleProps) => (
  <DialogTitle sx={{ m: 0, p: 1.5 }} {...other}>
    {children}
    {onClose ? (
      <IconButton
        aria-label="close"
        onClick={onClose}
        color="secondary"
        sx={{
          position: 'absolute',
          right: 10,
          top: 17,
        }}
      >
        <CloseOutlined />
      </IconButton>
    ) : null}
  </DialogTitle>
);

const BootstrapDialogContent = ({ children }: { children?: ReactNode }) => (
  <DialogContent dividers sx={{ p: 1, maxHeight: '70vh' }}>
    {children}
  </DialogContent>
);

// ==============================|| DIALOG - CUSTOMIZED ||============================== //

export default function CustomizedDialogs({
  children,
  className = 'sm', //lg xl
  flag = false,
  title,
  confirmCfg = { flag: true, fcConfirm: Promise.resolve },
  cancelCfg = { flag: true },
  fcChangeDialog,
}: {
  children?: ReactNode;
  className?: DialogProps['maxWidth'];
  flag?: boolean;
  title?: string;
  confirmCfg?: {
    flag: boolean;
    txt?: string;
    fcConfirm?: () => Promise<void>;
  };
  cancelCfg?: {
    flag: boolean;
    txt?: string;
  };
  fcChangeDialog: (flag: boolean) => void;
}) {
  const { t } = useTranslation();
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>(className);
  const [loadingFlag, setLoadingFlag] = useState(false);
  const fcCloseDialog = () => {
    fcChangeDialog(false);
  };
  const fcConfirm = async () => {
    try {
      if (confirmCfg.fcConfirm) {
        await confirmCfg.fcConfirm();
        setLoadingFlag(true);
        setTimeout(() => {
          setLoadingFlag(false);
        }, 1500);
      }
    } catch (error: any) {
      setLoadingFlag(false);
      throw error;
    }
  };
  return (
    <Dialog fullWidth={true} maxWidth={maxWidth} open={flag}>
      {loadingFlag && <Loader />}
      <Box sx={{ py: 1 }}>
        <BootstrapDialogTitle onClose={fcCloseDialog}>{title}</BootstrapDialogTitle>
        <Divider />
        <BootstrapDialogContent>{children}</BootstrapDialogContent>
        <Divider />
        <DialogActions>
          {cancelCfg.flag && (
            <Button variant="outlined" color="error" onClick={fcCloseDialog}>
              {cancelCfg.txt ? cancelCfg.txt : t('sys.cancel')}
            </Button>
          )}
          {confirmCfg.flag && (
            <Button variant="contained" onClick={fcConfirm}>
              {confirmCfg.txt ? confirmCfg.txt : t('sys.confirm')}
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
}
