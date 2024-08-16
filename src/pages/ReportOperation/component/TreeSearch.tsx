import { useEffect, useState } from 'react';
import { apiTreeView } from '@src/api/UserAgent';
import { IResTree } from '@api/UserAgent/res';
import { TbSelectProps } from '@type/page';
// material-ui
import { styled } from '@mui/material/styles';
import { Chip, Paper, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@components/@extended/LoadingButton';
// custom Components
import { useTranslation } from 'react-i18next';
import { ModalController, ModalContainer } from 'react-modal-global';
import TreeView from './TreeView';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const Modal = new ModalController();

const TreeSearch = ({
  treeAgent,
  setTreeAgent,
}: {
  treeAgent: { agent_paths: string };
  setTreeAgent: any;
}) => {
  const { t } = useTranslation();
  const [treeData, setTreeData] = useState<IResTree[]>([]);
  const [treeAryData, setTreeAryData] = useState<TbSelectProps[]>([]);
  const [selectedData, setSelectedData] = useState<TbSelectProps[]>([]); // 預選

  const handleDelete = (chipToDelete: TbSelectProps) => () => {
    setSelectedData((chips) => chips.filter((chip) => chip.value !== chipToDelete.value));
  };

  const fcConverTreeArt = (data: IResTree[]): TbSelectProps[] => {
    const result: { value: string; text: string }[] = [];

    function traverse(node: IResTree) {
      result.push({
        value: node.id.toString(),
        text: node.username,
      });

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          traverse(child);
        });
      }
    }

    data.forEach((node) => traverse(node));
    return result;
  };

  const fcInit = async () => {
    try {
      const { code, data } = await apiTreeView();
      if (code === 200) {
        const treeAry = fcConverTreeArt(data);
        setTreeAryData(treeAry);
        setTreeData(data);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fcInit();
  }, []);

  useEffect(() => {
    if (treeAgent.agent_paths === '') {
      setSelectedData([]);
      return;
    }
    const defaultSelected: string[] = treeAgent.agent_paths.split(',');
    const ary = treeAryData.filter((item) => defaultSelected.includes(item.value));
    setSelectedData(ary);
  }, [treeAgent.agent_paths]);

  useEffect(() => {
    setTreeAgent((prevState: any) => ({
      ...prevState,
      agent_paths: selectedData.map((item) => item.value).join(','),
    }));
  }, [selectedData]);

  return (
    <Grid container spacing={2.5} alignItems="center">
      <Grid xs={8}>
        <Paper
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 0.5,
            m: 0,
            minHeight: 40,
          }}
          component="ul"
        >
          {selectedData.map((data) => {
            return (
              <ListItem key={data.value}>
                <Chip label={data.text} onDelete={handleDelete(data)} />
              </ListItem>
            );
          })}
        </Paper>
      </Grid>
      <Grid xs={2}>
        <Button
          color="error"
          variant="contained"
          fullWidth
          onClick={() => {
            setSelectedData([]);
          }}
        >
          {t('sys.del')}
        </Button>
      </Grid>
      <Grid xs={2}>
        <LoadingButton
          color="primary"
          variant="contained"
          fullWidth
          onClick={async () => {
            await Modal.open(TreeView, {
              dataList: treeData,
              treeAgent,
              setTreeAgent,
            });
          }}
        >
          {t('report.agentSearch')}
        </LoadingButton>
      </Grid>
      <ModalContainer controller={Modal} />
    </Grid>
  );
};

export default TreeSearch;
