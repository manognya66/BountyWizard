"use client";
import React from "react";
import TextField from "@mui/material/TextField";

type Props = {
  label?: string;
  value?: number | string;
  onChange?: (v: number) => void;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
};

export default function NumberInput({ label, value = "", onChange, error, min, max, step = 1 }: Props) {
  return (
    <TextField
      label={label}
      value={value === undefined || value === null ? "" : String(value)}
      onChange={(e) => {
        const val = e.target.value;
        const num = val === "" ? NaN : Number(val);
        if (val === "") onChange?.(NaN);
        else if (!isNaN(num)) onChange?.(num);
      }}
      type="number"
      inputProps={{ min, max, step }}
      helperText={error}
      error={!!error}
      fullWidth
      variant="outlined"
      size="small"
    />
  );
}