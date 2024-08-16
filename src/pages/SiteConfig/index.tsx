import React, { useState, useMemo, useEffect } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { WithPageHocProps, withPageHoc, defaultPageHocProps } from '@hocs/PageHoc';
import usePage from '@hooks/usePage';
import { apiList, apiEdit } from '@api/SiteConfig';
import { IList, IInfo, IAdd, IEdit, IDel } from '@api/SiteConfig/req';
import { IResInfo } from '@api/SiteConfig/res';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Tabs, Tab, Tooltip } from '@mui/material';
// ant-design
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';
import EditTable from '@components/muiTable/Edit';
import LoadingButton from '@components/@extended/LoadingButton';
import Add from './feature/Add';
import Del from './feature/Del';
const Modal = new ModalController();

const SiteConfig = ({ pageHocProps = defaultPageHocProps }: WithPageHocProps) => {
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
  const { allPermission } = menuState;
  const { t, fcShowMsg } = usePage();
  const [groupList, setGroupList] = useState<TbSelectProps[]>([]);
  const [typeList, setTypeList] = useState<TbSelectProps[]>([]);
  const [tab, setTab] = useState(0); //tab
  const [tabList, setTabList] = useState<IResInfo[]>([]);
  const columns = useMemo(
    () => [
      {
        Header: t('sys.id'),
        accessor: 'id',
      },
      {
        Header: t('sys.type'),
        accessor: 'type',
        Cell: ({ row }: any) => {
          const type = row.values.type;
          const typeObj = typeList.find((item) => item.value == type);
          return <div>{typeObj?.text}</div>;
        },
      },
      {
        Header: t('siteConfig.skey'),
        accessor: 'skey',
        dataType: 'text',
      },
      {
        Header: t('siteConfig.svalue'),
        accessor: 'svalue',
        dataType: 'row',
      },
      {
        Header: t('siteConfig.info'),
        accessor: 'info',
        dataType: 'text',
      },
      {
        Header: t('sys.sort'),
        accessor: 'sort',
        dataType: 'text',
      },
    ],
    [t, theme, allPermission, groupList, typeList],
  );

  const fcGetList = async () => {
    setLoadingFlag(true);
    try {
      const { data, refer } = await apiList();
      const groupAry: TbSelectProps[] = Object.entries(refer.groupid).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      const typeAry: TbSelectProps[] = Object.entries(refer.type).map(
        ([value, name]): TbSelectProps => ({
          text: name as string,
          value: value,
        }),
      );
      //Search Cfg
      setGroupList(groupAry);
      setTypeList(typeAry);
      //Base setting
      setDataList((prevState: IResInfo[]) => data);
      setLoadingFlag(false);
    } catch (error: any) {
      setLoadingFlag(false);
      throw error;
    }
  };

  const fcChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  function fcA11yProps(index: number) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }
  async function fcEdit(postData: IEdit) {
    try {
      const { code } = await apiEdit(postData);
      if (code === 200) {
        await fcShowMsg({ type: 'success', msg: t('sys.editSuc') });
      }
    } catch (error: any) {
      fcShowMsg({ type: 'error', msg: error.message });
      throw error;
    }
  }
  useEffect(() => {
    fcGetList();
  }, [t]);

  useEffect(() => {
    const tabList = dataList.filter((item: any) => {
      return item.groupid == tab + 1;
    });
    setTabList(tabList);
  }, [tab, dataList]);

  return (
    <Grid>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Grid container>
            <Grid xs={10}>
              <Tabs value={tab} onChange={fcChangeTab}>
                {groupList.map((item, index) => (
                  <Tab label={item.text} key={index} {...fcA11yProps(index)} />
                ))}
              </Tabs>
            </Grid>
            <Grid xs={2} sx={{ display: 'flex' }} justifyContent="flex-end">
              {/* Refresh */}
              <Tooltip title={t('sys.refresh')}>
                <LoadingButton shape="rounded" color="primary" onClick={fcGetList}>
                  <SyncOutlined spin={loadingFlag} />
                </LoadingButton>
              </Tooltip>
              {/* Add */}
              <Tooltip title={t('sys.add')}>
                <LoadingButton
                  shape="rounded"
                  color="success"
                  onClick={() => {
                    Modal.open(Add, {
                      groupList,
                      typeList,
                      dataList,
                      fetchData: async () => {
                        fcGetList();
                      },
                    });
                  }}
                >
                  <PlusOutlined />
                </LoadingButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
        {groupList.map((item, index) => {
          return (
            <div
              role="tabpanel"
              hidden={tab !== index}
              id={`tabpanel-${index}`}
              aria-labelledby={`tab-${index}`}
              key={index}
            >
              <EditTable
                columns={columns}
                data={tabList}
                setData={setTabList}
                fcEdit={fcEdit}
                fcDel={(postData: any) => {
                  Modal.open(Del, {
                    id: postData.id,
                    fetchData: async () => {
                      fcGetList();
                    },
                  });
                }}
              />
            </div>
          );
        })}
      </Box>
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default withPageHoc(SiteConfig);
