import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'ar-pnbp-theme';

  // Default ke 'light' sesuai permintaan pengguna
  currentTheme = signal<Theme>(this.getStoredTheme());

  constructor() {
    this.applyTheme(this.currentTheme());
  }

  private getStoredTheme(): Theme {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.THEME_KEY);
      return (stored === 'light' || stored === 'dark') ? (stored as Theme) : 'light';
    }
    return 'light';
  }

  toggleTheme(): void {
    const next: Theme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this.applyTheme(theme);
    this.storeTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }

  private storeTheme(theme: Theme): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.THEME_KEY, theme);
    }
  }

  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }

  isDarkMode(): boolean {
    return this.isDark();
  }

  isLight(): boolean {
    return this.currentTheme() === 'light';
  }
}
