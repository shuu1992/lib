import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Material-UI
import { Stack, Box } from '@mui/material';
import { HighlightScope } from '@mui/x-charts';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { ChartsYAxis } from '@mui/x-charts';
type ChartType = 'bar' | 'line' | 'pie';
//這個組件的功能是在Tab中顯示不同類型的圖表。bar line pie (Pie 尚未實作)

export default function ChartComp({
  chartTypeList = ['bar'],
  barData = {
    xAxis: [{ scaleType: 'band', data: [] }],
    series: [{ label: '', data: [] }],
  },
  barSeachComp,
  lineData = {
    xAxis: [{ data: [] }],
    series: [{ label: '', data: [] }],
  },
  lineSeachComp,
}: {
  chartTypeList: ChartType[];
  barData: {
    xAxis: { scaleType: string; data: any[] }[];
    series: { label: string; data: number[] }[];
  };
  barSeachComp?: React.ReactNode;
  lineData: {
    xAxis: { data: any[] }[];
    series: { label: string; data: number[] }[];
  };
  lineSeachComp?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const barChartsParams = {
    series: barData.series,
    xAxis: barData.xAxis,
    height: 350,
    margin: { left: 60 },
  };
  const lineChartsParams = {
    series: lineData.series,
    xAxis: lineData.xAxis,
    height: 350,
    margin: { left: 60 },
  };
  const pieChartsParams = {
    series: [
      {
        data: [{ value: 5, label: 'series A' }, { value: 10 }, { value: 15 }],
        innerRadius: 30,
        outerRadius: 100,
        paddingAngle: 5,
        cornerRadius: 5,
        startAngle: -90,
        endAngle: 180,
        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
      },
    ],
    height: 400,
    margin: { top: 50, bottom: 50 },
  };
  const [chartType, setChartType] = useState('bar');

  const fcChangeChartType = (event: any, newChartType: string) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  return (
    <Stack direction={{ xs: 'column', xl: 'row' }} spacing={1} sx={{ width: '100%' }}>
      <Box sx={{ flexGrow: 1 }}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={fcChangeChartType}
          aria-label="chart type"
          fullWidth
        >
          {chartTypeList.map((type) => (
            <ToggleButton key={type} value={type} aria-label="left aligned">
              {t(`sys.${type}Chart`)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {/* BarChart */}
        {chartType === 'bar' && barSeachComp}
        {chartType === 'bar' && (
          <BarChart
            {...barChartsParams}
            series={barChartsParams.series.map((series) => ({
              ...series,
            }))}
            xAxis={barChartsParams.xAxis as any}
            leftAxis={null}
          >
            <ChartsYAxis
              tickLabelStyle={{
                fontSize: 12,
                angle: -45,
              }}
            />
          </BarChart>
        )}
        {/* LinChart */}
        {chartType === 'line' && lineSeachComp}
        {chartType === 'line' && (
          <LineChart
            {...lineChartsParams}
            series={lineChartsParams.series.map((series) => ({
              ...series,
            }))}
            xAxis={lineChartsParams.xAxis as any}
            leftAxis={null}
          >
            <ChartsYAxis
              tickLabelStyle={{
                fontSize: 12,
                angle: -45,
              }}
            />
          </LineChart>
        )}
        {chartType === 'pie' && (
          <PieChart
            {...pieChartsParams}
            series={pieChartsParams.series.map((series) => ({
              ...series,
              highlightScope: { faded: 'global', highlighted: 'item' } as HighlightScope,
            }))}
          />
        )}
      </Box>
    </Stack>
  );
}
