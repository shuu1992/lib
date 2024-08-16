import { ChangeEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';

// project import
import MainCard from '@components/MainCard';
import useConfig from '@hooks/useConfig';

import { FontFamily } from '@type/config';

// ==============================|| CUSTOMIZATION - FONT FAMILY ||============================== //

const ThemeFont = () => {
  const theme = useTheme();

  const { fontFamily, onChangeFontFamily } = useConfig();

  const handleFontChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeFontFamily(event.target.value as FontFamily);
  };

  const fonts = [
    {
      id: 'microsoft',
      value: `'Microsoft JhengHei',Microsoft Yahei,Helvetica,Hiragino Sans GB,Arial, sans-serif, serif`,
      label: 'Microsoft',
    },
    {
      id: 'inter',
      value: `'Inter', Courier, sans-serif, serif`,
      label: 'Inter',
    },
    {
      id: 'roboto',
      value: `'Roboto', Courier, sans-serif, serif`,
      label: 'Roboto',
    },
    {
      id: 'poppins',
      value: `'Poppins', Courier, sans-serif, serif`,
      label: 'Poppins',
    },
    {
      id: 'public-sans',
      value: `'Public Sans', Courier, sans-serif, serif`,
      label: 'Public Sans',
    },
  ];

  return (
    <RadioGroup
      row
      aria-label="payment-card"
      name="payment-card"
      value={fontFamily}
      onChange={handleFontChange}
    >
      <Grid container spacing={1.75} sx={{ ml: 0 }}>
        {fonts.map((item, index) => (
          <Grid item key={index} xs={4}>
            <FormControlLabel
              control={<Radio value={item.value} sx={{ display: 'none' }} />}
              sx={{ display: 'flex', '& .MuiFormControlLabel-label': { flex: 1 } }}
              label={
                <MainCard
                  content={false}
                  sx={{
                    bgcolor: fontFamily === item.value ? 'primary.lighter' : 'secondary.lighter',
                    p: 1,
                  }}
                  border={false}
                  {...(fontFamily === item.value && {
                    boxShadow: true,
                    shadow: theme.customShadows.primary,
                  })}
                >
                  <Box
                    sx={{
                      minWidth: 60,
                      bgcolor: 'background.paper',
                      p: 1,
                      '&:hover': { bgcolor: 'background.paper' },
                    }}
                  >
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5" color="textPrimary" sx={{ fontFamily: item.value }}>
                        Aa
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.label}
                      </Typography>
                    </Stack>
                  </Box>
                </MainCard>
              }
            />
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
};

export default ThemeFont;
