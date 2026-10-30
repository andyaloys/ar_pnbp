import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      <!-- Top Minimal Header -->
      <header class="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <!-- Logo & Institution -->
          <div class="flex items-center space-x-3.5">
            <div class="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <i class="pi pi-shield text-base"></i>
            </div>
            <div class="flex flex-col">
              <span class="text-xs font-bold tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                AR Management PNBP
              </span>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide mt-0.5">
                KLH / BPLH &bull; 2026
              </span>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center space-x-3">
            <button
              (click)="toggleTheme()"
              class="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center shadow-xs"
              [title]="isDark() ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'">
              <i [class]="isDark() ? 'pi pi-sun text-yellow-400' : 'pi pi-moon text-slate-600'" class="text-sm"></i>
            </button>

            @if (authService.isLoggedIn()) {
              <a
                routerLink="/dashboard"
                class="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all">
                <span>Ke Dashboard</span>
                <i class="pi pi-arrow-right text-[10px]"></i>
              </a>
            } @else {
              <a
                routerLink="/login"
                class="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all">
                <span>Masuk Portal</span>
                <i class="pi pi-arrow-right text-[10px]"></i>
              </a>
            }
          </div>
        </div>
      </header>

      <!-- Clean Minimal Hero Section -->
      <main class="flex-1 flex flex-col justify-center items-center px-6 py-20 lg:py-28 max-w-4xl mx-auto text-center">
        
        <!-- Subtle Pill Label -->
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 mb-8 border border-slate-300/60 dark:border-slate-700/60">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Biro Perencanaan dan Keuangan Settama</span>
        </div>

        <!-- Main Headline -->
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.2] max-w-3xl">
          Penguatan Tata Kelola & Otomasi Piutang PNBP Lingkup KLH/BPLH
        </h1>

        <!-- Elegant Description -->
        <p class="mt-6 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Sistem informasi penatausahaan buku pembantu piutang, kalkulasi kualitas umur piutang (*aging schedule*) sesuai PMK 163/PMK.06/2020, serta pemantauan siklus penagihan terpadu 15 Satker Prioritas.
        </p>

        <!-- Focused Call to Action -->
        <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
          @if (authService.isLoggedIn()) {
            <a
              routerLink="/dashboard"
              class="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm transition-all hover:translate-y-[-1px]">
              <span>Buka Dashboard Eksekutif</span>
              <i class="pi pi-arrow-right text-xs"></i>
            </a>
          } @else {
            <a
              routerLink="/login"
              class="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm transition-all hover:translate-y-[-1px]">
              <span>Masuk ke Sistem</span>
              <i class="pi pi-arrow-right text-xs"></i>
            </a>
          }

          <a
            routerLink="/login"
            class="inline-flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-5 py-3 rounded-xl text-sm font-medium transition-all shadow-xs">
            <i class="pi pi-lock text-xs text-slate-400"></i>
            <span>Akses Pengguna Satker</span>
          </a>
        </div>

        <!-- 3 Minimalist Horizontal Pillars -->
        <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5 text-left w-full">
          
          <div class="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm mb-3">
              <i class="pi pi-calendar"></i>
            </div>
            <h3 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">Aging Engine PMK 163</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Otomasi klasifikasi kualitas piutang Lancar, Kurang Lancar, Diragukan, hingga Macet secara harian.
            </p>
          </div>

          <div class="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm mb-3">
              <i class="pi pi-send"></i>
            </div>
            <h3 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">Workflow Penagihan</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pengawasan jatuh tempo dan siklus penerbitan Surat Tagihan berjenjang SP1, SP2, SP3 hingga pelimpahan PUPN.
            </p>
          </div>

          <div class="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm mb-3">
              <i class="pi pi-sync"></i>
            </div>
            <h3 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">Fondasi SAKTI Kemenkeu</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Penyelarasan kodefikasi satker, bagan akun standar penerimaan, dan struktur data mutasi piutang negara.
            </p>
          </div>

        </div>

      </main>

      <!-- Minimal One-Line Footer -->
      <footer class="border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>&copy; 2026 Kementerian Lingkungan Hidup / Badan Pengendalian Lingkungan Hidup &bull; Republik Indonesia</p>
      </footer>

    </div>
  `
})
export class LandingComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);

  isDark(): boolean {
    return this.themeService.isDark();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
