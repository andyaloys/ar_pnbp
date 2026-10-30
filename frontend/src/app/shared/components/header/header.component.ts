import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shadow-sm dark:shadow-none sticky top-0 z-30 transition-colors">
      
      <!-- Left: Toggle & Title -->
      <div class="flex items-center gap-4">
        <button (click)="toggleSidebar.emit()" 
                class="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <i class="pi pi-bars text-lg"></i>
        </button>

        <div class="hidden md:flex items-center gap-2">
          <span class="text-xs px-2.5 py-1 rounded-md bg-sky-50 dark:bg-indigo-950/80 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-indigo-800 font-semibold tracking-wide">
            Accounts Receivable System
          </span>
          <span class="text-slate-300 dark:text-slate-600">•</span>
          <span class="text-xs text-slate-600 dark:text-slate-300 font-medium">Biro Perencanaan dan Keuangan Settama KLH / BPLH</span>
        </div>
      </div>

      <!-- Right: Action Buttons & User Profile -->
      <div class="flex items-center gap-3">
        
        <!-- Theme Toggle Button (Light / Dark) -->
        <button (click)="themeService.toggleTheme()" 
                [title]="themeService.isLight() ? 'Ganti ke Mode Gelap' : 'Ganti ke Mode Terang'"
                class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center justify-center shadow-xs">
          @if (themeService.isLight()) {
            <i class="pi pi-moon text-slate-700 text-sm"></i>
          } @else {
            <i class="pi pi-sun text-amber-400 text-sm"></i>
          }
        </button>

        <!-- Recalculate Aging Engine Button -->
        <button (click)="recalculateAging()" 
                [disabled]="isRecalculating"
                class="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 flex items-center gap-2 shadow-xs transition active:scale-95 disabled:opacity-50">
          <i class="pi pi-sync" [class.animate-spin]="isRecalculating"></i>
          <span class="hidden sm:inline">Kalkulasi Ulang Aging</span>
        </button>

        <div class="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

        <!-- User Profile Pill & Logout -->
        <div class="flex items-center gap-3 pl-2">
          <div class="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs shadow-inner">
            {{ (authService.currentUser()?.fullName?.charAt(0) || 'U').toUpperCase() }}
          </div>
          <div class="hidden lg:flex flex-col text-left">
            <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {{ authService.currentUser()?.fullName || 'Pengguna Sistem' }}
            </span>
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                {{ authService.currentUser()?.roleName || 'Pegawai' }}
              </span>
              @if (authService.currentUser()?.kodeSatker) {
                <span class="text-[9px] text-slate-400 font-mono">({{ authService.currentUser()?.kodeSatker }})</span>
              }
            </div>
          </div>

          <!-- Logout Button -->
          <button
            (click)="authService.logout()"
            class="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-1"
            title="Keluar / Logout">
            <i class="pi pi-sign-out text-base"></i>
          </button>
        </div>

      </div>

    </header>
  `
})
export class HeaderComponent {
  sidebarCollapsed = input(false);
  toggleSidebar = output<void>();

  themeService = inject(ThemeService);
  authService = inject(AuthService);
  private apiService = inject(ApiService);
  isRecalculating = false;

  recalculateAging() {
    this.isRecalculating = true;
    this.apiService.recalculateAging().subscribe({
      next: (res) => {
        this.isRecalculating = false;
        alert(res.message || 'Kalkulasi ulang umur piutang selesai.');
        window.location.reload();
      },
      error: () => {
        this.isRecalculating = false;
      }
    });
  }
}
