import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-200">
      <!-- Theme Switcher Floating Top Right -->
      <div class="fixed top-6 right-6 z-50">
        <button
          (click)="themeService.toggleTheme()"
          class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-600 dark:text-slate-300 shadow-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <i [class]="themeService.isDark() ? 'pi pi-sun text-yellow-400' : 'pi pi-moon text-slate-600'"></i>
        </button>
      </div>

      <div class="w-full max-w-md">
        <!-- Logo & Title Header -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center justify-center mb-4 hover:scale-105 transition-transform">
            <img src="/logo-klh.png" alt="Logo KLH / BPLH" class="w-20 h-20 object-contain drop-shadow-md" />
          </a>
          <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">AR MANAGEMENT PNBP</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Kementerian Lingkungan Hidup / BPLH</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
          <div class="mb-6">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Masuk ke Akun Anda</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Gunakan kredensial resmi atau pilih akun demo di bawah</p>
          </div>

          <!-- Error Alert -->
          @if (errorMessage()) {
            <div class="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <i class="pi pi-exclamation-circle text-base"></i>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
              <div class="relative">
                <i class="pi pi-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input
                  type="text"
                  [(ngModel)]="username"
                  name="username"
                  required
                  placeholder="Masukkan username"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors shadow-sm" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div class="relative">
                <i class="pi pi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  required
                  placeholder="Masukkan password"
                  class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors shadow-sm" />
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <i [class]="showPassword() ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>

            <div class="pt-2">
              <button
                type="submit"
                [disabled]="isLoading()"
                class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2">
                @if (isLoading()) {
                  <i class="pi pi-spin pi-spinner text-base"></i>
                  <span>Memverifikasi...</span>
                } @else {
                  <i class="pi pi-sign-in"></i>
                  <span>Masuk ke Sistem</span>
                }
              </button>
            </div>
          </form>

          <!-- Divider -->
          <div class="my-6 flex items-center">
            <div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span class="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Akses Cepat Demo</span>
            <div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <!-- Quick Login Buttons -->
          <div class="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              (click)="quickLogin('superadmin')"
              class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 text-left transition-all hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30">
              <div class="font-bold text-emerald-600 dark:text-emerald-400">Super Admin</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">Pusdatin (Full)</div>
            </button>

            <button
              type="button"
              (click)="quickLogin('admin.pusat')"
              class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 text-left transition-all hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30">
              <div class="font-bold text-teal-600 dark:text-teal-400">Admin Pusat</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">Biro Renkeu</div>
            </button>

            <button
              type="button"
              (click)="quickLogin('operator.gakkum')"
              class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 text-left transition-all hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30">
              <div class="font-bold text-sky-600 dark:text-sky-400">Operator Satker</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">Gakkum Sumatera</div>
            </button>

            <button
              type="button"
              (click)="quickLogin('pimpinan')"
              class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 text-left transition-all hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30">
              <div class="font-bold text-purple-600 dark:text-purple-400">Eksekutif</div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400">Karo Keuangan</div>
            </button>
          </div>
        </div>

        <!-- Back to Landing Link -->
        <div class="text-center mt-6">
          <a routerLink="/" class="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 inline-flex items-center gap-1.5 transition-colors">
            <i class="pi pi-arrow-left text-[10px]"></i>
            <span>Kembali ke Halaman Utama</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);

  username = 'superadmin';
  password = 'Admin@12345';
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit() {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res?.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set(res?.message || 'Login gagal.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Gagal terhubung ke server atau kredensial salah.');
      }
    });
  }

  quickLogin(uname: string) {
    this.username = uname;
    this.password = 'Admin@12345';
    this.onSubmit();
  }
}
