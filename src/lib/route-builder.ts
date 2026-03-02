import { STATE_COORDS } from "@/lib/state-coords";

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function haversineMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 3958.7613; // Earth radius (miles)
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  const c = 2 * Math.asin(Math.min(1, Math.sqrt(h)));
  return R * c;
}

export function estimateTransitDays(distanceMiles: number) {
  const miles = Number.isFinite(distanceMiles) ? Math.max(0, distanceMiles) : 0;
  const days = miles / 550;
  const low = Math.max(1, Math.floor(days));
  const high = Math.max(low, Math.ceil(days));

  const label = low === high ? `${low} Day${low === 1 ? "" : "s"}` : `${low}–${high} Days`;
  return { low, high, label };
}

export function distanceBetweenStatesMiles(pickup: string | null, delivery: string | null) {
  if (!pickup || !delivery) return null;
  const a = STATE_COORDS[pickup];
  const b = STATE_COORDS[delivery];
  if (!a || !b) return null;
  const miles = haversineMiles(a, b);
  return Number.isFinite(miles) ? miles : null;
}
