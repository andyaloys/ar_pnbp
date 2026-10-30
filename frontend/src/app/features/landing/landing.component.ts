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
    <div class="relative min-h-screen text-white flex flex-col font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      
      <!-- Pure Fullscreen High-Def Background from lp.jpg -->
      <div 
        class="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style="background-image: url('/lp.jpg');">
      </div>

      <!-- Ultra-Light Subtle Vignette (Tidak menutup gambar, hanya membuat teks sangat tajam) -->
      <div class="fixed inset-0 z-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/70 pointer-events-none"></div>

      <!-- Foreground Content -->
      <div class="relative z-10 flex flex-col min-h-screen">

        <!-- Translucent Sleek Navbar -->
        <header class="border-b border-white/10 bg-slate-950/30 backdrop-blur-md sticky top-0 z-40 transition-colors">
          <div class="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
            
            <!-- Logo & Brand -->
            <div class="flex items-center space-x-3.5">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 font-bold">
                <i class="pi pi-shield text-lg text-white"></i>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-extrabold tracking-wider text-white uppercase leading-none">
                  AR Management PNBP
                </span>
                <span class="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase mt-1">
                  Kementerian Lingkungan Hidup / BPLH &bull; 2026
                </span>
              </div>
            </div>

            <!-- Navbar Actions -->
            <div class="flex items-center space-x-3">
              @if (authService.isLoggedIn()) {
                <a
                  routerLink="/dashboard"
                  class="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/30 transition-all hover:scale-105">
                  <i class="pi pi-th-large text-xs"></i>
                  <span>Buka Dashboard</span>
                </a>
              } @else {
                <a
                  routerLink="/login"
                  class="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-xl text-xs font-bold backdrop-blur-md transition-all hover:scale-105">
                  <i class="pi pi-user text-xs text-emerald-400"></i>
                  <span>Login Akun</span>
                </a>
              }
            </div>
          </div>
        </header>

        <!-- Premium Hero Section -->
        <main class="flex-1 flex flex-col justify-center items-center px-6 py-16 lg:py-24 max-w-4xl mx-auto text-center">
          
          <!-- Badge Institusi -->
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 backdrop-blur-md mb-8 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Biro Perencanaan dan Keuangan Settama &bull; PMK 163/PMK.06/2020</span>
          </div>

          <!-- Main Title -->
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] drop-shadow-md max-w-3xl">
            Sistem Informasi Penguatan Tata Kelola
            <span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-300 bg-clip-text text-transparent">Piutang PNBP</span>
          </h1>

          <!-- Crisp Description -->
          <p class="mt-6 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed drop-shadow font-normal">
            Platform terpadu penatausahaan buku pembantu piutang, otomasi penuaan kualitas piutang (*Aging Schedule*), serta pengawasan penagihan berjenjang SP1 s/d SP3 pada 15 Satker Prioritas.
          </p>

          <!-- Single Focused Call To Action -->
          <div class="mt-10 flex items-center justify-center">
            @if (authService.isLoggedIn()) {
              <a
                routerLink="/dashboard"
                class="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm shadow-xl shadow-emerald-500/30 transition-all hover:scale-105">
                <i class="pi pi-th-large text-sm"></i>
                <span>Masuk ke Dashboard Eksekutif</span>
                <i class="pi pi-arrow-right text-xs"></i>
              </a>
            } @else {
              <a
                routerLink="/login"
                class="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm shadow-xl shadow-emerald-500/30 transition-all hover:scale-105">
                <i class="pi pi-sign-in text-sm"></i>
                <span>Masuk ke Sistem</span>
                <i class="pi pi-arrow-right text-xs"></i>
              </a>
            }
          </div>

          <!-- 3 Glassmorphism Pillars (Menyatu Indah dengan Background lp.jpg) -->
          <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5 text-left w-full">
            
            <div class="bg-slate-950/40 hover:bg-slate-950/60 p-6 rounded-2xl border border-white/15 backdrop-blur-lg shadow-xl transition-all hover:translate-y-[-2px]">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg mb-4 border border-emerald-500/30">
                <i class="pi pi-calendar"></i>
              </div>
              <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-2">Aging Engine PMK 163</h3>
              <p class="text-xs text-slate-300 leading-relaxed font-normal">
                Kalkulasi otomatis penuaan kualitas piutang Lancar, Kurang Lancar, Diragukan, hingga Macet setiap pergantian hari.
              </p>
            </div>

            <div class="bg-slate-950/40 hover:bg-slate-950/60 p-6 rounded-2xl border border-white/15 backdrop-blur-lg shadow-xl transition-all hover:translate-y-[-2px]">
              <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-lg mb-4 border border-amber-500/30">
                <i class="pi pi-send"></i>
              </div>
              <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-2">Workflow Penagihan</h3>
              <p class="text-xs text-slate-300 leading-relaxed font-normal">
                Pengawasan jatuh tempo dan siklus penerbitan Surat Tagihan berjenjang SP1, SP2, SP3 hingga pelimpahan PUPN/KPKNL.
              </p>
            </div>

            <div class="bg-slate-950/40 hover:bg-slate-950/60 p-6 rounded-2xl border border-white/15 backdrop-blur-lg shadow-xl transition-all hover:translate-y-[-2px]">
              <div class="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center text-lg mb-4 border border-sky-500/30">
                <i class="pi pi-sync"></i>
              </div>
              <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-2">Fondasi SAKTI Kemenkeu</h3>
              <p class="text-xs text-slate-300 leading-relaxed font-normal">
                Penyelarasan kodefikasi satker, bagan akun standar penerimaan negara, dan struktur data mutasi piutang terintegrasi.
              </p>
            </div>

          </div>

        </main>

        <!-- Minimal Translucent Footer -->
        <footer class="border-t border-white/10 py-6 text-center text-xs text-slate-400 bg-slate-950/50 backdrop-blur-md mt-auto">
          <p>&copy; 2026 Kementerian Lingkungan Hidup / Badan Pengendalian Lingkungan Hidup &bull; Republik Indonesia</p>
        </footer>

      </div>

    </div>
  `
})
export class LandingComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);
}
