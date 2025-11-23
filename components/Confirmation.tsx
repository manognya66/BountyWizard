"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "./ui/Button"; 
import { useBounty } from "../state/BountyContext";

function KeyValue({ k, v }: { k: string; v: any }) {
  if (v === null || v === undefined || v === "") return null;
  const pretty = typeof v === "object" ? JSON.stringify(v) : String(v);
  return (
    <div className="flex gap-4 py-1">
      <div className="w-48 text-sm text-gray-600">{k}</div>
      <div className="text-sm text-gray-900 break-words">{pretty}</div>
    </div>
  );
}

function formatEstimatedCompletion(ec: any) {
  if (!ec) return "—";
  const days = Number(ec.days) || 0;
  const hours = Number(ec.hours) || 0;
  const minutes = Number(ec.minutes) || 0;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  return parts.join(" ");
}

function formatLocalDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  const time24 = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata"
  });

  const time12 = d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata"
  });

  const date = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata"
  });

  return `${date}, ${time24} (${time12})`;
}

export default function Confirmation() {
  const { state, reset } = useBounty();
  const router = useRouter();

  const [payload, setPayload] = React.useState<any | null>(state.resultPayload ?? null);
  const [jsonOpen, setJsonOpen] = React.useState(false);

  React.useEffect(() => {
    if (state.resultPayload) {
      setPayload(state.resultPayload);
      try {
        localStorage.setItem("lastBounty", JSON.stringify(state.resultPayload));
      } catch {}
      return;
    }

    try {
      const saved = localStorage.getItem("lastBounty");
      if (saved) setPayload(JSON.parse(saved));
    } catch (e) {
      console.warn("Could not read lastBounty from localStorage", e);
    }
  }, [state.resultPayload]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload ?? {}, null, 2));
      alert("Payload copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  const onBackToWizard = () => router.push("/wizard/step/1");
  const onCreateAnother = () => {
    reset();
    try {
      localStorage.removeItem("lastBounty");
    } catch {}
    router.push("/wizard/step/1");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!payload ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-3">No submission found</h2>
          <p className="text-gray-600 mb-6">Go back to the wizard to create a bounty.</p>
          <div className="flex justify-center gap-3">
            <Button onClick={onBackToWizard}>Back to wizard</Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Bounty created</h1>
              <p className="text-sm text-gray-600">Your bounty was submitted successfully.</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outlined" onClick={onCreateAnother}>Create another</Button>
              <Button onClick={onCopy}>Copy JSON</Button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Summary</h3>
              <p className="text-sm text-gray-500">A quick overview of the submitted bounty.</p>
            </div>

            <div className="divide-y">
              <div className="py-2">
                <KeyValue k="Title" v={payload.title} />
                <KeyValue k="Description" v={payload.description} />
                <KeyValue k="Project" v={payload.projectTitle} />
                <KeyValue k="Type" v={payload.type} />
                <KeyValue k="Dominant core" v={payload.dominant_core} />
                <KeyValue k="Mode" v={payload.mode} />
                {payload.mode === "physical" && <KeyValue k="Location" v={payload.location} />}
                <KeyValue k="Radius (km)" v={payload.radius ?? "—"} />
              </div>

              <div className="py-2">
                <h4 className="text-sm font-semibold mb-2">Reward</h4>
                <KeyValue k="Currency" v={payload.reward?.currency} />
                <KeyValue k="Total amount" v={payload.reward?.amount} />
                <KeyValue k="Winners" v={payload.reward?.winners} />
                <KeyValue
                  k="Each winner"
                  v={
                    payload.reward?.amount && payload.reward?.winners
                      ? `${(Number(payload.reward.amount) / Number(payload.reward.winners)).toFixed(2)} ${payload.reward.currency}`
                      : "—"
                  }
                />
                <KeyValue k="Failure threshold %" v={payload.failure_threshold ?? "—"} />
                <KeyValue k="Maximum Impact Points" v={payload.maximumImpactPoints ?? "175"} />
              </div>

              <div className="py-2">
                <h4 className="text-sm font-semibold mb-2">Timeline</h4>
                <KeyValue k="Expiration" v={formatLocalDate(payload.timeline?.expiration_date)} />
                <KeyValue k="Estimated completion" v={formatEstimatedCompletion(payload.timeline?.estimated_completion)} />
              </div>

              <div className="py-2">
                <h4 className="text-sm font-semibold mb-2">Impact & SDGs</h4>
                <KeyValue k="Has impact certificate" v={payload.hasImpactCertificate ? "Yes" : "No"} />
                {payload.hasImpactCertificate && <KeyValue k="Impact brief" v={payload.impactBriefMessage} />}
                <KeyValue
                  k="SDGs"
                  v={payload.sdgs && Array.isArray(payload.sdgs) && payload.sdgs.length ? payload.sdgs.join(", ") : "—"}
                />
              </div>

              <div className="py-2">
                <h4 className="text-sm font-semibold mb-2">Backer</h4>
                <KeyValue k="Has backer" v={payload.has_backer ? "Yes" : "No"} />
                {payload.has_backer && <KeyValue k="Backer" v={JSON.stringify(payload.backer)} />}
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="text-sm text-blue-600 underline"
                onClick={() => setJsonOpen((s) => !s)}
              >
                {jsonOpen ? "Hide JSON" : "Show full JSON"}
              </button>

              {jsonOpen && (
                <pre className="mt-3 p-3 bg-gray-50 rounded text-xs overflow-auto border">
                  {JSON.stringify(payload, null, 2)}
                </pre>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outlined" onClick={onBackToWizard}>Back to wizard</Button>
            <div />
          </div>
        </div>
      )}
    </div>
  );
}