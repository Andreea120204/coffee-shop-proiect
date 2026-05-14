import { Injectable, signal, computed } from '@angular/core';

export interface User {
  username: string;
  token: string;
}

const STORAGE_KEY = 'coffee_shop_user';

// Credentiale demo
const CREDENTIALE_VALIDE: Record<string, string> = {
  admin: 'admin123',
  barista: 'cafea2025',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<User | null>(this.citesteDinStorage());

  readonly user = this._user.asReadonly();

  readonly isLoggedIn = computed(() => this._user() !== null);

  login(username: string, password: string): boolean {
    const parolaCorecta = CREDENTIALE_VALIDE[username];
    if (!parolaCorecta || parolaCorecta !== password) {
      return false;
    }

    const token = btoa(`${username}:${Date.now()}`);
    const user: User = { username, token };

    this._user.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return true;
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  getToken(): string | null {
    return this._user()?.token ?? null;
  }

  private citesteDinStorage(): User | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
