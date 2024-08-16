import { useState, useRef, useEffect } from 'react';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import useAuth from '@hooks/useAuth';
import { apiTreeView } from '@src/api/UserAgent';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//Custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import TreeView from '@pages/UserAgent/feature/TreeView';
import LoadingButton from '@components/@extended/LoadingButton';
import SearchOutLine from '@components/search/InputOutline';
import Sub from './feature/Sub';
import Home from './feature/Home';

export type StepType = 'home' | 'sub';

export interface RefType {
  fcGetList: ({ pageIndex, pageSize, searchCfg }: PgListProps) => void;
}
export interface ParentSearchType {
  pid: number | string;
  nopid: number | string;
  username: string;
  forceUpdate: number;
}

export interface ParentSearchProps {
  parentSearch: ParentSearchType;
  step: StepType | string;
  setStep: (step: StepType) => void;
  setParentSearch: (cb: (value: ParentSearchType) => ParentSearchType) => void;
}

const Modal = new ModalController();
const UserAgnet = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
  const homeRef = useRef<RefType>(null);
  const {
    theme,
    menuState,
    globalState,
    dataList,
    setDataList,
    loadingFlag,
    setLoadingFlag,
    pgCfg,
    setPgCfg,
    tSearchCfg,
    setTSearchCfg,
    editLoading,
    setEditLoading,
  } = pageHocProps;
  const { authState } = useAuth();
  const { t, fcShowMsg } = usePage();
  const [step, setStep] = useState('');
  const [parentSearch, setParentSearch] = useState<ParentSearchType>({
    nopid: '',
    pid: '',
    username: '',
    forceUpdate: 0,
  }); // 父層搜尋條件

  useEffect(() => {
    if (authState.user?.backstage === 2) {
      setStep('sub');
    } else {
      setStep('home');
    }
  }, []);

  return (
    <div>
      <Grid container xs={12} my={1}>
        <Grid xs={12}>
          <Accordion style={{ border: 'none ' }}>
            <AccordionSummary aria-controls="panel-content" id="panel-header" expandIcon={null}>
              <Grid xs={12} display="flex" justifyContent="space-between">
                <Typography>
                  {t('sys.username')}
                  {t('sys.search')}/ {t('userAgent.treeviewSearch')}
                </Typography>
                <ExpandMoreIcon />
              </Grid>
            </AccordionSummary>
            <AccordionDetails style={{ border: 'none ' }}>
              <Grid xs={12} my={1}>
                <SearchOutLine
                  placeholder={t('sys.username')}
                  value={parentSearch.username || ''}
                  setValue={(value: string) => {
                    setParentSearch((prevState) => ({
                      ...prevState,
                      username: value,
                    }));
                  }}
                />
              </Grid>
              <Grid xs={12}>
                <LoadingButton
                  loading={editLoading === 0}
                  variant="contained"
                  fullWidth
                  onClick={async () => {
                    setEditLoading(0);
                    if (step === 'sub') {
                      setStep('home');
                    }
                    setParentSearch((prevState) => ({
                      ...prevState,
                      nopid: parentSearch.username ? 1 : '',
                      pid: '',
                      username: parentSearch.username,
                    }));
                    await new Promise((r) => setTimeout(r, 100));
                    homeRef.current?.fcGetList({
                      pageIndex: 0,
                      pageSize: pgCfg.pageSize,
                      searchCfg: {},
                    });
                    setEditLoading(null);
                  }}
                >
                  {t('sys.search')}
                </LoadingButton>
              </Grid>
              <Grid xs={12} my={1}>
                <LoadingButton
                  loading={editLoading === 0}
                  color="error"
                  variant="contained"
                  fullWidth
                  onClick={async () => {
                    try {
                      setEditLoading(0);
                      const { code, data } = await apiTreeView();
                      if (code === 200) {
                        setEditLoading(null);
                        await Modal.open(TreeView, {
                          treeView: data,
                          parentSearch,
                          step,
                          setStep,
                          setParentSearch,
                          fetchData: async () => {
                            homeRef.current?.fcGetList({
                              pageIndex: 0,
                              pageSize: pgCfg.pageSize,
                              searchCfg: {},
                            });
                          },
                        });
                      }
                    } catch (error: any) {
                      fcShowMsg({ type: 'error', msg: error.message });
                      setEditLoading(null);
                    }
                  }}
                >
                  {t('userAgent.treeviewSearch')}
                </LoadingButton>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
      {step === 'home' && (
        <Home
          refs={homeRef}
          parentSearch={parentSearch}
          step={step}
          setStep={setStep}
          setParentSearch={setParentSearch}
        />
      )}
      {step === 'sub' && (
        <Sub
          parentSearch={parentSearch}
          step={step}
          setStep={setStep}
          setParentSearch={setParentSearch}
        />
      )}
      <ModalContainer controller={Modal} />
    </div>
  );
};

export default withPageHoc(UserAgnet);
