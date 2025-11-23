"use client";
import React from "react";
import { useRouter } from "next/navigation";
import TextInput from "../ui/TextInput";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import RadioGroup from "../ui/RadioGroup";
import Button from "../ui/Button";
import { useBounty } from "../../state/BountyContext";
import { validateStep1 } from "../../hooks/useValidation";

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
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-14 w-64 z-10 rounded-md bg-gray-900 text-white text-xs p-2 opacity-0 scale-95 transform transition-all group-hover:opacity-100 group-focus-within:opacity-100 group-hover:scale-100 group-focus-within:scale-100"
      >
        {children}
      </div>
    </span>
  );
}

export default function Step1Basic(): React.ReactElement {
  const { state, update } = useBounty();
  const router = useRouter();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const typeOptions = ["Content", "Design", "Development", "Marketing", "Other"];
  const coreOptions = ["Water", "Earth", "Social", "Energy"];

  const initialRadius = (state.data as any).radius ?? "50";
  const [radius, setRadius] = React.useState<string>(initialRadius);

  const titleTipId = React.useId();
  const titleFieldTipId = React.useId();
  const descTipId = React.useId();
  const projectTipId = React.useId();
  const typeTipId = React.useId();
  const coreTipId = React.useId();
  const modeTipId = React.useId();
  const locationTipId = React.useId();
  const radiusTipId = React.useId();

  const onNext = () => {
    const errs = validateStep1(state.data);
    if (state.data.mode === "physical") {
      if (!state.data.location?.trim()) errs.location = "Location is required";
      const r = Number(radius);
      if (isNaN(r) || r <= 0) errs.radius = "Radius must be greater than 0";
    }
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      update({ radius } as any);
      router.push("/wizard/step/2");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Basic Details</h1>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Fill out the title, description and categorization. Accurate details help contributors decide quickly.
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold">Bounty Title</label>
            <InfoTip id={titleFieldTipId}>Short, descriptive title (max 40 characters).</InfoTip>
          </div>
          <TextInput
            label=""
            value={state.data.title}
            onChange={(v) => update({ title: v })}
            placeholder="Enter bounty title"
            error={errors.title}
            maxLength={40}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold">Bounty Description</label>
            <InfoTip id={descTipId}>Provide clear criteria for completion and any necessary details (required).</InfoTip>
          </div>
          <Textarea
            label=""
            value={state.data.description}
            onChange={(v) => update({ description: v })}
            placeholder="Describe the bounty — what to do, success criteria, deliverables."
            error={errors.description}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold">Project Title (optional)</label>
            <InfoTip id={projectTipId}>Link this bounty to an existing project or keep it standalone.</InfoTip>
          </div>
          <TextInput
            label=""
            value={state.data.projectTitle}
            onChange={(v) => update({ projectTitle: v })}
            placeholder="Project Title (optional)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-semibold">Bounty Type</label>
              <InfoTip id={typeTipId}>Choose the category that best fits the task (content, design, development, etc.).</InfoTip>
            </div>
            <Select
              label=""
              value={state.data.type}
              onChange={(v) => update({ type: v })}
              options={typeOptions}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-semibold">Dominant Impact Core</label>
              <InfoTip id={coreTipId}>Select which impact core this bounty primarily contributes to.</InfoTip>
            </div>
            <Select
              label=""
              value={state.data.dominant_core}
              onChange={(v) => update({ dominant_core: v })}
              options={coreOptions}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold">Bounty Mode</label>
            <InfoTip id={modeTipId}>Digital: fully remote. Physical: requires a location and radius.</InfoTip>
          </div>
          <RadioGroup
            label=""
            options={[
              { label: "Digital", value: "digital" },
              { label: "Physical", value: "physical" }
            ]}
            value={state.data.mode}
            onChange={(v) => update({ mode: v as any })}
          />
        </div>

        {state.data.mode === "physical" && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <label className="text-lg font-semibold text-blue-600">Location Details</label>
              <InfoTip id={locationTipId}>Where the bounty is available — city/town and radius (km).</InfoTip>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
              <div className="flex flex-col md:flex-col md:items-start md:gap-6 space-y-4 md:space-y-0">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium">City / Town where the bounty is live*?</label>
                  </div>
                  <TextInput
                    label=""
                    value={state.data.location ?? ""}
                    onChange={(v) => update({ location: v })}
                    placeholder="e.g. New York"
                    error={errors.location}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium">Enter Bounty Radius (in Kms)*</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                      onBlur={() => update({ radius } as any)}
                      className="w-full sm:w-36 px-3 py-2 border rounded focus:outline-none focus:ring"
                      placeholder="50"
                    />
                    <span className="text-xl text-gray-500">km</span>
                  </div>
                  {errors.radius && <p className="text-xs text-red-500 mt-1">{errors.radius}</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button variant="outlined" onClick={() => router.back()}>
          Back
        </Button>

        <Button onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}