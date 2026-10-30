import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponseDto, UserDto } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:5200/api/auth';

  private readonly TOKEN_KEY = 'ar_pnbp_token';
  private readonly USER_KEY = 'ar_pnbp_user';

  // Signals
  currentUser = signal<UserDto | null>(this.getStoredUser());
  isLoggedIn = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.roleCode || '');

  constructor() {
    // Verifikasi token jika ada saat init
    const token = this.getToken();
    if (token && !this.currentUser()) {
      this.fetchCurrentUser().subscribe({
        error: () => this.logout()
      });
    }
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap(res => {
        if (res?.success && res?.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  fetchCurrentUser(): Observable<any> {
    const token = this.getToken();
    return this.http.get<any>(`${this.baseUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(res => {
        if (res?.success && res?.data) {
          this.currentUser.set(res.data);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.data));
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setSession(authData: LoginResponseDto) {
    localStorage.setItem(this.TOKEN_KEY, authData.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
    this.currentUser.set(authData.user);
  }

  private getStoredUser(): UserDto | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
