import { useState, useRef, useEffect } from 'react';
import { TbSelectProps, PgListProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
// material-ui
import { Box, Tab, Button } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Grid from '@mui/material/Unstable_Grid2';
//Custom Components
import Header from './feature/Header';
import Agent from './feature/Agent';
import Member from './feature/Member';
import { ParentSearchType, ParentSearchProps } from './index';

export type TabType = 'agent' | 'member';

const Sub = ({
  setStep,
  parentSearch,
  setParentSearch,
  roomList,
  setRoomList,
  pageHocProps = defaultPageHocProps,
}: WithPageHocProps & ParentSearchProps) => {
  const { t } = usePage();
  const [tab, setTab] = useState<string>('agent');

  return (
    <Grid>
      <Header parentSearch={parentSearch} setParentSearch={setParentSearch} setStep={setStep} />
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={(event, newValue) => {
              setTab(newValue);
            }}
          >
            <Tab label={t('sys.agent')} value="agent" />
            <Tab label={t('sys.member')} value="member" />
          </TabList>
        </Box>
        <TabPanel sx={{ padding: 0 }} value="agent">
          <Agent
            setStep={setStep}
            parentSearch={parentSearch}
            setParentSearch={setParentSearch}
            roomList={roomList}
            setRoomList={setRoomList}
          />
        </TabPanel>
        <TabPanel sx={{ padding: 0 }} value="member">
          <Member
            setStep={setStep}
            parentSearch={parentSearch}
            setParentSearch={setParentSearch}
            roomList={roomList}
            setRoomList={setRoomList}
          />
        </TabPanel>
      </TabContext>
    </Grid>
  );
};

export default withPageHoc(Sub);
