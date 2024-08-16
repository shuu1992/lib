import { useEffect, useState } from 'react';
import { dispatch, useSelector } from '@store/index';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { actionDelHistoryItem, actionSelectedItem } from '@store/reducers/menu';
// material-ui
import { Tabs, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import Grid from '@mui/material/Unstable_Grid2';
import { CloseOutlined } from '@ant-design/icons';
// custom
import { useAliveController } from 'react-activation';

export default function CustomizedTabs() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [value, setValue] = useState<string>('menuTab-dashboard1');
  const menuState = useSelector((state) => state.menu);
  const { selectedItem, historySelect } = menuState;
  const { refresh } = useAliveController();

  useEffect(() => {
    if (selectedItem === null) {
      return;
    }
    setValue(`menuTab-${selectedItem.id}`);
  }, [selectedItem]);

  return (
    <Grid container sx={{ width: '100%' }}>
      <TabContext value={value}>
        <Tabs value={value} variant="scrollable" scrollButtons="auto">
          {historySelect.map((item) => {
            const tabName = t(item.title);
            let delIconFlag = false;
            if (selectedItem !== null) {
              delIconFlag = item.id !== 'dashboard1';
            }
            return (
              <Tab
                key={item.id}
                label={tabName}
                icon={
                  delIconFlag ? (
                    <CloseOutlined
                      style={{ zIndex: 50 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedItem.id === item.id) {
                          const lastSecHistoryItem = historySelect[historySelect.indexOf(item) - 1];
                          setValue(`menuTab-${lastSecHistoryItem.id}`);
                          refresh(item.url);
                          navigate(lastSecHistoryItem.url);
                        }
                        refresh(item.url);
                        dispatch(actionDelHistoryItem(item.id));
                      }}
                    />
                  ) : (
                    <></>
                  )
                }
                iconPosition="end"
                value={`menuTab-${item.id}`}
                onClick={() => {
                  navigate(item.url);
                }}
              />
            );
          })}
        </Tabs>
      </TabContext>
    </Grid>
  );
}
