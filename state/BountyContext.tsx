"use client";

import React, { createContext, useContext, useReducer } from "react";
import { BountyState, BountyData } from "./types";

const initialData: BountyData = {
  title: "",
  description: "",
  projectTitle: "",
  type: "Development",
  dominant_core: "Social",
  mode: "digital",
  location: "",
  reward: {
    currency: "USD",
    amount: "",
    winners: 1
  },
  timeline: {
    expiration_date: "",
    estimated_completion: { days: 0, hours: 0, minutes: 0 }
  },
  hasImpactCertificate: false,
  impactBriefMessage: "",
  sdgs: [],
  has_backer: false,
  backer: { name: "", logo: "", message: "" },
  terms_accepted: false
};

const initialState: BountyState = {
  step: 1,
  data: initialData,
  submitting: false,
  resultPayload: null
};

type Action =
  | { type: "UPDATE"; payload: Partial<BountyData> }
  | { type: "UPDATE_NESTED"; key: keyof BountyData; payload: any }
  | { type: "SET_STEP"; step: number }
  | { type: "SET_SUBMITTING"; value: boolean }
  | { type: "SET_RESULT"; payload: any | null }
  | { type: "RESET" };

function reducer(state: BountyState, action: Action): BountyState {
  switch (action.type) {
    case "UPDATE":
      return { ...state, data: { ...state.data, ...action.payload } };
    case "UPDATE_NESTED":
      return {
        ...state,
        data: {
          ...state.data,
          [action.key]: { ...(state.data[action.key] as any), ...action.payload }
        }
      };
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_SUBMITTING":
      return { ...state, submitting: action.value };
    case "SET_RESULT":
      return { ...state, resultPayload: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

type BountyContextValue = {
  state: BountyState;
  update: (payload: Partial<BountyData>) => void;
  updateNested: (key: keyof BountyData, payload: any) => void;
  setStep: (step: number) => void;
  setSubmitting: (value: boolean) => void;
  setResult: (payload: any | null) => void;
  reset: () => void;
};

const BountyContext = createContext<BountyContextValue | undefined>(undefined);

export function BountyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const update = (payload: Partial<BountyData>) => dispatch({ type: "UPDATE", payload });
  const updateNested = (key: keyof BountyData, payload: any) =>
    dispatch({ type: "UPDATE_NESTED", key, payload });
  const setStep = (step: number) => dispatch({ type: "SET_STEP", step });
  const setSubmitting = (value: boolean) => dispatch({ type: "SET_SUBMITTING", value });
  const setResult = (payload: any | null) => dispatch({ type: "SET_RESULT", payload });
  const reset = () => dispatch({ type: "RESET" });

  return (
    <BountyContext.Provider
      value={{ state, update, updateNested, setStep, setSubmitting, setResult, reset }}
    >
      {children}
    </BountyContext.Provider>
  );
}

export function useBounty() {
  const ctx = useContext(BountyContext);
  if (!ctx) throw new Error("useBounty must be used within BountyProvider");
  return ctx;
}