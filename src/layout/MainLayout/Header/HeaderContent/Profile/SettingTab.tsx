import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
// ant-design
import { QuestionCircleOutlined } from '@ant-design/icons';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

const SettingTab = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton>
        <ListItemIcon>
          <QuestionCircleOutlined />
        </ListItemIcon>
        <ListItemText
          primary={t('sys.support')}
          onClick={() => {
            navigate('/comingsoon');
          }}
        />
      </ListItemButton>
    </List>
  );
};

export default SettingTab;
