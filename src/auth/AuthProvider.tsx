import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';

import { readStoredItem, writeStoredItem } from '../native/storage.js';
import type {
  AuthResult,
  AuthSession,
  AuthUser,
  StoredAuth,
  StoredUser,
} from './types.js';
import {
  createSalt,
  createSession,
  hashPassword,
  isValidEmail,
  isValidName,
  isValidPassword,
  normalizeEmail,
  parseStoredAuth,
} from './utils.js';

const AUTH_STORAGE_KEY = 'dinam.auth.v1';

interface AuthContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  hydrated: boolean;
  signIn: (email: string, password: string, remember: boolean) => AuthResult;
  signUp: (
    name: string,
    email: string,
    password: string,
    remember: boolean,
  ) => AuthResult;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function createId(): string {
  return `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function persist(users: StoredUser[], session: AuthSession | null) {
  const data: StoredAuth = {
    users,
    session: session?.remember ? session : null,
  };
  void writeStoredItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

export function AuthProvider({ children }: { children?: ReactNode }) {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    'background only';
    let cancelled = false;

    async function hydrate() {
      const raw = await readStoredItem(AUTH_STORAGE_KEY);
      if (cancelled) return;
      const stored = parseStoredAuth(raw);
      if (stored) {
        setUsers(stored.users);
        setSession(stored.session);
      }
      setHydrated(true);
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  function commit(nextUsers: StoredUser[], nextSession: AuthSession | null) {
    'background only';
    setUsers(nextUsers);
    setSession(nextSession);
    persist(nextUsers, nextSession);
  }

  function signIn(
    email: string,
    password: string,
    remember: boolean,
  ): AuthResult {
    'background only';
    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) {
      return { ok: false, error: 'Enter a valid email address.' };
    }
    if (!password) {
      return { ok: false, error: 'Enter your password.' };
    }
    const account = users.find((item) => item.email === normalized);
    if (!account) {
      return {
        ok: false,
        error: 'No account found for this email. Create an account first.',
      };
    }
    if (hashPassword(password, account.salt) !== account.passwordHash) {
      return { ok: false, error: 'Email or password is incorrect.' };
    }
    commit(users, createSession(account, remember));
    return { ok: true };
  }

  function signUp(
    name: string,
    email: string,
    password: string,
    remember: boolean,
  ): AuthResult {
    'background only';
    const trimmedName = name.trim();
    const normalized = normalizeEmail(email);
    if (!isValidName(trimmedName)) {
      return { ok: false, error: 'Enter your name.' };
    }
    if (!isValidEmail(normalized)) {
      return { ok: false, error: 'Enter a valid email.' };
    }
    if (!isValidPassword(password)) {
      return {
        ok: false,
        error: 'Use 8+ characters with a letter and a number.',
      };
    }
    if (users.some((item) => item.email === normalized)) {
      return {
        ok: false,
        error: 'This email is already registered. Log in instead.',
      };
    }

    const salt = createSalt();
    const account: StoredUser = {
      id: createId(),
      name: trimmedName,
      email: normalized,
      createdAt: Date.now(),
      salt,
      passwordHash: hashPassword(password, salt),
    };
    const nextUsers = [...users, account];
    commit(nextUsers, createSession(account, remember));
    return { ok: true };
  }

  function signOut() {
    'background only';
    commit(users, null);
  }

  const user = useMemo(() => {
    if (!session) return null;
    const account = users.find((item) => item.id === session.userId);
    if (!account) return null;
    return {
      id: account.id,
      name: account.name,
      email: account.email,
      createdAt: account.createdAt,
    };
  }, [session, users]);

  const value = useMemo(
    () => ({ user, session, hydrated, signIn, signUp, signOut }),
    [user, session, hydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
