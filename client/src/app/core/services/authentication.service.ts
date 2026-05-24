// authentication.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment';
import { AuthResponse, AuthRequest } from '../models/auth.interfaces';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  login(credentials: { email: string; password: string; scope_gg_session: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiAuthUrl}/login`, credentials).pipe(
      tap(response => {
        this.handleResponse(response);
        if (response.success) {
          this.tokenService.setScopeGgSession(credentials.scope_gg_session);
        }
      })
    );
  }

  register(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiAuthUrl}/register`, authRequest).pipe(
      tap(response => this.handleResponse(response))
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post<AuthResponse>(`${environment.apiAuthUrl}/refresh`, { refreshToken }).pipe(
      tap(response => this.handleResponse(response))
    );
  }

  logout(): void {
    this.tokenService.clearTokens();
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasValidToken();
  }


  private handleResponse(response: AuthResponse): void {
    if (response.success) {
      this.tokenService.setTokens(response.token.accessToken, response.token.refreshToken, response.token.expiration);
    }
  }
}