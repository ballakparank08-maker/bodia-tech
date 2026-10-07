export interface GoogleAuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isAdmin: boolean;
  provider: 'google' | 'password';
}

// Strict Single Administrator Rule
export const SOLE_ADMIN_EMAIL = 'ballakparank08@gmail.com';
export const AUTHORIZED_ADMIN_EMAILS = [SOLE_ADMIN_EMAIL];

export const AUTH_STORAGE_KEY = 'bodiatech_google_auth_user';

export function isAuthorizedAdmin(email?: string): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SOLE_ADMIN_EMAIL.toLowerCase();
}

export function getStoredAuthUser(): GoogleAuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      isAdmin: isAuthorizedAdmin(parsed.email),
    };
  } catch {
    return null;
  }
}

export function saveStoredAuthUser(user: GoogleAuthUser | null) {
  try {
    if (!user) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Failed to store auth user:', e);
  }
}

export function createGoogleUserFromEmail(
  email: string,
  name?: string,
  avatar?: string
): GoogleAuthUser {
  const isAdmin = isAuthorizedAdmin(email);
  return {
    id: `g-${btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`,
    email: email.trim().toLowerCase(),
    name: name || email.split('@')[0].replace('.', ' '),
    avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
    isAdmin,
    provider: 'google',
  };
}
