"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Toggle from "../ui/Toggle";
import TextInput from "../ui/TextInput";
import FileUpload from "../ui/FileUpload";
import Button from "../ui/Button";
import { useBounty } from "../../state/BountyContext";
import { validateStep2 } from "../../hooks/useValidation";

function InfoTip({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <span className="relative inline-flex items-center ml-2 group" aria-hidden>
      <button
        type="button"
        aria-describedby={id}
        className="w-6 h-6 rounded-full flex items-center justify-center text-black hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
          <path d="M11.25 11h1.5v4h-1.5zM11.25 7.75h1.5v1.5h-1.5z" fill="currentColor" />
        </svg>
      </button>

      <div
        id={id}
        role="tooltip"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-16 w-64 z-10 rounded-md bg-gray-900 text-white text-xs p-2 opacity-0 scale-95 transform transition-all group-hover:opacity-100 group-focus-within:opacity-100 group-hover:scale-100 group-focus-within:scale-100"
      >
        {children}
      </div>
    </span>
  );
}

export default function Step2Backer() {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const router = useRouter();
  const { state, updateNested, update } = useBounty();

  const titleTipId = React.useId();
  const hasBackerTipId = React.useId();
  const logoTipId = React.useId();
  const termsTipId = React.useId();

  const onLogoFile = (file?: File) => {
    updateNested("backer", { logo: file ?? "" });
  };

  const onLogoURL = (v: string) => {
    updateNested("backer", { logo: v });
  };

  const onNext = () => {
    const errs = validateStep2(state.data);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      router.push("/wizard/step/3");
    }
  };

  return (
    <div className="w-full text-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-2xl font-semibold">Backer Information</h2>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Toggle label="Has Backer?" checked={!!state.data.has_backer} onChange={(v) => update({ has_backer: v })} />
        <InfoTip id={hasBackerTipId}>Toggle if this bounty is sponsored — you can add sponsor name, logo and message.</InfoTip>
      </div>

      {state.data.has_backer && (
        <div className="rounded-lg border p-4 mb-6">
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Backer Name</label>
              <TextInput
                label=""
                value={state.data.backer.name}
                onChange={(v) => updateNested("backer", { name: v })}
                error={errors.backer_name}
                placeholder="Sponsor name"
              />
            </div>

            <div>
              <div className="mb-2">
                <label className="text-sm font-medium text-gray-700">Backer Logo</label>
                <InfoTip id={logoTipId}>Upload a square logo (recommended 200x200 px) or provide a direct image URL.</InfoTip>
              </div>

              <div className="space-y-2">
                <div className="border-dashed border-2 border-gray-200 rounded-md p-3 flex items-center justify-center">
                  <FileUpload onFile={onLogoFile} value={state.data.backer.logo} error={errors.backer_logo} />
                </div>

                <TextInput
                  label="Or logo URL"
                  value={typeof state.data.backer.logo === "string" ? state.data.backer.logo : ""}
                  onChange={onLogoURL}
                  placeholder="https://example.com/logo.png"
                />
                {errors.backer_logo && <p className="text-xs text-red-500">{errors.backer_logo}</p>}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Backer Message (optional)</label>
            <TextInput
              label=""
              value={state.data.backer.message}
              onChange={(v) => updateNested("backer", { message: v })}
              placeholder="Sponsor message (optional)"
            />
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={!!state.data.terms_accepted}
            onChange={(e) => update({ terms_accepted: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-200"
          />
          <span className="ml-2 text-sm text-gray-700">I accept the terms &amp; conditions</span>
        </label>

        <InfoTip id={termsTipId}>You must accept the terms and conditions before creating the bounty.</InfoTip>
      </div>
      {errors.terms_accepted && <p className="text-xs text-red-500 mt-1">{errors.terms_accepted}</p>}

      <div className="flex justify-between items-center mt-6">
        <Button variant="outlined" onClick={() => router.push("/wizard/step/1")}>
          Back
        </Button>
        <div className="flex justify-between mt-6">
          <div className="flex gap-3">
            <Button onClick={onNext}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}