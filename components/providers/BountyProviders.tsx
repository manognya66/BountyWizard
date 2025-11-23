"use client";
import React from "react";
import { BountyProvider } from "../../state/BountyContext";

export default function BountyProviders({ children }: { children: React.ReactNode }) {
  return <BountyProvider>{children}</BountyProvider>;
}
