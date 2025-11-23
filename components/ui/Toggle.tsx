"use client";
import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

type Props = {
  label?: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  size?: "small" | "medium";
};

export default function Toggle({ label, checked = false, onChange, size = "medium" }: Props) {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={(e) => onChange?.(e.target.checked)} size={size} color="primary" />}
      label={label}
    />
  );
}