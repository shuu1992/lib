import { useState, useRef, useEffect } from 'react';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import useAuth from '@hooks/useAuth';
import { apiTreeView } from '@src/api/UserAgent';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
//Custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import LoadingButton from '@components/@extended/LoadingButton';
import SearchOutLine from '@components/search/InputOutline';
import Home from './feature/Home';
import Sub from './feature/Sub';
import TreeView from './feature/TreeView';
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
      <Grid container xs={12} spacing={2.5} sx={{ mt: 1, mb: 1 }}>
        <Grid xs={12} md={3}>
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
        <Grid xs={12} md={1}>
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
        <Grid xs={12} md={1.5}>
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
                    dataList: data,
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
