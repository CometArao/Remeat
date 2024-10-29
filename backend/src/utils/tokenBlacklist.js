// tokenBlacklist.js
const tokenBlacklist = new Set();

export function addTokenToBlacklist(token) {
  tokenBlacklist.add(token);
}

export function isTokenBlacklisted(token) {
  return tokenBlacklist.has(token);
}
