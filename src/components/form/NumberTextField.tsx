import { NumericFormat } from 'react-number-format';
import { useEffect, useState } from 'react';
import { TextFieldProps, FormControl, TextField, FormHelperText } from '@mui/material';

function NumberTextField({
  placeholder,
  disabled = false,
  value,
  errors,
  setValue,
}: {
  placeholder?: string;
  disabled?: boolean;
  value: any;
  errors?: any;
  setValue: (value: string | number) => void;
}) {
  return (
    <FormControl fullWidth>
      <NumericFormat
        placeholder={placeholder}
        value={value}
        inputProps={{ readOnly: disabled }}
        customInput={TextField}
        error={Boolean(errors)}
        onValueChange={(values) => {
          const val = values.floatValue ? values.floatValue : 0;
          setValue(val);
        }}
        allowLeadingZeros
        thousandSeparator=","
        helperText={errors ? errors : null}
      />
    </FormControl>
  );
}

export default NumberTextField;
