"use client";
import React from "react";
import TextField from "@mui/material/TextField";

type Props = {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  type?: string;
};

export default function TextInput({ label, value = "", onChange, placeholder, error, maxLength, type = "text" }: Props) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      helperText={error}
      error={!!error}
      fullWidth
      variant="outlined"
      inputProps={maxLength ? { maxLength } : undefined}
      type={type as any}
      size="small"
    />
  );
}