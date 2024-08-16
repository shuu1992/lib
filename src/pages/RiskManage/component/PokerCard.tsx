import { useEffect, useState } from 'react';
import usePage from '@hooks/usePage';
import { useModalWindow } from 'react-modal-global';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
// custom Components
import CustomizedDialog from '@components/dialog/FormDialog';

export default function PokerDialog({ setValue }: { setValue: (value: number) => void }) {
  const { t } = usePage();
  const modal = useModalWindow();
  const [pokerCardList, setPokerCardList] = useState<number[]>([]);
  const fcCloseDialog = () => {
    modal.close();
  };

  useEffect(() => {
    const pokerCardAry = [];
    for (let i = 0; i <= 52; i++) {
      pokerCardAry.push(i);
    }
    setPokerCardList(pokerCardAry);
  }, []);

  return (
    <CustomizedDialog
      flag={!modal.closed}
      title={t('riskManage.chosePokerCard')}
      confirmCfg={{ flag: false, fcConfirm: Promise.resolve }}
      fcChangeDialog={fcCloseDialog}
    >
      <Grid container spacing={2} p={1}>
        {pokerCardList.map((item, index) => {
          const card = `card card${item}`;
          return (
            <Grid
              container
              sm={1}
              xs={2}
              key={index}
              mt={1}
              mb={1}
              columns={13}
              alignItems="center"
              justifyContent="center"
              onClick={() => {
                setValue(item);
                fcCloseDialog();
              }}
            >
              <Grid className={card} />
            </Grid>
          );
        })}
      </Grid>
    </CustomizedDialog>
  );
}
