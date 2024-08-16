import { DefaultizedPieValueType } from '@mui/x-charts';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { useTheme } from '@mui/material/styles';
import usePage from '@hooks/usePage';
const sizing = {
  width: 400,
  height: 250,
};

export default function RiskPieChart({ bank = 0, player = 0 }: { bank: number; player: number }) {
  const theme = useTheme();
  const { t } = usePage();
  const data = [
    { label: t('sys.banker'), value: bank, color: theme.palette.error.main },
    { label: t('sys.player'), value: player, color: '#0088FE' },
  ];
  const total = data.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params: DefaultizedPieValueType) => {
    const percent = params.value / total;
    return `${parseFloat((percent * 100).toFixed(0)) || 0}%`;
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <PieChart
        series={[
          {
            data,
            arcLabel: getArcLabel,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: 'white',
            fontSize: 14,
          },
        }}
        {...sizing}
      />
    </div>
  );
}
