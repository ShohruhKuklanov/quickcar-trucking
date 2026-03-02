const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export function isNegotiationIntent(text) {
  return /too expensive|too high|better price|lower quote|best price/i.test(String(text ?? ""));
}

export function isHumanRequest(text) {
  return /call me|speak to someone|talk to someone|human|agent|representative/i.test(String(text ?? ""));
}

export function nextNegotiationLevel(currentLevel, message) {
  const level = Number.isFinite(currentLevel) ? currentLevel : 0;
  if (!isNegotiationIntent(message)) return clamp(level, 0, 3);
  return clamp(level + 1, 0, 3);
}

export function discountForLevel(level) {
  if (level === 1) return 0.03;
  if (level >= 2) return 0.05;
  return 0;
}

export function applyNegotiationDiscount(price, level, marginFloor) {
  const p = Number.isFinite(price) ? price : 0;
  const floor = Number.isFinite(marginFloor) ? marginFloor : 0;
  const discount = discountForLevel(level);

  if (!discount) return Math.round(p);

  const discounted = Math.round(p * (1 - discount));
  return Math.max(Math.round(floor), discounted);
}

export function shouldEscalate({ negotiationLevel, price, message }) {
  const nl = Number.isFinite(negotiationLevel) ? negotiationLevel : 0;
  const p = Number.isFinite(price) ? price : 0;
  return nl >= 2 || p > 2500 || isHumanRequest(message);
}
