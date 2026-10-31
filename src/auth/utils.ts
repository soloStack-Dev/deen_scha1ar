import type { AuthSession, StoredAuth, StoredUser } from './types.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(normalizeEmail(value));
}

export function isValidPassword(value: string): boolean {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /[0-9]/.test(value);
}

export function isValidName(value: string): boolean {
  const name = value.trim();
  return name.length >= 2 && name.length <= 60;
}

export function passwordStrength(value: string): number {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[A-Za-z]/.test(value) && /[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return Math.min(4, score);
}

export function passwordStrengthLabel(score: number): string {
  if (score >= 4) return 'Strong';
  if (score === 3) return 'Good';
  if (score === 2) return 'Fair';
  if (score === 1) return 'Weak';
  return 'Use 8+ characters with a letter and a number';
}

function hashString(value: string, seed: number): string {
  let hash = seed >>> 0;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(36);
}

export function createSalt(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export function hashPassword(password: string, salt: string): string {
  let hash = hashString(`${salt}:${password}`, 2166136261);
  for (let round = 0; round < 48; round += 1) {
    hash = hashString(`${salt}:${hash}:${password}`, 2166136261);
  }
  return hash;
}

export function createToken(): string {
  return `${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 10)}.${Math.random().toString(36).slice(2, 10)}`;
}

export function createSession(user: StoredUser, remember: boolean): AuthSession {
  return {
    userId: user.id,
    token: createToken(),
    remember,
    signedInAt: Date.now(),
  };
}

export function parseStoredAuth(raw: string | null): StoredAuth | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<StoredAuth> | null;
    if (!value || !Array.isArray(value.users)) return null;
    const users = value.users.filter((user): user is StoredUser => {
      return (
        !!user &&
        typeof user.id === 'string' &&
        typeof user.name === 'string' &&
        typeof user.email === 'string' &&
        typeof user.createdAt === 'number' &&
        typeof user.salt === 'string' &&
        typeof user.passwordHash === 'string' &&
        (typeof user.avatar === 'undefined' || typeof user.avatar === 'string')
      );
    });
    const session = value.session;
    const validSession =
      session &&
      typeof session.userId === 'string' &&
      typeof session.token === 'string' &&
      typeof session.remember === 'boolean' &&
      typeof session.signedInAt === 'number' &&
      users.some((user) => user.id === session.userId)
        ? session
        : null;

    return { users, session: validSession };
  } catch {
    return null;
  }
}
