"use client";
import React from "react";
import TextField from "@mui/material/TextField";

type Props = {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
};

export default function Textarea({ label, value = "", onChange, placeholder, error, rows = 4 }: Props) {
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
      multiline
      rows={rows}
      size="small"
    />
  );
}