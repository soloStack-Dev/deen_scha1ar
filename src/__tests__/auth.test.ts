import { expect, test } from '@rstest/core';

import {
  createSession,
  hashPassword,
  isValidEmail,
  isValidName,
  isValidPassword,
  normalizeEmail,
  parseStoredAuth,
  passwordStrength,
  passwordStrengthLabel,
} from '../auth/utils.js';
import type { StoredUser } from '../auth/types.js';

const user: StoredUser = {
  id: 'user-1',
  name: 'Faleel',
  email: 'faleel@example.com',
  salt: 'salt',
  passwordHash: 'hash',
  createdAt: 1,
};

test('email validation normalizes case and whitespace', () => {
  expect(normalizeEmail('  Faleel@Example.COM ')).toBe('faleel@example.com');
  expect(isValidEmail('faleel@example.com')).toBe(true);
  expect(isValidEmail('not-an-email')).toBe(false);
  expect(isValidEmail('')).toBe(false);
});

test('passwords need eight characters, a letter and a number', () => {
  expect(isValidPassword('deen1234')).toBe(true);
  expect(isValidPassword('short1')).toBe(false);
  expect(isValidPassword('onlyletters')).toBe(false);
  expect(isValidPassword('12345678')).toBe(false);
});

test('names are trimmed and bounded', () => {
  expect(isValidName('Faleel')).toBe(true);
  expect(isValidName(' F ')).toBe(false);
  expect(isValidName('   ')).toBe(false);
});

test('password strength grows with length and variety', () => {
  expect(passwordStrength('')).toBe(0);
  expect(passwordStrength('deen1234')).toBe(2);
  expect(passwordStrength('deen1234!extra')).toBe(4);
  expect(passwordStrengthLabel(4)).toBe('Strong');
  expect(passwordStrengthLabel(0)).toContain('8+ characters');
});

test('password hashes are salted and never equal the password', () => {
  const first = hashPassword('deen1234', 'salt-a');
  const second = hashPassword('deen1234', 'salt-b');

  expect(first).not.toBe('deen1234');
  expect(first).not.toBe(second);
  expect(hashPassword('deen1234', 'salt-a')).toBe(first);
});

test('sessions remember the chosen persistence flag', () => {
  const session = createSession(user, true);

  expect(session.userId).toBe(user.id);
  expect(session.remember).toBe(true);
  expect(session.token.length).toBeGreaterThan(10);
});

test('stored auth is validated before it is trusted', () => {
  const valid = parseStoredAuth(
    JSON.stringify({ users: [user], session: createSession(user, false) }),
  );
  expect(valid?.users).toHaveLength(1);
  expect(valid?.session?.userId).toBe(user.id);

  const orphan = parseStoredAuth(
    JSON.stringify({
      users: [user],
      session: { ...createSession(user, false), userId: 'missing' },
    }),
  );
  expect(orphan?.session).toBeNull();

  expect(parseStoredAuth('{"users":"nope"}')).toBeNull();
  expect(parseStoredAuth('not json')).toBeNull();
  expect(parseStoredAuth(null)).toBeNull();
});
