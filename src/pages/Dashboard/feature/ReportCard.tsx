import { useEffect, useRef } from 'react';
// material-ui
import { styled } from '@mui/material/styles';
import { Card, CardContent, Grid, Typography } from '@mui/material';
// types
import { GenericCardProps } from '@type/root';
// third-party
import { useCountUp } from 'react-countup';

// styles
const IconWrapper = styled('div')({
  position: 'absolute',
  left: '-17px',
  bottom: '-27px',
  color: '#fff',
  transform: 'rotate(25deg)',
  '& svg': {
    width: '100px',
    height: '100px',
    opacity: '0.35',
  },
});

interface UserCountCardProps {
  primary: string;
  countNumber: number;
  iconPrimary: GenericCardProps['iconPrimary'];
  color: string;
}

// =============================|| USER NUM CARD ||============================= //

const UserCountCard = ({ primary, countNumber, iconPrimary, color }: UserCountCardProps) => {
  const IconPrimary = iconPrimary!;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;
  const countUpRef = useRef(null);
  const { update } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: countNumber,
    delay: 1,
  });
  useEffect(() => {
    update(countNumber);
  }, [countNumber]);
  return (
    <Card elevation={0} sx={{ background: color, position: 'relative', color: '#fff' }}>
      <CardContent>
        <IconWrapper>{primaryIcon}</IconWrapper>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={1}>
          <Grid item sm={12}>
            <Typography ref={countUpRef} variant="h3" align="center" color="inherit">
              {countNumber}
            </Typography>
          </Grid>
          <Grid item sm={12}>
            <Typography variant="body1" align="center" color="inherit">
              {primary}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserCountCard;
