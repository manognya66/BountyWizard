"use client";
import React from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";

type Props = Omit<MuiButtonProps, "onClick"> & {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Button({ children, onClick, ...rest }: Props) {
  return (
    <MuiButton
      {...rest}
      onClick={onClick}
      variant={rest.variant ?? "contained"}
      color={(rest as any).color ?? "primary"}
      size={(rest as any).size ?? "medium"}
      sx={{ textTransform: "none", borderRadius: 1 }}
    >
      {children}
    </MuiButton>
  );
}