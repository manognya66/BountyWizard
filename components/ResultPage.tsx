"use client";
import React from "react";
import { useBounty } from "../state/BountyContext";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const { state, reset } = useBounty();
  const router = useRouter();
  const payload = state.resultPayload;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Bounty Payload</h2>
          <div className="flex gap-2">
            <Button variant="outlined" onClick={() => { reset(); router.push("/wizard/step/1"); }}>Create New</Button>
          </div>
        </div>

        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {payload ? JSON.stringify(payload, null, 2) : "No payload available"}
        </pre>
      </div>
    </div>
  );
}