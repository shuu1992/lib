import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ p: '24px 16px 0px', mt: '2rem' }}
    >
      {/* <Typography variant="caption">&copy; {t('sys.reserved')}</Typography> */}
      {/* <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center">
        <Link component={RouterLink} to="#" target="_blank" variant="caption" color="textPrimary">
          {t('sys.about')}
        </Link>
        <Link component={RouterLink} to="#" target="_blank" variant="caption" color="textPrimary">
          {t('sys.privacy')}
        </Link>
        <Link component={RouterLink} to="#" target="_blank" variant="caption" color="textPrimary">
          {t('sys.terms')}
        </Link>
      </Stack> */}
    </Stack>
  );
};

export default Footer;
