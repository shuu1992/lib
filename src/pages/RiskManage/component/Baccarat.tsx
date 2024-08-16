import { forwardRef, useImperativeHandle, useEffect } from 'react';
import * as Yup from 'yup';
import usePage from '@hooks/usePage';
import { useFormik } from 'formik';
// material-ui
import Grid from '@mui/material/Unstable_Grid2';
// custom Components
import { ModalController, ModalContainer } from 'react-modal-global';

import PokerCard from './PokerCard';
const Modal = new ModalController();
type ValueType = {
  payload: string;
  numbers: string;
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

    const formik = useFormik({
      initialValues: {
        num1: 0,
        num2: 0,
        num3: 0,
        num4: 0,
        num5: 0,
        num6: 0,
      },
      validationSchema: Yup.object().shape({}),
      validateOnChange: false,
      onSubmit: () => {},
    });

    const { values, validateForm, setValues } = formik;

    const validate = async () => {
      let isValid = true;
      const numbers = `${values.num1},${values.num2},${values.num3},${values.num4},${values.num5},${values.num6}`;
      const valRes = await validateForm();
      const needConfirm = numbers === '0,0,0,0,0,0' || !numbers ? false : true;

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
      const numAry = value.numbers ? value.numbers.split(',').map(Number) : [0, 0, 0, 0, 0, 0];
      setValues({
        ...values,
        num1: numAry[0],
        num2: numAry[1],
        num3: numAry[2],
        num4: numAry[3],
        num5: numAry[4],
        num6: numAry[5],
      });
    }, [value]);

    return (
      <>
        <Grid mt={2} xs={12} sm={6}>
          <Grid>{t('sys.player')}</Grid>
          <Grid mt={2} container textAlign="center" justifyContent="center">
            {[4, 5, 6].map((item, index) => {
              const cardNum = values[`num${item}` as keyof typeof values];
              let cardCss = `card card${cardNum}`;
              if (index === 2) {
                cardCss += ' flip';
              }
              return (
                <Grid
                  key={index}
                  xs={4}
                  sm={2}
                  onClick={async () => {
                    await Modal.open(PokerCard, {
                      setValue: (number) => {
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
            })}
          </Grid>
        </Grid>
        <Grid mt={2} xs={12} sm={6}>
          <Grid>{t('sys.banker')}</Grid>
          <Grid mt={2} container textAlign="center" justifyContent="center">
            {[1, 2, 3].map((item, index) => {
              const cardNum = values[`num${item}` as keyof typeof values];
              let cardCss = `card card${cardNum}`;
              if (index === 2) {
                cardCss += ' flip';
              }
              return (
                <Grid
                  key={index}
                  xs={4}
                  sm={2}
                  onClick={async () => {
                    await Modal.open(PokerCard, {
                      setValue: (number) => {
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
            })}
          </Grid>
        </Grid>
        <ModalContainer controller={Modal} />
      </>
    );
  },
);
