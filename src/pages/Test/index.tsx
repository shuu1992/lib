import { useState, useMemo, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Button } from '@mui/material';
import XLSX from 'xlsx-js-style';
import usePage from '@hooks/usePage';
import { ExcelHeader } from './excel';
const Test = () => {
  const { t } = usePage();
  async function fcTest() {
    const defaultWdith = 12;
    const titleAry = [
      {
        v: 'RG Report',
        t: 's',
        s: {
          font: { bold: true, color: { rgb: 'ffffff' } },
          fill: { fgColor: { rgb: 'c00000' } },
          alignment: { horizontal: 'center' },
        },
      },
    ];
    const headerObj: any = {};
    const headerAry: any[] = [];
    const headerWidths: { wch: number }[] = [];
    //
    const columnsAry = [
      {
        uid: 393,
        rakeback: 0,
        bet_count: 20,
        bet_total: 400000,
        bet_real: 394000,
        username: 'a4-rgtmw53763',
        payout: 730000,
        payoff: 330000,
        rebate: 0,
        donate: 0,
        turn_in: 330000,
        test: 123,
      },
      {
        uid: 332,
        rakeback: 0,
        bet_count: 18,
        bet_total: 140400,
        bet_real: 130400,
        username: 'a4-rgtfreyja005',
        payout: 310400,
        payoff: 170000,
        rebate: 0,
        donate: 0,
        turn_in: 170000,
        test: 123,
      },
      {
        uid: 395,
        rakeback: 0,
        bet_count: 7,
        bet_total: 700000,
        bet_real: 700000,
        username: 'a4-rgtjack0102',
        payout: 800000,
        payoff: 100000,
        rebate: 0,
        donate: 0,
        turn_in: 100000,
        test: 123,
      },
      {
        uid: 346,
        rakeback: 0,
        bet_count: 31,
        bet_total: 131100,
        bet_real: 131100,
        username: 'a4-rgttg0014',
        payout: 197600,
        payoff: 66500,
        rebate: 0,
        donate: 0,
        turn_in: 66500,
        test: 123,
      },
      {
        uid: 391,
        rakeback: 0,
        bet_count: 13,
        bet_total: 1210000,
        bet_real: 1110000,
        username: 'a4-rgtawei0101',
        payout: 1269500,
        payoff: 59500,
        rebate: 0,
        donate: 0,
        turn_in: 59500,
        test: 123,
      },
      {
        uid: 43,
        rakeback: 0,
        bet_count: 55,
        bet_total: 524000,
        bet_real: 494000,
        username: 'a4-rgtfreyja001',
        payout: 572000,
        payoff: 48000,
        rebate: 0,
        donate: 0,
        turn_in: 48000,
        test: 123,
      },
      {
        uid: 124,
        rakeback: 0,
        bet_count: 17,
        bet_total: 291000,
        bet_real: 281000,
        username: 'a4-rgtr59303',
        payout: 336000,
        payoff: 45000,
        rebate: 0,
        donate: 0,
        turn_in: 45000,
        test: 123,
      },
      {
        uid: 375,
        rakeback: 0,
        bet_count: 40,
        bet_total: 400000,
        bet_real: 380000,
        username: 'a4-rgtvv0102',
        payout: 430000,
        payoff: 30000,
        rebate: 0,
        donate: 0,
        turn_in: 30000,
        test: 123,
      },
      {
        uid: 476,
        rakeback: 0,
        bet_count: 18,
        bet_total: 94500,
        bet_real: 89500,
        username: 'a4-rgtgdf00122',
        payout: 122500,
        payoff: 28000,
        rebate: 0,
        donate: 0,
        turn_in: 28000,
        test: 123,
      },
      {
        uid: 302,
        rakeback: 0,
        bet_count: 6,
        bet_total: 44000,
        bet_real: 44000,
        username: 'a4-rgtaa1118',
        payout: 68000,
        payoff: 24000,
        rebate: 0,
        donate: 0,
        turn_in: 24000,
        test: 123,
      },
      {
        uid: 236,
        rakeback: 0,
        bet_count: 62,
        bet_total: 590000,
        bet_real: 540000,
        username: 'a4-rgtkenny999',
        payout: 610000,
        payoff: 20000,
        rebate: 0,
        donate: 0,
        turn_in: 20000,
        test: 123,
      },
      {
        uid: 92,
        rakeback: 0,
        bet_count: 2,
        bet_total: 20000,
        bet_real: 20000,
        username: 'a4-rgtlion1022',
        payout: 40000,
        payoff: 20000,
        rebate: 0,
        donate: 0,
        turn_in: 20000,
        test: 123,
      },
      {
        uid: 350,
        rakeback: 0,
        bet_count: 8,
        bet_total: 90000,
        bet_real: 90000,
        username: 'a4-rgtfreyja101',
        payout: 100000,
        payoff: 10000,
        rebate: 0,
        donate: 0,
        turn_in: 10000,
        test: 123,
      },
      {
        uid: 6,
        rakeback: 0.8,
        bet_count: 7,
        bet_total: 70000,
        bet_real: 70000,
        username: 'test002',
        payout: 80000,
        payoff: 10000,
        rebate: 560,
        donate: 0,
        turn_in: 10560,
        test: 123,
      },
      {
        uid: 38,
        rakeback: 0,
        bet_count: 66,
        bet_total: 45200,
        bet_real: 38700,
        username: 'a4-rgtjason001',
        payout: 53300,
        payoff: 8100,
        rebate: 0,
        donate: 0,
        turn_in: 8100,
        test: 123,
      },
      {
        uid: 238,
        rakeback: 0,
        bet_count: 41,
        bet_total: 36500,
        bet_real: 24500,
        username: 'a4-rgtfreyja020',
        payout: 44300,
        payoff: 7800,
        rebate: 0,
        donate: 0,
        turn_in: 7800,
        test: 123,
      },
      {
        uid: 222,
        rakeback: 0,
        bet_count: 9,
        bet_total: 10500,
        bet_real: 9500,
        username: 'a4-rgtleo51365138',
        payout: 16350,
        payoff: 5850,
        rebate: 0,
        donate: 0,
        turn_in: 5850,
        test: 123,
      },
      {
        uid: 405,
        rakeback: 0,
        bet_count: 4,
        bet_total: 20000,
        bet_real: 15000,
        username: 'a4-rgtgmax03',
        payout: 25000,
        payoff: 5000,
        rebate: 0,
        donate: 0,
        turn_in: 5000,
        test: 123,
      },
      {
        uid: 417,
        rakeback: 0,
        bet_count: 13,
        bet_total: 125000,
        bet_real: 115000,
        username: 'a4-rgtmor666888',
        payout: 130000,
        payoff: 5000,
        rebate: 0,
        donate: 0,
        turn_in: 5000,
        test: 123,
      },
      {
        uid: 336,
        rakeback: 0,
        bet_count: 32,
        bet_total: 7300,
        bet_real: 4800,
        username: 'a4-rgtgtop001',
        payout: 8850,
        payoff: 1550,
        rebate: 0,
        donate: 0,
        turn_in: 1550,
        test: 123,
      },
      {
        uid: 404,
        rakeback: 0,
        bet_count: 10,
        bet_total: 6000,
        bet_real: 4200,
        username: 'a4-rgtcs888001',
        payout: 7400,
        payoff: 1400,
        rebate: 0,
        donate: 0,
        turn_in: 1400,
        test: 123,
      },
      {
        uid: 240,
        rakeback: 0,
        bet_count: 4,
        bet_total: 7000,
        bet_real: 7000,
        username: 'a4-rgtaaa888',
        payout: 8000,
        payoff: 1000,
        rebate: 0,
        donate: 0,
        turn_in: 1000,
        test: 123,
      },
      {
        uid: 326,
        rakeback: 0,
        bet_count: 1,
        bet_total: 1000,
        bet_real: 1000,
        username: 'a4-rgtrs528207',
        payout: 1950,
        payoff: 950,
        rebate: 0,
        donate: 0,
        turn_in: 950,
        test: 123,
      },
      {
        uid: 4,
        rakeback: 1,
        bet_count: 18,
        bet_total: 2800,
        bet_real: 1600,
        username: 'terry',
        payout: 3500,
        payoff: 700,
        rebate: 16,
        donate: 0,
        turn_in: 716,
        test: 123,
      },
      {
        uid: 84,
        rakeback: 0,
        bet_count: 10,
        bet_total: 4200,
        bet_real: 4200,
        username: 'a4-rgtgmax003',
        payout: 4600,
        payoff: 400,
        rebate: 0,
        donate: 0,
        turn_in: 400,
        test: 123,
      },
    ];
    const columnsAry2: any[] = [];

    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    // Set Title
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: ExcelHeader.length - 1 } }];
    ws['!rows'] = [{ hpt: 50 }];
    XLSX.utils.sheet_add_aoa(ws, [titleAry], { origin: 'A1' });
    // Set Header
    ExcelHeader.map((item) => {
      const config = {
        v: '',
        t: 's',
        s: {
          font: { bold: true, color: 'black' },
          alignment: { horizontal: 'center' },
        },
      };
      headerObj[item.key] = item.header;
      config.v = t(item.header);
      headerWidths.push({ wch: item.width ? item.width : defaultWdith });
      headerAry.push(config);
    });

    XLSX.utils.sheet_add_aoa(ws, [headerAry], { origin: 'A2' });
    //Starting in the second row to avoid overriding and skipping headers
    columnsAry.map((item) => {
      const obj: any = {};
      Object.keys(headerObj).map((headerkey) => {
        obj[headerkey] = item[headerkey as keyof typeof item];
      });
      columnsAry2.push(obj);
    });
    XLSX.utils.sheet_add_json(ws, columnsAry2, { origin: 'A3', skipHeader: true });
    ws['!cols'] = headerWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'filename.xlsx');
  }

  return (
    <Grid container>
      <Grid xs={6}>
        <Button
          variant="contained"
          onClick={() => {
            fcTest();
          }}
        >
          Test
        </Button>
      </Grid>
    </Grid>
  );
};

export default Test;
