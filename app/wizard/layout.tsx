"use client";

import React from "react";
import BountyProviderWrapper from "../../components/providers/BountyProviders";
import WizardShell from "../../components/wizard/WizardShell";

export default function WizardLayout({ children }: { children: React.ReactNode }) {
  return (
    <BountyProviderWrapper>
      <WizardShell>{children}</WizardShell>
    </BountyProviderWrapper>
  );
}