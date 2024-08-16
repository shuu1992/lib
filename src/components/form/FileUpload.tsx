import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from '@type/config';
import { MuiFileInput } from 'mui-file-input';
import { CloudUploadOutlined, QuestionOutlined } from '@ant-design/icons';
import {
  FormControl,
  Typography,
  Stack,
  Box,
  FormLabel,
  Avatar,
  FormHelperText,
} from '@mui/material';
import { apiUploadImg } from '@api/Global';
type FileType = 'jpg' | 'png' | 'gif' | 'jpeg' | 'webp';

function FileUpload({
  dirname,
  placeholder,
  limitWidth,
  limitHeight,
  limitSize: limitSize = 3,
  limitType: limitType = ['jpg', 'png', 'webp'],
  value,
  errors,
  disabled = false,
  setValue,
}: {
  dirname: string;
  placeholder?: string;
  limitWidth?: number;
  limitHeight?: number;
  limitSize?: number;
  limitType?: FileType[];
  value: any;
  errors: any;
  disabled?: boolean;
  setValue: (value: string) => void;
}) {
  const { t } = useTranslation();

  const inputFile = useRef<HTMLInputElement>(null);
  const [file, setfile] = React.useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const handleChange = (newValue: File | null) => {
    if (newValue instanceof File) {
      const img = new Image();
      img.src = URL.createObjectURL(newValue);
      img.onload = () => {
        if (limitWidth && img.width > limitWidth) {
          setFileError(t('vt.limitWidth', { num: limitWidth }));
          return;
        }
        if (limitHeight && img.height > limitHeight) {
          setFileError(t('vt.limitHeight', { num: limitHeight }));
          return;
        }
        if (newValue.size > limitSize * 1024 * 1024) {
          setFileError(t('vt.limitSize', { num: limitSize }));
          return;
        }
        fcUpload(newValue);
      };
    }
  };
  async function fcUpload(file: any) {
    try {
      const formData = new FormData();
      formData.append('dirname', dirname);
      formData.append('file', file);
      const { code, data } = await apiUploadImg(formData);
      if (code === 200) {
        const imgSrc = data.filelink;
        setfile((prevState) => file);
        setValue(imgSrc);
      }
    } catch (error) {
      throw error;
    }
  }

  function fcErrMsg() {
    if (fileError) return fileError;
    if (errors) return errors;
    return '';
  }
  function fcAccept() {
    let str = '';
    limitType.forEach((item) => {
      str += `image/${item},`;
    });
    return str;
  }
  function fcInputFileClick() {
    inputFile.current?.click();
  }
  const theme = useTheme();

  return (
    <FormControl fullWidth>
      <FormLabel
        sx={{
          position: 'relative',
          overflow: 'hidden',
          '&:hover .MuiBox-root': { opacity: 1 },
          cursor: 'pointer',
          display: value === null || value === '' ? 'none' : 'block',
        }}
        onClick={fcInputFileClick}
      >
        {value === null || value === '' ? (
          <Avatar variant="square" sx={{ width: '100%', height: '100%', border: '1px dashed' }}>
            <QuestionOutlined />
          </Avatar>
        ) : (
          <Avatar
            variant="square"
            src={`${import.meta.env.VITE_IMG_URL}${value}`}
            sx={{ width: '100%', height: '100%', border: '1px dashed' }}
          />
        )}

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor:
              theme.palette.mode === ThemeMode.DARK
                ? 'rgba(255, 255, 255, .75)'
                : 'rgba(0,0,0,.65)',
            width: '100%',
            height: '100%',
            opacity: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!disabled && (
            <Stack spacing={0.5} alignItems="center">
              <CloudUploadOutlined
                style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }}
              />
              <Typography sx={{ color: 'secondary.lighter' }}>{t('sys.upload')}</Typography>
            </Stack>
          )}
        </Box>
      </FormLabel>

      <MuiFileInput
        fullWidth
        disabled={disabled}
        placeholder={placeholder ? placeholder : t('cp.plzFile')}
        variant="outlined"
        value={file}
        InputProps={{
          startAdornment: null,
          endAdornment: <CloudUploadOutlined />,
        }}
        inputProps={{
          ref: inputFile,
          accept: fcAccept(),
        }}
        onChange={handleChange}
        error={Boolean(errors) || Boolean(fileError)}
        sx={{
          display: value === null || value === '' ? 'block' : 'none',
        }}
      />
      {Boolean(errors) ||
        (Boolean(fileError) && <FormHelperText error>{fcErrMsg()}</FormHelperText>)}
    </FormControl>
  );
}

export default FileUpload;
