export type Mode = "digital" | "physical";

export interface Reward {
  currency: string;
  amount: number | string;
  winners: number;
}

export interface EstimatedCompletion {
  days: number;
  hours: number;
  minutes: number;
}

export interface Timeline {
  expiration_date: string;
  estimated_completion: EstimatedCompletion;
}

export interface Backer {
  name: string;
  logo: string | File;
  message?: string;
}

export interface BountyData {
  title: string;
  description: string;
  projectTitle?: string;
  type: string;
  dominant_core: string;
  mode: Mode;
  location?: string;
  reward: Reward;
  timeline: Timeline;
  hasImpactCertificate: boolean;
  impactBriefMessage?: string;
  sdgs: string[];
  has_backer: boolean;
  backer: Backer;
  terms_accepted: boolean;
}

export interface BountyState {
  step: number;
  data: BountyData;
  submitting: boolean;
  resultPayload: any | null;
}