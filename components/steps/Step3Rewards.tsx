"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Select from "../ui/Select";
import NumberInput from "../ui/NumberInput";
import TextArea from "../ui/Textarea";
import Toggle from "../ui/Toggle";
import Button from "../ui/Button";
import { useBounty } from "../../state/BountyContext";
import { validateStep3 } from "../../hooks/useValidation";

const currencyOptions = ["INR", "USD", "EUR", "GBP", "AUD"];

const sdgOptions = [
  "No Poverty",
  "Zero Hunger",
  "Good Health",
  "Quality Education",
  "Gender Equality",
  "Clean Water",
  "Affordable Energy",
  "Decent Work"
];

const conversionRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  INR: 83,
  GBP: 0.78,
  AUD: 1.52
};

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  INR: "₹",
  GBP: "£",
  AUD: "$"
};

function convertAllCurrencies(amount: number, from: string) {
  if (!amount || !conversionRates[from]) return null;
  const amountInUsd = amount / conversionRates[from];
  const converted: Record<string, number> = {};
  for (const cur of Object.keys(conversionRates)) {
    converted[cur] = amountInUsd * conversionRates[cur];
  }
  return converted;
}

/* ===== Fixed InfoTip: hidden by default, visible on hover/focus, NO animations ===== */
function InfoTip({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <span className="relative inline-flex items-center ml-2 group" aria-hidden>
      <button
        aria-describedby={id}
        type="button"
        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 focus:outline-none"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2a10 10 0 110 20 10 10 0 010-20z" stroke="currentColor" strokeWidth="1.2" />
          <path d="M11.25 11h1.5v5h-1.5zM11.25 7.75h1.5v1.5h-1.5z" fill="currentColor" />
        </svg>
      </button>

      {/* Hidden by default; becomes visible on hover or focus within the parent .group */}
      <div
        id={id}
        role="tooltip"
        className="hidden group-hover:block group-focus-within:block absolute left-1/2 -translate-x-1/2 -top-14 w-56 z-10 rounded-md bg-gray-800 text-white text-xs p-2"
      >
        {children}
      </div>
    </span>
  );
}

function computeRemainingFrom(exp?: string) {
  if (!exp) return null;
  const d = new Date(exp);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let diff = d.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };

  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  diff -= days * 24 * 60 * 60 * 1000;
  const hours = Math.floor(diff / (60 * 60 * 1000));
  diff -= hours * 60 * 60 * 1000;
  const minutes = Math.floor(diff / (60 * 1000));

  return { days, hours, minutes, expired: false };
}

function formatRemaining(rem: { days: number; hours: number; minutes: number } | null) {
  if (rem === null) return "—";
  if ((rem as any).expired) return "Expired";
  const parts: string[] = [];
  if (rem.days > 0) parts.push(`${rem.days} day${rem.days > 1 ? "s" : ""}`);
  if (rem.hours > 0) parts.push(`${rem.hours} hour${rem.hours > 1 ? "s" : ""}`);
  if (rem.minutes > 0 || parts.length === 0) parts.push(`${rem.minutes} minute${rem.minutes !== 1 ? "s" : ""}`);
  return parts.join(" ");
}

export default function Step3Rewards() {
  const [submittingLocal, setSubmittingLocal] = React.useState(false);
  const { state, update, updateNested, setResult } = useBounty();
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [remaining, setRemaining] = React.useState<{ days: number; hours: number; minutes: number; expired?: boolean } | null>(null);
  const router = useRouter();

  const syncExpiration = (value?: string) => {
    updateNested("timeline", { expiration_date: value ?? "" });
    const rem = computeRemainingFrom(value ?? "");
    if (rem) {
      updateNested("timeline", { estimated_completion: { days: rem.days, hours: rem.hours, minutes: rem.minutes } });
    } else {
      updateNested("timeline", { estimated_completion: { days: 0, hours: 0, minutes: 0 } });
    }
    setRemaining(rem as any);
  };

  React.useEffect(() => {
    if (state.data.timeline?.expiration_date) {
      syncExpiration(state.data.timeline.expiration_date);
    } else {
      setRemaining(null);
    }
  }, []);

  const onToggleImpact = (val: boolean) =>
    update({ hasImpactCertificate: val, impactBriefMessage: val ? state.data.impactBriefMessage : "" });

  const onToggleSDG = (sdg: string) => {
    const existing = state.data.sdgs || [];
    const isSelected = existing.includes(sdg);

    if (isSelected) {
      update({ sdgs: existing.filter((s) => s !== sdg) });
    } else {
      if (existing.length >= 4) {
        return;
      }
      update({ sdgs: [...existing, sdg] });
    }
  };

  const convertedAmounts = React.useMemo(() => {
    const amt = Number(state.data.reward.amount);
    if (!amt || Number.isNaN(amt)) return null;
    return convertAllCurrencies(amt, state.data.reward.currency);
  }, [state.data.reward.amount, state.data.reward.currency]);

  const onCreate = async () => {
    const errs = validateStep3(state.data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      title: state.data.title,
      description: state.data.description,
      projectTitle: state.data.projectTitle,
      type: state.data.type,
      dominant_core: state.data.dominant_core,
      mode: state.data.mode,
      ...(state.data.mode === "physical" ? { location: state.data.location } : {}),
      radius: (state.data as any).radius ?? "",
      reward: {
        currency: state.data.reward.currency,
        amount: Number(state.data.reward.amount),
        winners: Number(state.data.reward.winners)
      },
      timeline: {
        expiration_date: state.data.timeline.expiration_date
          ? new Date(state.data.timeline.expiration_date).toISOString()
          : "",
        estimated_completion: {
          days: Number(state.data.timeline.estimated_completion.days),
          hours: Number(state.data.timeline.estimated_completion.hours),
          minutes: Number(state.data.timeline.estimated_completion.minutes)
        }
      },
      hasImpactCertificate: !!state.data.hasImpactCertificate,
      ...(state.data.hasImpactCertificate ? { impactBriefMessage: state.data.impactBriefMessage } : {}),
      sdgs: state.data.sdgs ?? [],
      has_backer: !!state.data.has_backer,
      ...(state.data.has_backer
        ? {
            backer: {
              name: state.data.backer.name,
              logo: state.data.backer.logo,
              message: state.data.backer.message
            }
          }
        : {}),
      terms_accepted: !!state.data.terms_accepted,
      failure_threshold: (state.data as any).failure_threshold ?? "",
      maximumImpactPoints: (state.data as any).maximumImpactPoints ?? 175
    };

    setSubmittingLocal(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      const finalPayload = json.payload ?? payload;
      setResult(finalPayload);

      try {
        localStorage.setItem("lastBounty", JSON.stringify(finalPayload));
      } catch (e) {
        console.warn("Could not persist lastBounty to localStorage", e);
      }

      setSubmittingLocal(false);
      router.push("/confirmation");
    } catch (err) {
      setSubmittingLocal(false);
      console.error("submit failed", err);

      setResult(payload);
      try {
        localStorage.setItem("lastBounty", JSON.stringify(payload));
      } catch (e) {
        console.warn("Could not persist lastBounty to localStorage", e);
      }
      router.push("/confirmation");
    }
  };

  const selectedSdgs: string[] = state.data.sdgs || [];
  const sdgCount = selectedSdgs.length;
  const maxSdgs = 4;

  return (
    <div>
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-bold">Bounty Reward</h2>
        <p>Choose bounty reward token and set the amount.</p>
      </div>

      <section className="mb-6">
        <div className="mt-4 grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Reward Token</label>
            <Select
              value={state.data.reward.currency}
              onChange={(v) => updateNested("reward", { currency: v })}
              options={currencyOptions}
              error={errors.currency}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">What is your budget for this bounty?*</label>
            <NumberInput
              value={state.data.reward.amount}
              onChange={(v) => updateNested("reward", { amount: v })}
              error={errors.amount}
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">How many winners?*</label>
            <NumberInput
              value={state.data.reward.winners}
              onChange={(v) => updateNested("reward", { winners: v })}
              error={errors.winners}
              min={1}
            />
          </div>

          <div className="text-sm font-medium mt-2">
            Each winner will be awarded:{" "}
            <span className="font-semibold">
              {state.data.reward.amount && state.data.reward.winners
                ? `${(Number(state.data.reward.amount) / Number(state.data.reward.winners)).toFixed(2)} ${state.data.reward.currency}`
                : "—"}
            </span>
          </div>

          {convertedAmounts && (
            <div className="mt-3 text-sm">
              <h4 className="font-semibold mb-1">Converted Amounts</h4>
              <div className="grid grid-cols-2 gap-1 text-gray-700">
                {Object.entries(convertedAmounts).map(([cur, val]) => (
                  <div key={cur} className="flex items-center gap-2">
                    <span className="w-12 font-medium">{cur}:</span>
                    <span className="font-semibold">
                      {currencySymbols[cur] ?? ""}{val.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm font-medium text-gray-700">
            Maximum Impact Points allocated: <span className="font-semibold">175</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Set Failure Threshold %*</label>
            <NumberInput
              value={(state.data as any).failure_threshold ?? ""}
              onChange={(v) => update({ failure_threshold: v} as any)}
              min={0}
              max={100}
            />
          </div>
        </div>
      </section>

      <section className="mb-6">
        <div className="mt-3 grid gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Expiration Date &amp; Time</label>
            <input
              type="datetime-local"
              value={state.data.timeline.expiration_date ?? ""}
              onChange={(e) => syncExpiration(e.target.value)}
              className="w-full rounded-lg px-3 py-2 border border-gray-300 focus:outline-none"
            />
            {errors.expiration_date && <p className="text-xs text-red-500 mt-1">{errors.expiration_date}</p>}
          </div>

          <div className="mt-2">
            <div className="flex items-center mb-2">
              <label className="text-sm font-medium inline-block">Time Remaining</label>
              <InfoTip id="timeline-tip">Automatically calculated from the expiration date you selected.</InfoTip>
            </div>
            <div className="text-1xl text-gray-900 bg-gray-50 rounded-md px-3 py-2">
              {remaining ? ((remaining as any).expired ? "Expired" : formatRemaining(remaining)) : "—"}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center">
          <h3 className="font-semibold">Impact Certificate</h3>
          <InfoTip id="impact-tip">Indicate if your bounty includes an impact certificate. If yes, provide a short impact brief.</InfoTip>
        </div>

        <div className="mt-3">
          <Toggle label="Has Impact Certificate?" checked={!!state.data.hasImpactCertificate} onChange={onToggleImpact} />
          {state.data.hasImpactCertificate && (
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Impact Brief</label>
              <TextArea
                value={state.data.impactBriefMessage}
                onChange={(v) => update({ impactBriefMessage: v })}
                error={errors.impactBriefMessage}
              />
            <p className="mt-2 text-1xl">Max 100 words</p>
            </div>
          )}
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center">
          <h3 className="font-semibold">SDGs</h3>
          <InfoTip id="sdg-tip">Select the Sustainable Development Goals your bounty contributes to.</InfoTip>
        </div>

        <p className="text-sm text-gray-600 mt-2">You may choose up to <span className="font-semibold">4</span> outlined SDGs (optional).</p>

        <div className="grid grid-cols-2 gap-2 mt-3">
          {sdgOptions.map((s) => {
            const isSelected = selectedSdgs.includes(s);
            const disableOther = !isSelected && sdgCount >= maxSdgs;
            return (
              <label key={s} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSDG(s)}
                  className="w-4 h-4"
                  disabled={disableOther}
                />
                <span className={`text-sm ${disableOther ? "text-gray-400" : ""}`}>{s}</span>
              </label>
            );
          })}
        </div>
      </section>

      <div className="flex justify-between items-center mt-6">
        <Button onClick={() => router.back()} variant="outlined">
          Back
        </Button>
        <Button onClick={onCreate} disabled={submittingLocal}>
          {submittingLocal ? "Publishing" : "Publish Bounty"}
        </Button>
      </div>
    </div>
  );
}