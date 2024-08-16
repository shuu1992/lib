import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import usePage from '@hooks/usePage';
import clsx from 'clsx';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import { styled, useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useModalWindow } from 'react-modal-global';
// mui icons
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
// ant-design
import { SvgIconProps } from '@mui/material/SvgIcon';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Root,
  TreeItem2GroupTransition,
} from '@mui/x-tree-view/TreeItem2';
import {
  unstable_useTreeItem2 as useTreeItem,
  UseTreeItem2Parameters,
} from '@mui/x-tree-view/useTreeItem2';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { Typography, Button, Stack, Tooltip } from '@mui/material';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';
import { useTranslation } from 'react-i18next';
import { ModalController, ModalContainer } from 'react-modal-global';
import { IResTree } from '@api/UserAgent/res';
import { ParentSearchProps, ParentSearchType } from '../index';

const Modal = new ModalController();

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

interface StyledTreeItemProps
  extends Omit<UseTreeItem2Parameters, 'rootRef'>,
    React.HTMLAttributes<HTMLLIElement> {
  bgColor?: string;
  bgColorForDarkMode?: string;
  color?: string;
  colorForDarkMode?: string;
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  node: any;
  nodeList: any[];
  fetchData: () => Promise<void>;
  setSelectId: (id: number) => void;
}

const CustomTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  marginBottom: theme.spacing(0.3),
  color: theme.palette.text.secondary,
  borderRadius: theme.spacing(0.5),
  paddingRight: theme.spacing(0.5),
  fontWeight: theme.typography.fontWeightMedium,
  '&.expanded': {
    fontWeight: theme.typography.fontWeightRegular,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.focused, &.selected, &.selected.focused': {
    backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
    color: 'var(--tree-view-color)',
  },
}));

const CustomTreeItemIconContainer = styled(TreeItem2IconContainer)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const CustomTreeItemGroupTransition = styled(TreeItem2GroupTransition)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  [`& .content`]: {
    paddingLeft: theme.spacing(2),
  },
  borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
}));

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: StyledTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    id,
    itemId,
    label,
    disabled,
    children,
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    colorForDarkMode,
    bgColorForDarkMode,
    node,
    nodeList,
    fetchData,
    setSelectId,
    ...other
  } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  const style = {
    '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
    '--tree-view-bg-color': theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
  };

  return (
    <TreeItem2Provider itemId={itemId}>
      <CustomTreeItemRoot {...getRootProps({ ...other, style })}>
        <CustomTreeItemContent
          {...getContentProps({
            className: clsx('content', {
              expanded: status.expanded,
              selected: status.selected,
              focused: status.focused,
            }),
          })}
        >
          <CustomTreeItemIconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </CustomTreeItemIconContainer>
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              alignItems: 'center',
              p: 0.5,
              pr: 0,
            }}
            onClick={() => {
              setSelectId(node.id);
            }}
          >
            <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
            <Typography
              {...getLabelProps({
                variant: 'body2',
                sx: {
                  display: 'flex',
                  fontWeight: 'inherit',
                  flexGrow: 1,
                  color:
                    node.children.length > 0
                      ? theme.palette.error.main
                      : theme.palette.primary.main,
                },
              })}
            />
          </Box>
        </CustomTreeItemContent>
        {children && <CustomTreeItemGroupTransition {...getGroupTransitionProps()} />}
      </CustomTreeItemRoot>
    </TreeItem2Provider>
  );
});

function ExpandIcon(props: React.PropsWithoutRef<typeof AddBoxRoundedIcon>) {
  return <AddBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}

function CollapseIcon(props: React.PropsWithoutRef<typeof IndeterminateCheckBoxRoundedIcon>) {
  return <IndeterminateCheckBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}

function EndIcon(props: React.PropsWithoutRef<typeof DisabledByDefaultRoundedIcon>) {
  return <DisabledByDefaultRoundedIcon {...props} sx={{ opacity: 0.3 }} />;
}

const renderAgent = (
  nodeList: any[],
  setSelectId: (id: number) => void,
  fetchData: () => Promise<void>,
): ReactNode => {
  const theme = useTheme();
  return nodeList.map((node) => (
    <CustomTreeItem
      node={node}
      nodeList={nodeList}
      key={`${node.id}`}
      itemId={`${node.id}`}
      label={`${node.username}`}
      labelIcon={node.children.length > 0 ? GroupsIcon : PersonIcon}
      labelInfo={`${node.id}`}
      fetchData={fetchData}
      setSelectId={setSelectId}
    >
      {node.children.length > 0 && renderAgent(node.children, setSelectId, fetchData)}
    </CustomTreeItem>
  ));
};

export default function UserAgentTreeView({
  dataList,
  parentSearch,
  step,
  setStep,
  setParentSearch,
  fetchData,
}: ParentSearchProps & { dataList: IResTree[]; fetchData: () => Promise<void> }) {
  const modal = useModalWindow();
  const { t, fcShowMsg } = usePage();
  const [selectId, setSelectId] = useState<number | null>(null);
  const fcCloseDialog = () => {
    modal.close();
  };
  function fcExpandAll(data: any[]) {
    let result: string[] = [];
    data.forEach((item: any) => {
      result.push(`${item.id}`);
      if (item.children) {
        result = result.concat(fcExpandAll(item.children));
      }
    });
    return result;
  }
  return (
    <CustomizedDialog
      flag={!modal.closed}
      title={t('userAgent.agentTreeView')}
      className={'sm'}
      confirmCfg={{
        flag: true,
        txt: t('sys.confirm'),
        fcConfirm: async () => {
          setParentSearch((prevState) => ({
            ...prevState,
            nopid: '',
            pid: selectId || '',
            username: '',
          }));
          setStep('sub');
          fcCloseDialog();
        },
      }}
      fcChangeDialog={fcCloseDialog}
    >
      <SimpleTreeView
        slots={{
          expandIcon: ExpandIcon,
          collapseIcon: CollapseIcon,
          endIcon: EndIcon,
        }}
        sx={{ flexGrow: 1, maxWidth: '100%' }}
        defaultExpandedItems={fcExpandAll(dataList)}
      >
        {renderAgent(dataList, setSelectId, fetchData)}
      </SimpleTreeView>
      <ModalContainer controller={Modal} />
    </CustomizedDialog>
  );
}
