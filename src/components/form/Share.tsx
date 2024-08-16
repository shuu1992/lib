import { useEffect, useState } from 'react';
import { TbSelectProps, PgListProps, PgCfgProps } from '@type/page';
import usePage from '@hooks/usePage';
// material-ui
import { InputLabel, TextField, Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

export interface PlatformProps {
  [key: number]: number;
}
export interface ShareProps {
  id: number;
  name: string;
  value: number;
}

function Share({
  platform,
  value,
  setValue,
}: {
  platform: PlatformProps;
  value: { [key: number]: number };
  setValue: (value: any) => void;
}) {
  const { t, fcShowMsg } = usePage();
  const [share, setShare] = useState<ShareProps[]>([]);

  useEffect(() => {
    const array: ShareProps[] = [];
    const defaultValue = value[0] || 0;
    array.push({ id: 0, name: 'default', value: defaultValue });

    for (const key in platform) {
      const id = parseInt(key);
      const entryValue = value[id] || defaultValue;
      array.push({ id: id, name: platform[key].toString(), value: entryValue });
    }
    setShare(array);
  }, []);

  useEffect(() => {
    const obj: { [key: number]: number } = {};
    share.forEach((item) => {
      if (item.id === 0 || item.value > 0) {
        obj[item.id] = item.value;
      }
    });
    setValue(obj);
  }, [share]);

  return (
    <Box sx={{ m: 3 }}>
      <Grid container spacing={2}>
        {share.map((item: ShareProps) => {
          const name = item.name === 'default' ? t('sys.default') : item.name;
          return (
            <Grid xs={6} md={3}>
              <InputLabel className="requireClass">{name}</InputLabel>
              <TextField
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                value={item.value}
                onBlur={(e) => {
                  setShare(
                    share.map((shareItem) => {
                      if (shareItem.id === item.id) {
                        return { ...shareItem, value: parseFloat(e.target.value) || 0 };
                      }
                      return shareItem;
                    }),
                  );
                }}
                onChange={(e) => {
                  setShare(
                    share.map((shareItem) => {
                      if (shareItem.id === item.id) {
                        return { ...shareItem, value: parseFloat(e.target.value) || 0 };
                      }
                      return shareItem;
                    }),
                  );
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Share;
