// ==============================|| OVERRIDES - TABLE ROW ||============================== //

export default function TableRow() {
  return {
    MuiTableRow: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            '&:not(:last-of-type)': {
              position: 'sticky',
            },
          },
        },
      },
    },
  };
}
