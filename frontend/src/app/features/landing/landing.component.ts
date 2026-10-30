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
      <!-- Navbar -->
      <header class="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <i class="pi pi-shield text-2xl"></i>
            </div>
            <div>
              <div class="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>AR MANAGEMENT PNBP</span>
                <span class="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">2026</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Kementerian Lingkungan Hidup / Badan Pengendalian Lingkungan Hidup</p>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <button
              (click)="toggleTheme()"
              class="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm"
              [title]="isDark() ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'">
              <i [class]="isDark() ? 'pi pi-sun text-yellow-400' : 'pi pi-moon text-slate-600'"></i>
            </button>

            @if (authService.isLoggedIn()) {
              <a
                routerLink="/dashboard"
                class="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]">
                <i class="pi pi-th-large"></i>
                <span>Masuk Dashboard</span>
              </a>
            } @else {
              <a
                routerLink="/login"
                class="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]">
                <i class="pi pi-sign-in"></i>
                <span>Masuk Sistem</span>
              </a>
            }
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-gradient-to-b from-emerald-50/50 via-slate-50 to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
        <!-- Glow / Background shapes -->
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-emerald-400/20 to-teal-400/20 blur-3xl -z-10 rounded-full pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/60 mb-6 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Standar Akuntansi Pemerintah & PMK 163/PMK.06/2020
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Sistem Informasi Penguatan Tata Kelola
            <span class="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">Piutang PNBP KLH/BPLH</span>
          </h1>

          <p class="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Platform terpadu monitoring saldo piutang, otomasi penuaan kualitas piutang (Aging Schedule), penatausahaan penagihan berjenjang SP1 s/d SP3, dan fondasi interoperabilitas SAKTI Kemenkeu.
          </p>

          <div class="mt-10 flex flex-wrap justify-center gap-4">
            @if (authService.isLoggedIn()) {
              <a
                routerLink="/dashboard"
                class="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105">
                <i class="pi pi-chart-line text-lg"></i>
                <span>Buka Dashboard Eksekutif</span>
              </a>
            } @else {
              <a
                routerLink="/login"
                class="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105">
                <i class="pi pi-lock text-lg"></i>
                <span>Masuk ke Portal AR PNBP</span>
              </a>
            }
            <a
              routerLink="/dashboard"
              class="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-7 py-3.5 rounded-xl font-bold shadow-sm transition-all">
              <i class="pi pi-book text-lg"></i>
              <span>Eksplorasi Data AR</span>
            </a>
          </div>

          <!-- Metrik Ringkas -->
          <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div class="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400">15</div>
              <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Satker Prioritas PNBP</div>
            </div>
            <div class="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div class="text-2xl font-black text-teal-600 dark:text-teal-400">Rp 10,5 M</div>
              <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Portofolio Piutang 2026</div>
            </div>
            <div class="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div class="text-2xl font-black text-sky-600 dark:text-sky-400">100% Otomatis</div>
              <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Aging Engine PMK 163</div>
            </div>
            <div class="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div class="text-2xl font-black text-indigo-600 dark:text-indigo-400">SAKTI Ready</div>
              <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Gateway Interoperabilitas</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Pillars Section -->
      <section class="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Pilar Fungsionalitas</h2>
            <h3 class="text-3xl font-extrabold text-slate-900 dark:text-white">Arsitektur Penguatan Piutang PNBP 2026</h3>
            <p class="mt-3 text-slate-600 dark:text-slate-400 text-sm">Dirancang secara terpadu untuk mematuhi regulasi perbendaharaan negara serta mempermudah rekonsiliasi keuangan lingkup satker daerah dan pusat.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Card 1 -->
            <div class="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 hover:shadow-lg transition-all">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl mb-4">
                <i class="pi pi-database"></i>
              </div>
              <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Buku Pembantu Piutang</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Pencatatan komprehensif data piutang per wajib bayar, jenis PNBP, dokumen dasar (SK/Tagihan), mutasi debet/kredit, dan histori pembayaran NTPN SIMPONI.
              </p>
            </div>

            <!-- Card 2 -->
            <div class="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 hover:shadow-lg transition-all">
              <div class="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl mb-4">
                <i class="pi pi-send"></i>
              </div>
              <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Workflow Surat Penagihan (SP)</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Pemantauan jatuh tempo dan siklus penerbitan Surat Tagihan/Penagihan SP1 (30 hari), SP2 (30 hari), SP3 (30 hari) hingga penyerahan berkas macet ke PUPN/KPKNL.
              </p>
            </div>

            <!-- Card 3 -->
            <div class="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 hover:shadow-lg transition-all">
              <div class="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xl mb-4">
                <i class="pi pi-sync"></i>
              </div>
              <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Fondasi SAKTI Kemenkeu</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Penyelarasan kodefikasi satker, akun pendapatan PNBP, struktur mutasi debet/kredit, dan audit log ekspor sesuai format standar modul Piutang SAKTI.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800 py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div class="flex items-center space-x-3">
            <i class="pi pi-shield text-emerald-400 text-xl"></i>
            <div>
              <p class="text-white font-semibold">Kementerian Lingkungan Hidup / Badan Pengendalian Lingkungan Hidup</p>
              <p class="text-slate-400">Biro Perencanaan dan Keuangan Settama &copy; 2026. Hak Cipta Dilindungi Undang-Undang.</p>
            </div>
          </div>
          <div class="flex items-center space-x-6 text-slate-400">
            <span>PMK 163/PMK.06/2020</span>
            <span>&bull;</span>
            <span>Simponi PNBP</span>
            <span>&bull;</span>
            <span>SAKTI Interoperability</span>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);

  isDark(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
