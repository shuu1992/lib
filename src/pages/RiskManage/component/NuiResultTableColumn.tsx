import React from 'react';
import usePage from '@hooks/usePage';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
import { getHandType } from './NuiSetting';

export default function BaccaratResultTableColumn({ row }: { row: any }) {
  const { t } = usePage();
  const numbers = row.original.numbers;
  if (numbers === undefined) return null;

  const numbersAry = numbers === '' ? Array(5).fill(0) : numbers.split(',').map(Number).slice(1, 6);

  const handType = getHandType(numbersAry);

  return (
    <Grid container m={1} spacing={0.5} alignItems="center" sx={{ minWidth: 250 }}>
      <Grid xs={12} container spacing={0.5} justifyContent="center">
        {numbersAry.map((item: number, key: number) => {
          const card = `card card${item}`;
          return <Grid xs={2} key={key} className={card} />;
        })}
        <Grid xs={2} ml={1} justifyContent="center">
          <div style={{ color: handType.color }}>{handType.type}</div>
        </Grid>
      </Grid>
    </Grid>
  );
}
