import usePage from '@hooks/usePage';

// material-ui
import Grid from '@mui/material/Unstable_Grid2';
// custom Components

export default function BaccaratResultTableColumn({ row }: { row: any }) {
  const { t } = usePage();
  if (row.original.numbers === undefined) return;
  const numbersAry =
    row.original.numbers === '' ? [0, 0, 0, 0, 0, 0] : row.original.numbers.split(',').map(Number);
  const bankAry = numbersAry[2] === 0 ? numbersAry.slice(0, 2) : numbersAry.slice(0, 3);
  const playerAry = numbersAry[5] === 0 ? numbersAry.slice(3, 5) : numbersAry.slice(-3);

  return (
    <>
      <Grid xs={6}>
        <Grid xs={12}>{t('sys.player')}</Grid>
        <Grid xs={12} container spacing={0.5} justifyContent="center">
          {playerAry.slice(-3).map((item: number, key: number) => {
            let card = `card card${item}`;
            //有第三張翻轉
            if (key === 2) {
              card = `${card} flip`;
            }
            return (
              <Grid
                xs={4}
                key={key}
                className={card}
                mb={key < 2 ? 0.5 : 0}
                mt={key == 2 ? 0.5 : 0}
              />
            );
          })}
        </Grid>
      </Grid>
      <Grid xs={6} textAlign="right">
        <Grid xs={12}>{t('sys.banker')}</Grid>
        <Grid xs={12} container spacing={0.5} justifyContent="center">
          {bankAry.slice(0, 3).map((item: number, key: number) => {
            let card = `card card${item}`;
            //有第三張翻轉
            if (key === 2) {
              card = `${card} flip`;
            }
            return (
              <Grid
                xs={4}
                key={key}
                className={card}
                mb={key < 2 ? 0.5 : 0}
                mt={key == 2 ? 0.5 : 0}
              />
            );
          })}
        </Grid>{' '}
      </Grid>
    </>
  );
}
