"use client";
import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Props = {
  onFile?: (file?: File) => void;
  value?: File | string | null;
  error?: string;
  accept?: string;
};

export default function FileUpload({ onFile, value, error, accept = "image/*" }: Props) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handlePick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    onFile?.(f);
  };

  return (
    <Stack spacing={1}>
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleChange} style={{ display: "none" }} />
      <div className="flex items-center gap-3">
        <Button variant="outlined" onClick={handlePick} size="small">
          Upload
        </Button>
        {value ? (
          typeof value === "string" ? (
            <a href={value} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">
              View current
            </a>
          ) : (
            <Typography variant="body2" component="span" className="text-sm">
              {value.name}
            </Typography>
          )
        ) : (
          <Typography variant="body2" component="span" className="text-sm text-gray-500">
            No file selected
          </Typography>
        )}
      </div>
      {error && <Typography variant="caption" color="error">{error}</Typography>}
    </Stack>
  );
}