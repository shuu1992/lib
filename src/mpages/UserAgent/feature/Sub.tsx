import { useState } from 'react';
import usePage from '@hooks/usePage';
import { useSelector } from '@store/index';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Grid from '@mui/material/Unstable_Grid2';
//Custom Components
import { StepType, ParentSearchProps } from '../index';
import Header from './Header';
import Agent from '../agent';
import SubAgent from '../subagent';
import Member from '../member';
export type TabType = 'agent' | 'subagent' | 'member';

const Sub = ({ parentSearch, step, setStep, setParentSearch }: ParentSearchProps) => {
  const theme = useTheme();
  const { t, fcShowMsg } = usePage();
  const menuState = useSelector((state) => state.menu);
  const { allPermission } = menuState;
  const [tab, setTab] = useState<string>('agent');

  return (
    <Grid>
      <Header
        parentSearch={parentSearch}
        step={step as StepType}
        setStep={setStep}
        setParentSearch={setParentSearch}
      />
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={(event, newValue) => {
              setTab(newValue);
            }}
          >
            <Tab label={t('sys.agent')} value="agent" />
            {allPermission.includes('user.index') && <Tab label={t('sys.member')} value="member" />}
            <Tab label={t('sys.subacc')} value="subagent" />
          </TabList>
        </Box>
        <TabPanel sx={{ padding: 0 }} value="agent">
          <Agent
            parentSearch={parentSearch}
            step={step}
            setStep={setStep}
            setParentSearch={setParentSearch}
          />
        </TabPanel>
        <TabPanel sx={{ padding: 0 }} value="member">
          <Member
            parentSearch={parentSearch}
            step={step}
            setStep={setStep}
            setParentSearch={setParentSearch}
          />
        </TabPanel>
        <TabPanel sx={{ padding: 0 }} value="subagent">
          <SubAgent
            parentSearch={parentSearch}
            step={step}
            setStep={setStep}
            setParentSearch={setParentSearch}
          />
        </TabPanel>
      </TabContext>
    </Grid>
  );
};

export default Sub;
