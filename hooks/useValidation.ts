import { BountyData } from "../state/types";

export function validateStep1(data: BountyData) {
  const errors: Record<string, string> = {};
  if (!data.title || !data.title.trim()) errors.title = "Title is required";
  else if (data.title.length > 40) errors.title = "Title must be at most 40 characters";

  if (!data.description || !data.description.trim()) errors.description = "Description is required";

  if (data.mode === "physical" && (!data.location || !data.location.trim()))
    errors.location = "Location is required for physical mode";

  return errors;
}

export function validateStep2(data: BountyData) {
  const errors: Record<string, string> = {};
  if (!data.terms_accepted) errors.terms_accepted = "You must accept terms";
  if (data.has_backer) {
    if (!data.backer?.name) errors.backer_name = "Backer name required";
    if (!data.backer?.logo) errors.backer_logo = "Backer logo required";
  }
  return errors;
}

export function validateStep3(data: BountyData) {
  const errors: Record<string, string> = {};
  const amount = Number(data.reward?.amount);
  if (!data.reward || !data.reward.currency) errors.currency = "Currency required";
  if (!data.reward || isNaN(amount) || amount <= 0) errors.amount = "Amount must be greater than 0";

  const winners = Number(data.reward?.winners);
  if (!Number.isInteger(winners) || winners <= 0) errors.winners = "Winners must be an integer >= 1";

  if (!data.timeline || !data.timeline.expiration_date)
    errors.expiration_date = "Expiration date is required";

  if (data.hasImpactCertificate && !data.impactBriefMessage)
    errors.impactBriefMessage = "Impact brief is required";

  return errors;
}