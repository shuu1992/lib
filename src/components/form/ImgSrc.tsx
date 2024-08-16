import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from '@type/config';
import { QuestionOutlined, EyeOutlined } from '@ant-design/icons';
import { FormControl, Typography, Stack, Box, FormLabel, Avatar } from '@mui/material';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

function FileUpload({ value }: { value: any }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <FormControl fullWidth>
      <FormLabel
        sx={{
          position: 'relative',
          overflow: 'hidden',
          '&:hover .MuiBox-root': { opacity: 1 },
          cursor: 'pointer',
        }}
      >
        {value === '' || value === null ? (
          <Avatar
            variant="square"
            sx={{
              width: '100%',
              height: '100%',
              minHeight: '50px',
            }}
          >
            <QuestionOutlined />
          </Avatar>
        ) : (
          <Avatar
            variant="square"
            src={`${import.meta.env.VITE_IMG_URL}${value}`}
            sx={{
              width: '100%',
              height: '100%',
              minHeight: '70px',
            }}
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
          <Stack
            spacing={0.5}
            alignItems="center"
            onClick={() => {
              setOpen(true);
            }}
          >
            <EyeOutlined style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
          </Stack>
        </Box>
      </FormLabel>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: `${import.meta.env.VITE_IMG_URL}${value}` }]}
        render={{
          iconNext: () => null,
          iconPrev: () => null,
        }}
      />
    </FormControl>
  );
}

export default FileUpload;
