"use client";

import { useSyncExternalStore } from "react";

export type QuotePrefillSnapshot = {
  pickupState: string;
  deliveryState: string;
  updatedAt: number;
};

let snapshot: QuotePrefillSnapshot = {
  pickupState: "",
  deliveryState: "",
  updatedAt: 0,
};

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeQuotePrefill(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getQuotePrefillSnapshot() {
  return snapshot;
}

export function setPickupState(value: string) {
  snapshot = { ...snapshot, pickupState: value, updatedAt: Date.now() };
  emit();
}

export function setDeliveryState(value: string) {
  snapshot = { ...snapshot, deliveryState: value, updatedAt: Date.now() };
  emit();
}

export function clearQuotePrefill() {
  snapshot = { pickupState: "", deliveryState: "", updatedAt: Date.now() };
  emit();
}

export function useQuotePrefill() {
  return useSyncExternalStore(subscribeQuotePrefill, getQuotePrefillSnapshot, getQuotePrefillSnapshot);
}
