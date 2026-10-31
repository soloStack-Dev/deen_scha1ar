export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}

export interface StoredUser extends AuthUser {
  salt: string;
  passwordHash: string;
}

export interface AuthSession {
  userId: string;
  token: string;
  remember: boolean;
  signedInAt: number;
}

export interface StoredAuth {
  users: StoredUser[];
  session: AuthSession | null;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
}
