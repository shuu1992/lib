import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useTheme } from '@mui/material/styles';
import usePage from '@hooks/usePage';
import Grid from '@mui/material/Unstable_Grid2';
import { FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ModalController, ModalContainer } from 'react-modal-global';
import PokerCard from './PokerCard';

const Modal = new ModalController();

export type ValueType = {
  payload: string;
  numbers: string;
};

type Card = {
  suit: 'Clubs' | 'Diamonds' | 'Hearts' | 'Spades' | '';
  value: number;
};

const convertToCard = (num: number): Card => {
  let suit: 'Clubs' | 'Diamonds' | 'Hearts' | 'Spades' | '';
  let value: number;

  if (num >= 1 && num <= 13) {
    suit = 'Clubs';
    value = num;
  } else if (num >= 14 && num <= 26) {
    suit = 'Diamonds';
    value = num - 13;
  } else if (num >= 27 && num <= 39) {
    suit = 'Hearts';
    value = num - 26;
  } else if (num >= 40 && num <= 52) {
    suit = 'Spades';
    value = num - 39;
  } else {
    suit = '';
    value = 0;
  }

  return { suit, value };
};

// 計算點數
const calculatePoints = (cards: Card[]): number[] => {
  return cards.map((card) => (card.value > 10 ? 10 : card.value));
};

// 判斷三公
const isSanGong = (cards: Card[]): boolean => {
  return cards.every((card) => card.value > 10);
};

// 判斷牛牛
const calculateBullBull = (points: number[]): number => {
  for (let i = 0; i < points.length - 2; i++) {
    for (let j = i + 1; j < points.length - 1; j++) {
      for (let k = j + 1; k < points.length; k++) {
        if ((points[i] + points[j] + points[k]) % 10 === 0) {
          const remainingPoints = points.filter((_, idx) => idx !== i && idx !== j && idx !== k);
          return (remainingPoints[0] + remainingPoints[1]) % 10;
        }
      }
    }
  }
  return -1;
};

// 判斷牌型
const getHandType = (cardNumbers: number[]): { type: string; color: string } => {
  const theme = useTheme();
  const { t } = usePage();
  const cards = cardNumbers.map(convertToCard);

  if (cards.every((card) => card.value === 0)) {
    return { type: '', color: '' };
  }

  if (isSanGong(cards)) {
    return { type: t('riskManage.wugong'), color: 'gold' };
  }
  const points = calculatePoints(cards);
  const bullBullResult = calculateBullBull(points);

  if (bullBullResult === -1) {
    return { type: t('riskManage.nonui'), color: 'gray' };
  } else if (bullBullResult === 0) {
    return {
      type: `${t('riskManage.nui')}${t('riskManage.nui')}`,
      color: theme.palette.error.main,
    };
  } else if (bullBullResult >= 7) {
    return { type: `${t('riskManage.nui')}${bullBullResult}`, color: theme.palette.success.main };
  } else if (bullBullResult >= 1 && bullBullResult <= 6) {
    return { type: `${t('riskManage.nui')}${bullBullResult}`, color: theme.palette.info.main };
  } else {
    return { type: `${t('riskManage.nui')}${bullBullResult}`, color: theme.palette.primary.main };
  }
};

// 生成卡片
const generateCards = (
  values: Record<string, number>,
  setValues: (values: Record<string, number>) => void,
  start: number,
  end: number,
) => {
  return Array.from({ length: end - start + 1 }, (_, idx) => start + idx).map((item, index) => {
    const cardNum = values[`num${item}` as keyof typeof values];
    const cardCss = `card card${cardNum}`;
    return (
      <Grid
        key={index}
        xs={2}
        onClick={async () => {
          await Modal.open(PokerCard, {
            setValue: (number: number) => {
              setValues({
                ...values,
                [`num${item}`]: number,
              });
            },
          });
        }}
      >
        <div className={cardCss}></div>
      </Grid>
    );
  });
};

export default forwardRef(
  (
    {
      value,
    }: {
      value: ValueType;
    },
    ref,
  ) => {
    const { t } = usePage();
    const theme = useTheme();
    const formik = useFormik({
      initialValues: Object.fromEntries(
        Array.from({ length: 21 }, (_, idx) => [`num${idx + 1}`, 0]),
      ),
      validationSchema: Yup.object().shape({}),
      validate: (values) => {
        const errors: Record<string, string> = {};
        const allValues = Object.values(values);
        if (allValues.some((val) => val === 0)) {
          errors.general = t('riskManage.noCardSelect');
        }
        return errors;
      },
      validateOnChange: false,
      onSubmit: () => {},
    });

    const { values, errors, validateForm, setValues } = formik;

    const validate = async () => {
      let isValid = true;
      const numbers = Object.values(values).join(',');
      const valRes = await validateForm();
      const needConfirm =
        numbers === '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0' || !numbers ? false : true;

      if (Object.keys(valRes).length > 0) {
        isValid = false;
      }
      let postData = {};
      if (needConfirm) {
        postData = {
          numbers: numbers,
        };
      }

      return {
        isValid,
        postData,
        needConfirm,
      };
    };

    useImperativeHandle(ref, () => ({
      validate: () => validate(),
    }));

    useEffect(() => {
      const numAry = value.numbers ? value.numbers.split(',').map(Number) : Array(21).fill(0);
      setValues({
        ...values,
        ...numAry.reduce((acc, num, idx) => ({ ...acc, [`num${idx + 1}`]: num }), {}),
      });
    }, [value]);

    // 莊家牌型计算
    const zhuangJiaCards = [values.num2, values.num3, values.num4, values.num5, values.num6];
    const zhuangJiaHandType = getHandType(zhuangJiaCards);

    // 閒一牌型计算
    const xianYiCards = [values.num7, values.num8, values.num9, values.num10, values.num11];
    const xianYiHandType = getHandType(xianYiCards);

    // 閒二牌型计算
    const xianErCards = [values.num12, values.num13, values.num14, values.num15, values.num16];
    const xianErHandType = getHandType(xianErCards);

    // 閒三牌型计算
    const xianSanCards = [values.num17, values.num18, values.num19, values.num20, values.num21];
    const xianSanHandType = getHandType(xianSanCards);

    return (
      <>
        <Grid container xs={12} p={2}>
          {/* 頭牌 */}
          <Grid xs={12} sm={2}>
            <Grid xs={6}>{t('riskManage.topCard')}</Grid>
            <Grid container xs={6} mt={2} mb={1}>
              {generateCards(values, setValues, 1, 1)}
            </Grid>
          </Grid>
          {/* 莊家 */}
          <Grid xs={12} sm={5}>
            <Grid xs={6}>{t('riskManage.banker')}</Grid>
            <Grid container xs={6} mt={1} mb={1} spacing={1.5} alignItems="center">
              {generateCards(values, setValues, 2, 6)}
              <Grid xs={12} ml={1} justifyContent="center">
                <div style={{ color: zhuangJiaHandType.color }}>{zhuangJiaHandType.type}</div>
              </Grid>
            </Grid>
          </Grid>
          {/* 閒 */}
          <Grid xs={12} sm={5}>
            {/* 閒一 */}
            <Grid xs={12}>
              <Grid xs={6}>{t('riskManage.player')}1</Grid>
              <Grid container xs={6} mt={1} mb={1} spacing={1.5} alignItems="center">
                {generateCards(values, setValues, 7, 11)}
                <Grid xs={12} ml={1} justifyContent="center">
                  <div style={{ color: xianYiHandType.color }}>{xianYiHandType.type}</div>
                </Grid>
              </Grid>
            </Grid>
            {/* 閒二 */}
            <Grid xs={12} mt={2}>
              <Grid xs={6}>{t('riskManage.player')}2</Grid>
              <Grid container xs={6} mt={1} mb={1} spacing={1.5} alignItems="center">
                {generateCards(values, setValues, 12, 16)}
                <Grid xs={12} ml={1} justifyContent="center">
                  <div style={{ color: xianErHandType.color }}>{xianErHandType.type}</div>
                </Grid>
              </Grid>
            </Grid>
            {/* 閒三 */}
            <Grid xs={12} mt={2}>
              <Grid xs={6}>{t('riskManage.player')}3</Grid>
              <Grid container xs={6} mt={1} mb={1} spacing={1.5} alignItems="center">
                {generateCards(values, setValues, 17, 21)}
                <Grid xs={12} ml={1} justifyContent="center">
                  <div style={{ color: xianSanHandType.color }}>{xianSanHandType.type}</div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid>
          {errors.general && (
            <FormHelperText style={{ marginTop: '0.5rem' }} error>
              {errors.general}
            </FormHelperText>
          )}
        </Grid>
        <ModalContainer controller={Modal} />
      </>
    );
  },
);

export { getHandType, calculatePoints, isSanGong, calculateBullBull, convertToCard, generateCards };
