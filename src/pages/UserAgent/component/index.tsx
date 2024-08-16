import { useEffect, useState } from 'react';
import usePage from '@hooks/usePage';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Grid from '@mui/material/Unstable_Grid2';
//Custom Components
import Header from './Header';
import Agent from './Agent';
import Member from './Member';
export type TabType = 'agent' | 'member';
export interface IComAgnetSearchProps {
  pid?: string;
  username?: string;
}
export interface ParentSearchType {
  pid: string;
}
export interface ParentSearchProps {
  parentSearch: ParentSearchType;
  setParentSearch: (cb: (value: ParentSearchType) => ParentSearchType) => void;
}

const ComponentAgent = ({ defaultSearchProps }: { defaultSearchProps: IComAgnetSearchProps }) => {
  const theme = useTheme();
  const { t, fcShowMsg } = usePage();
  const [tab, setTab] = useState<string>('agent');
  const [parentSearch, setParentSearch] = useState({
    pid: defaultSearchProps.pid ? defaultSearchProps.pid : '',
  });

  return (
    <Grid>
      <Header parentSearch={parentSearch} setParentSearch={setParentSearch} />
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
          <Agent parentSearch={parentSearch} setParentSearch={setParentSearch} />
        </TabPanel>
        <TabPanel sx={{ padding: 0 }} value="member">
          <Member parentSearch={parentSearch} setParentSearch={setParentSearch} />
        </TabPanel>
      </TabContext>
    </Grid>
  );
};

export default ComponentAgent;
