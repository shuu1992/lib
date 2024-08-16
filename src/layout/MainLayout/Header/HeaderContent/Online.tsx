import { useTranslation } from 'react-i18next';
import { useSelector } from '@store/index';
import { UserOutlined } from '@ant-design/icons';
import { Badge, Box, Tooltip } from '@mui/material';
import IconButton from '@components/@extended/IconButton';
import { useNavigate } from 'react-router';

const OnlineIcon = () => {
  const { t } = useTranslation();
  const globalState = useSelector((state) => state.global);
  const menuState = useSelector((state) => state.menu);
  const { online } = globalState;
  const { allPermission } = menuState;
  const navigate = useNavigate();
  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Tooltip title={t('sys.onlineCount')}>
        <IconButton
          color="secondary"
          variant="light"
          sx={{ color: 'text.primary' }}
          aria-label="open profile"
          aria-haspopup="true"
          onClick={() => {
            if (!allPermission.includes('user.online')) return;
            navigate('/user/online');
          }}
        >
          <Badge badgeContent={online} max={99999} color="primary">
            <UserOutlined />
          </Badge>
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default OnlineIcon;
