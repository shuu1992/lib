import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
// assets
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { dispatch } from '@store/index';
import { actionResetSelectedItem } from '@store/reducers/menu';
interface Props {
  handleLogout: () => void;
}

const ProfileTab = ({ handleLogout }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText
          primary={t('sys.viewProfile')}
          onClick={() => {
            dispatch(actionResetSelectedItem());
            navigate('/profile/user');
          }}
        />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          handleLogout();
        }}
      >
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary={t('sys.logout')} />
      </ListItemButton>
    </List>
  );
};

export default ProfileTab;
