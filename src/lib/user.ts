const USER_STORAGE_KEY = 'mypsy-user-id';

function generateId() {
  return 'usr_' + cryptoRandomString(18);
}

function cryptoRandomString(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const cryptoObj = typeof globalThis !== 'undefined' ? (globalThis.crypto as Crypto | undefined) : undefined;
  if (cryptoObj && 'getRandomValues' in cryptoObj) {
    const values = new Uint32Array(length);
    cryptoObj.getRandomValues(values);
    for (let i = 0; i < length; i += 1) {
      result += chars[values[i] % chars.length];
    }
    return result;
  }
  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function ensureUserId() {
  if (typeof window === 'undefined') return '';
  const existing = window.localStorage.getItem(USER_STORAGE_KEY);
  if (existing) return existing;
  const id = generateId();
  window.localStorage.setItem(USER_STORAGE_KEY, id);
  return id;
}
