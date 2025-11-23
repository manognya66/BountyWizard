"use client";
import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import SelectMUI from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";

type Option = { value?: string; label?: string } | string;

type Props = {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
  options?: Option[];
  error?: string;
  name?: string;
};

export default function Select({ label, value = "", onChange, options = [], error, name }: Props) {
  return (
    <FormControl fullWidth error={!!error} size="small">
      {label && <InputLabel>{label}</InputLabel>}
      <SelectMUI
        label={label}
        value={value ?? ""}
        onChange={(e) => onChange?.(String(e.target.value))}
        name={name}
      >
        {options.map((opt) =>
          typeof opt === "string" ? (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ) : (
            <MenuItem key={opt.value ?? String(opt.label)} value={opt.value ?? ""}>
              {opt.label ?? opt.value}
            </MenuItem>
          )
        )}
      </SelectMUI>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
