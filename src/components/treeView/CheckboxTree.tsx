import { useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';
import { TreeItem, SimpleTreeView } from '@mui/x-tree-view';

import { DownOutlined, RightOutlined } from '@ant-design/icons';

export interface RenderTree {
  id: string | number;
  pid?: string | number;
  name: string;
  children?: RenderTree[];
}
const bfsSearch = (graph: any, targetId: any) => {
  const queue = [...graph];

  while (queue.length > 0) {
    const currNode = queue.shift();
    if (currNode.id === targetId) {
      return currNode;
    }
    if (currNode.children) {
      queue.push(...currNode.children);
    }
  }
  return []; // Target node not found
};

const CheckboxTree = ({
  data,
  defaultExpandAry,
  expandAll,
  defaultSelect,
  fcGetSelected,
}: {
  data: RenderTree[];
  defaultExpandAry?: string[];
  expandAll?: boolean;
  defaultSelect: number[];
  fcGetSelected: (selectedNodes: never[]) => void;
}) => {
  const [selectedNodes, setSelectedNodes] = useState([]);
  // useEffect(() => {
  //   setSelectedNodes((prevSelectedNodes) =>
  //     [...prevSelectedNodes].concat(defaultSelect as never[]),
  //   );
  // }, []);
  useEffect(() => {
    if (JSON.stringify(selectedNodes) !== JSON.stringify(defaultSelect)) {
      setSelectedNodes(defaultSelect as never[]);
    } else {
      // console.log('selectedNodes', selectedNodes);
      // console.log('defaultSelect', defaultSelect);
      return;
    }
  }, [defaultSelect]);

  useEffect(() => {
    fcGetSelected(selectedNodes);
  }, [selectedNodes]);

  function fcExpandAll(data: any[]) {
    let result: string[] = [];
    data.forEach((item: any) => {
      result.push(item.id.toString());
      if (item.children) {
        result = result.concat(fcExpandAll(item.children));
      }
    });

    return result;
  }

  // Retrieve all ids from node to his children's
  function getAllIds(node: any, idList = []) {
    idList.push(node.id as never);
    if (node.children) {
      node.children.forEach((child: any) => getAllIds(child, idList));
    }
    return idList;
  }
  // Get IDs of all children from specific node
  const getAllChild = (id: any) => {
    return getAllIds(bfsSearch(data, id));
  };

  // Get all father IDs from specific node
  const getAllFathers = (id: string | number): any[] => {
    const list: any[] = [];
    const node = bfsSearch(data, id);
    if (node.parent) {
      list.push(node.parent);
      return getAllFathers(node.parent);
    }

    return list;
  };

  function isAllChildrenChecked(node: any, list: any) {
    const allChild = getAllChild(node.id);
    const nodeIdIndex = allChild.indexOf(node.id as never);
    allChild.splice(nodeIdIndex, 1);

    return allChild.every((nodeId) => selectedNodes.concat(list).includes(nodeId));
  }

  const handleNodeSelect = (event: any, nodePid: never, nodeId: never) => {
    event.stopPropagation();
    const allChild = getAllChild(nodeId);
    const fathers = getAllFathers(nodeId) as [];
    if (selectedNodes.includes(nodeId)) {
      // Need to de-check
      setSelectedNodes((prevSelectedNodes) =>
        prevSelectedNodes.filter((id) => !allChild.concat(fathers).includes(id)),
      );
    } else {
      // Need to check

      const parentIds = findParentIDs(data, nodePid).filter((el) => el !== undefined);
      const ToBeChecked = allChild.concat(parentIds as never[]);
      for (let i = 0; i < fathers.length; ++i) {
        if (isAllChildrenChecked(bfsSearch(data, fathers[i]), ToBeChecked)) {
          ToBeChecked.push(fathers[i]);
        }
      }
      setSelectedNodes((prevSelectedNodes) => [...prevSelectedNodes].concat(ToBeChecked));
    }
  };
  function findParentIDs(array: RenderTree[], id: number, parentIDs: number[] = []): number[] {
    for (let i = 0; i < array.length; i++) {
      const item: any = array[i];
      if (typeof item === 'object' && item !== null) {
        if (item.hasOwnProperty('id') && item.id === id) {
          return [...parentIDs, id];
        }

        const nestedParentIDs = findParentIDs(Object.values(item), id, [...parentIDs, item.id]);
        if (nestedParentIDs.length > 0) {
          return nestedParentIDs;
        }
      }
    }

    return [];
  }
  const handleExpandClick = (event: any) => {
    // prevent the click event from propagating to the checkbox
    event.stopPropagation();
  };

  const renderTree = (nodes: RenderTree) => (
    <TreeItem
      key={nodes.id}
      itemId={nodes.id.toString()}
      onClick={handleExpandClick}
      label={
        <>
          <Checkbox
            checked={selectedNodes.some((item) => item === nodes.id)}
            tabIndex={-1}
            disableRipple
            onClick={(event) => handleNodeSelect(event, nodes.pid as never, nodes.id as never)}
          />
          {nodes.name}
        </>
      }
    >
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );
  return (
    <SimpleTreeView
      slots={{
        collapseIcon: DownOutlined,
        expandIcon: RightOutlined,
      }}
      defaultExpandedItems={expandAll ? fcExpandAll(data) : defaultExpandAry}
    >
      {data.map((node) => renderTree(node))}
    </SimpleTreeView>
  );
};

export default CheckboxTree;
