import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenServiceService {
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private roleKey = 'ROLE_KEY';
  private Id_Key = 'Id_Key';
  helper = new JwtHelperService();
  saveToken(token: string): void {
    localStorage.setItem(this.accessTokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  saveRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  saveRole(role: string): void {
    localStorage.setItem(this.roleKey, role);
  }
  saveid(id: string): void {
    localStorage.setItem(this.Id_Key, id);
  }
  getid(): string | null {
    return localStorage.getItem(this.Id_Key);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  /**
   * Saves both the access token and role in one call
   */
  saveTokenAndRole(token: string, role: string,id: string): void {
    this.saveToken(token);
    this.saveRole(role);
    this.saveid(id);
  }

  clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.Id_Key);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Checks if the token is expired
   * Includes error handling in case of invalid token format
   */
  private isTokenExpired(token: string): boolean {
    try {
      return this.helper.isTokenExpired(token);
    } catch (error) {
      console.error('Token expiration check failed:', error);
      return true; // Treat as expired if token is malformed
    }
  }

}
