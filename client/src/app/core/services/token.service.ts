// token.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly TOKEN_EXPIRATION_KEY = 'tokenExpiration';
  private readonly SCOPE_GG_SESSION_KEY = 'scopeGgSession';

  setTokens(accessToken: string, refreshToken: string, expiration: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.TOKEN_EXPIRATION_KEY, expiration);
  }

  setScopeGgSession(session: string): void {
    localStorage.setItem(this.SCOPE_GG_SESSION_KEY, session);
  }

  getScopeGgSession(): string | null {
    return localStorage.getItem(this.SCOPE_GG_SESSION_KEY);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getTokenExpiration(): string | null {
    return localStorage.getItem(this.TOKEN_EXPIRATION_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRATION_KEY);
    localStorage.removeItem(this.SCOPE_GG_SESSION_KEY);
  }

  isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    if (!expiration) {
      return true;
    }
    return new Date(expiration) <= new Date();
  }

  hasValidToken(): boolean {
    return !!this.getAccessToken() && !this.isTokenExpired();
  }
}