import { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { useModalWindow } from 'react-modal-global';
import { useTranslation } from 'react-i18next';
import { CloseCircleOutlined } from '@ant-design/icons';
//Excel
import XLSX from 'xlsx-js-style';
import i18n from '@i18n';

// loader style
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 4001,
  width: '100%',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& > * + *': {
    marginTop: theme.spacing(2),
  },
}));

const LinearProgressWithLabel = function (props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.primary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
};
export function fnExportExcel({
  fileName = import.meta.env.VITE_TITLE,
  title,
  headers,
  data,
}: {
  fileName: string;
  title: string;
  headers: any[];
  data: any[];
}) {
  // 預設Cell寬度
  const defaultWdith = 12;
  // 設定標題
  const titleAry = [
    {
      v: title,
      t: 's',
      s: {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '2E80FF' } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      },
    },
  ];
  // 設定Header
  const headerObj: any = {};
  const headerAry: any[] = [];
  const headerWidths: { wch: number }[] = [];
  const rows: any[] = [];

  const wb = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  // Set Title
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
  ws['!rows'] = [{ hpt: 50 }];
  XLSX.utils.sheet_add_aoa(ws, [titleAry], { origin: 'A1' });
  // Set Header
  headers.map((item) => {
    const config = {
      v: '',
      t: 's',
      s: {
        font: { bold: true, color: 'black' },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      },
    };
    config.v = i18n.t(item.header);
    headerObj[item.key] = item.header;
    headerWidths.push({ wch: item.width ? item.width : defaultWdith });
    headerAry.push(config);
  });

  XLSX.utils.sheet_add_aoa(ws, [headerAry], { origin: 'A2' });
  // Data settings, starting in the third row
  data.forEach((item) => {
    const row: any[] = headers.map((header) => ({
      v: item[header.key],
      t: 's', // Assuming all data are strings; change as necessary
      s: {
        alignment: { horizontal: 'right', vertical: 'center', wrapText: true }, // Right-align data text
      },
    }));
    rows.push(row); // Add styled data row
  });
  XLSX.utils.sheet_add_aoa(ws, rows, { origin: 'A3' });
  ws['!cols'] = headerWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

export default function ExportExcel({
  title,
  fileName,
  excelHeader,
  pageTotal,
  fcExportData,
}: {
  title: string;
  fileName: string;
  excelHeader: any[];
  pageTotal: number;
  fcExportData: (page: number, pageSize: number) => Promise<{ excelData: any[] }>;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const modal = useModalWindow();
  const defaultPageSize = 5000;
  const [progress, setProgress] = useState(0);
  const [excelState, setExcelState] = useState(0); // 0:初始化 1:進行中 2:完成 3:失敗
  const [excelData, setExcelData] = useState<any[]>([]);
  const looptime = pageTotal > defaultPageSize ? Math.ceil(pageTotal / defaultPageSize) : 1;
  const timeoutRef: any = useRef(null);
  async function fcGetExcelData() {
    const allExcelReq = [];
    for (let i = 1; i <= looptime; i++) {
      allExcelReq.push(fcExportData(i, defaultPageSize));
    }
    Promise.allSettled(allExcelReq)
      .then(async (res) => {
        await res.map((item) => {
          if (item.status === 'fulfilled') {
            setExcelData((prevState) => [...prevState, ...item.value.excelData]);
          }
        });
        await setExcelState(2);
      })
      .catch((err) => {
        setExcelState(3);
        throw err;
      });
  }
  useEffect(() => {
    fcGetExcelData();
    timeoutRef.current = setInterval(() => {
      if (timeoutRef.current && progress >= 97) {
        clearInterval(timeoutRef.current);
        return;
      }
      setProgress((prevProgress) => (prevProgress >= 97 ? 97 : prevProgress + Math.random()));
    }, 100);
    return () => {
      clearInterval(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (progress === 97 && excelState === 2) {
      clearInterval(timeoutRef.current);
      setProgress(100);
      fnExportExcel({
        fileName,
        title,
        headers: excelHeader,
        data: excelData,
      });
      return;
    }
  }, [progress, excelState]);

  useEffect(() => {
    if (modal.closed) {
      setProgress(0);
      setExcelState(0);
    }
  }, [modal.closed]);

  return (
    !modal.closed && (
      <LoaderWrapper>
        <Box sx={{ width: '80%' }}>
          <LinearProgressWithLabel sx={{ height: '1rem' }} value={progress} />
          {excelState === 2 && progress === 100 && (
            <Typography
              variant="h1"
              component="h2"
              align="center"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                modal.close();
              }}
            >
              {t('cp.downloadFinish')}
              <div>
                <CloseCircleOutlined
                  style={{
                    fontSize: '2rem',
                    textAlign: 'center',
                  }}
                />
              </div>
            </Typography>
          )}
          {excelState === 3 && (
            <Typography
              variant="h1"
              component="h2"
              align="center"
              style={{ cursor: 'pointer', color: theme.palette.error.main }}
              onClick={() => {
                modal.close();
              }}
            >
              {t('cp.downloadFail')}
              <div>
                <CloseCircleOutlined
                  style={{
                    fontSize: '2rem',
                    textAlign: 'center',
                  }}
                />
              </div>
            </Typography>
          )}
        </Box>
      </LoaderWrapper>
    )
  );
}
