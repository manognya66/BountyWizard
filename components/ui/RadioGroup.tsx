"use client";
import React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroupMUI from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

interface RadioOption {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (v: string) => void;
  row?: boolean;
}

export default function RadioGroup({ label, options, value = "", onChange, row = true }: Props) {
  return (
    <FormControl component="fieldset">
      {label && <FormLabel component="legend" sx={{ fontSize: 13 }}>{label}</FormLabel>}
      <RadioGroupMUI row={row} value={value} onChange={(e) => onChange?.(e.target.value)}>
        {options.map((opt) => (
          <FormControlLabel key={opt.value} value={opt.value} control={<Radio size="small" />} label={opt.label} />
        ))}
      </RadioGroupMUI>
    </FormControl>
  );
}
