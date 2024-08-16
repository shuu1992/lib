import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Tooltip,
  TextField,
  FormControlLabel,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useTable, useFilters, Column, useRowSelect, Row, HeaderGroup, Cell } from 'react-table';
import { DefaultColumnFilter } from '@utils/react-table';
import { EditTwoTone, SendOutlined, DeleteOutlined } from '@ant-design/icons';
import LoadingButton from '@components/@extended/LoadingButton';
import { Android12Switch } from '@components/switch/CustomizedSwitches';
import { ThemeMode } from '@type/config';
interface EditableRowProps {
  value: any;
  row: Row;
  column: any;
  updateData: (index: number, id: string, value: string) => void;
  editableRowIndex: number;
}
interface TableProps {
  columns: Column[];
  data: any[];
  setData: any;
  fcEdit?: (postData: any) => void;
  fcDel?: (postData: any) => void;
}

const RowEdit = ({
  value: initialValue,
  row,
  column: { id, dataType },
  updateData,
  editableRowIndex,
}: EditableRowProps) => {
  const { t } = useTranslation();
  const { index, values } = row;
  const [value, setValue] = useState(initialValue);
  const theme = useTheme();

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  let element;

  const IsEditAble = index === editableRowIndex;
  const editType = dataType === 'row' ? fcEditType(values.type) : dataType;
  function fcEditType(type: number | string) {
    let typeText = '';
    switch (type) {
      case 1:
        typeText = 'text';
        break;
      case 2:
        typeText = 'number';
        break;
      case 3:
        typeText = 'textarea';
        break;
      case 4:
        typeText = 'boolean';
        break;
      case 5:
        typeText = 'text';
        break;
    }
    return typeText;
  }
  switch (editType) {
    case 'boolean':
      element = (
        <>
          {IsEditAble ? (
            <FormControlLabel
              control={
                <Android12Switch
                  checked={value === 'Y' ? true : false}
                  onChange={() => {
                    const newValue = value === 'Y' ? 'N' : 'Y';
                    setValue(newValue);
                  }}
                  onBlur={onBlur}
                />
              }
              label={value === 'Y' ? t('sys.open') : t('sys.close')}
            />
          ) : (
            <FormControlLabel
              control={<Android12Switch checked={value === 'Y' ? true : false} />}
              label={value === 'Y' ? t('sys.open') : t('sys.close')}
            />
          )}
        </>
      );
      break;
    case 'text':
      element = (
        <>
          {IsEditAble ? (
            <TextField
              fullWidth
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              sx={{
                '& .MuiOutlinedInput-input': {
                  py: 0.75,
                  px: 1,
                  backgroundColor:
                    theme.palette.mode === ThemeMode.DARK ? 'inherit' : 'common.white',
                },
              }}
            />
          ) : (
            value
          )}
        </>
      );
      break;
    case 'number':
      element = (
        <>
          {IsEditAble ? (
            <TextField
              fullWidth
              value={value}
              type="number"
              onChange={onChange}
              onBlur={onBlur}
              sx={{
                '& .MuiOutlinedInput-input': {
                  py: 0.75,
                  px: 1,
                  backgroundColor:
                    theme.palette.mode === ThemeMode.DARK ? 'inherit' : 'common.white',
                },
              }}
            />
          ) : (
            value
          )}
        </>
      );
      break;
    case 'textarea':
      element = (
        <>
          {IsEditAble ? (
            <TextField
              value={value}
              multiline
              fullWidth
              rows={4}
              onChange={onChange}
              onBlur={onBlur}
              sx={{
                '& .MuiOutlinedInput-input': {
                  py: 0.75,
                  px: 1,
                  backgroundColor:
                    theme.palette.mode === ThemeMode.DARK ? 'inherit' : 'common.white',
                },
              }}
            />
          ) : (
            <TextField
              value={value}
              multiline
              fullWidth
              rows={4}
              inputProps={{ readOnly: true }}
              variant="standard"
              sx={{
                '& .MuiOutlinedInput-input': {
                  py: 0.75,
                  px: 1,
                  backgroundColor:
                    theme.palette.mode === ThemeMode.DARK ? 'inherit' : 'common.white',
                },
              }}
            />
          )}
        </>
      );
      break;
    default:
      element = <span>{value}</span>;
      break;
  }

  return element;
};
function EditTable({ columns, data, setData, fcEdit, fcDel }: TableProps) {
  const { t } = useTranslation();
  const [skipPageReset, setSkipPageReset] = useState(false);
  const updateData = (rowIndex: number, columnId: string, value: string | number) => {
    setSkipPageReset(true);
    setData((old: []) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...(old[rowIndex] as {}),
            [columnId]: value,
          };
        }
        return row;
      }),
    );
  };
  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
      Cell: RowEdit,
    }),
    [],
  );
  const [editableRowIndex, setEditableRowIndex] = useState(null);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data,
      defaultColumn: defaultColumn,
      updateData,
      editableRowIndex,
      setEditableRowIndex,
      fcEdit,
      fcDel,
    },
    useFilters,
    useRowSelect,
    (hooks) => {
      hooks.allColumns.push((columns) => [
        ...columns,
        {
          Header: t('sys.action'),
          accessor: 'action',
          Cell: ({ row, setEditableRowIndex, editableRowIndex, fcEdit, fcDel }) => (
            <>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                <Tooltip title={editableRowIndex !== row.index ? 'Edit' : 'Save'}>
                  <LoadingButton
                    shape="rounded"
                    color={editableRowIndex !== row.index ? 'primary' : 'success'}
                    onClick={() => {
                      const currentIndex = row.index;
                      if (editableRowIndex !== currentIndex) {
                        // row requested for edit access
                        setEditableRowIndex(currentIndex);
                      } else {
                        // request for saving the updated row
                        setEditableRowIndex(null);
                        const rowData = { ...row.values };
                        delete rowData.action;
                        fcEdit(rowData);
                      }
                    }}
                  >
                    {editableRowIndex !== row.index ? <EditTwoTone /> : <SendOutlined />}
                  </LoadingButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <LoadingButton
                    shape="rounded"
                    color="error"
                    onClick={() => {
                      const rowData = { ...row.values };
                      delete rowData.action;
                      fcDel(rowData);
                    }}
                  >
                    <DeleteOutlined />
                  </LoadingButton>
                </Tooltip>
              </Stack>
            </>
          ),
        },
      ]);
    },
  );

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => {
          return (
            <TableRow {...headerGroup.getHeaderGroupProps()} key={uuidv4()}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  {...column.getHeaderProps()}
                  key={column.id}
                  style={{ textAlign: 'center' }}
                >
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()} key={row.id}>
              {row.cells.map((cell) => (
                <TableCell
                  {...cell.getCellProps()}
                  key={cell.column.id}
                  style={{ textAlign: 'center' }}
                >
                  {cell.render('Cell')}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
export default EditTable;
