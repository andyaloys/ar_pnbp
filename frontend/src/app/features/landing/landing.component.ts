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
    <div class="relative text-white font-sans selection:bg-emerald-500 selection:text-white bg-slate-950">
      
      <!-- Fixed Fullscreen Background from lp.jpg -->
      <div 
        class="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style="background-image: url('/lp.jpg');">
      </div>

      <!-- Subtle Vignette Overlay -->
      <div class="fixed inset-0 z-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80 pointer-events-none"></div>

      <!-- ========================================================= -->
      <!-- 1. FULLSCREEN FIRST FOLD (Cukup Sampai Tombol Masuk Sistem) -->
      <!-- ========================================================= -->
      <section class="relative z-10 min-h-screen flex flex-col justify-between">
        
        <!-- Top Sleek Header -->
        <header class="border-b border-white/10 bg-slate-950/30 backdrop-blur-md sticky top-0 z-40">
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

            <!-- Navbar Action -->
            <div>
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

        <!-- Clean Hero Center (Fokus Utama: Judul & Tombol Masuk Sistem) -->
        <div class="flex-1 flex flex-col justify-center items-center px-6 py-12 max-w-4xl mx-auto text-center">
          
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

          <!-- The ONLY Single Button on First Fold -->
          <div class="mt-10">
            @if (authService.isLoggedIn()) {
              <a
                routerLink="/dashboard"
                class="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-9 py-4 rounded-xl text-sm shadow-xl shadow-emerald-500/30 transition-all hover:scale-105">
                <i class="pi pi-th-large text-base"></i>
                <span>Masuk ke Dashboard Eksekutif</span>
                <i class="pi pi-arrow-right text-xs"></i>
              </a>
            } @else {
              <a
                routerLink="/login"
                class="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-9 py-4 rounded-xl text-sm shadow-xl shadow-emerald-500/30 transition-all hover:scale-105">
                <i class="pi pi-sign-in text-base"></i>
                <span>Masuk ke Sistem</span>
                <i class="pi pi-arrow-right text-xs"></i>
              </a>
            }
          </div>
        </div>

        <!-- Scroll Indicator (Petunjuk Gulir ke Bawah) -->
        <div class="pb-6 flex flex-col items-center justify-center text-slate-400 text-xs gap-1.5 cursor-pointer animate-pulse" (click)="scrollToInfo()">
          <span class="text-[11px] tracking-wider uppercase font-medium text-slate-300">Gulir untuk informasi sistem</span>
          <i class="pi pi-chevron-down text-emerald-400 text-sm"></i>
        </div>

      </section>

      <!-- ========================================================= -->
      <!-- 2. SCROLLABLE SECOND SECTION (Informasi Sistem di Bawah)   -->
      <!-- ========================================================= -->
      <section id="info-section" class="relative z-10 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 py-24 px-6">
        <div class="max-w-6xl mx-auto space-y-20">
          
          <!-- Section Title -->
          <div class="text-center max-w-3xl mx-auto">
            <span class="text-xs font-bold text-emerald-400 tracking-widest uppercase mb-2 block">Pilar Fungsionalitas</span>
            <h2 class="text-2xl sm:text-4xl font-extrabold text-white">Arsitektur Penguatan Piutang PNBP 2026</h2>
            <p class="text-slate-300 text-sm mt-3 leading-relaxed">
              Dikembangkan untuk mewujudkan kepatuhan regulasi perbendaharaan negara, mencegah kadaluarsa piutang, dan memfasilitasi rekonsiliasi data antara Satker Daerah dengan Biro Perencanaan dan Keuangan Pusat.
            </p>
          </div>

          <!-- 3 Kartu Pilar Utama -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div class="bg-slate-900/60 p-7 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:translate-y-[-4px] shadow-lg">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl mb-5 border border-emerald-500/30">
                <i class="pi pi-calendar"></i>
              </div>
              <h3 class="text-base font-bold text-white mb-2">Aging Engine PMK 163</h3>
              <p class="text-xs text-slate-300 leading-relaxed font-normal">
                Kalkulasi otomatis kualitas penuaan piutang setiap hari berdasarkan tanggal jatuh tempo dokumen dasar:
                <span class="block mt-2 font-mono text-[11px] text-emerald-300">
                  &bull; Lancar: 0 - 30 hari<br>
                  &bull; Kurang Lancar: 31 - 60 hari<br>
                  &bull; Diragukan: 61 - 90 hari<br>
                  &bull; Macet: > 90 hari
                </span>
              </p>
            </div>

            <div class="bg-slate-900/60 p-7 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all duration-300 hover:translate-y-[-4px] shadow-lg">
              <div class="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl mb-5 border border-amber-500/30">
                <i class="pi pi-send"></i>
              </div>
              <h3 class="text-base font-bold text-white mb-2">Workflow Surat Penagihan (SP)</h3>
              <p class="text-xs text-slate-300 leading-relaxed font-normal">
                Siklus monitoring dan penerbitan surat tagihan resmi berjenjang secara terkontrol:
                <span class="block mt-2 font-mono text-[11px] text-amber-300">
                  &bull; SP1: Jatuh tempo + 30 hari<br>
                  &bull; SP2: 30 hari setelah SP1<br>
                  &bull; SP3: 30 hari setelah SP2<br>
                  &bull; Pelimpahan berkas ke PUPN / KPKNL
                </span>
              </p>
            </div>

            <div class="bg-slate-900/60 p-7 rounded-2xl border border-white/10 hover:border-sky-500/40 transition-all duration-300 hover:translate-y-[-4px] shadow-lg">
              <div class="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center text-xl mb-5 border border-sky-500/30">
                <i class="pi pi-sync"></i>
              </div>
              <h3 class="text-base font-bold text-white mb-2">Interoperabilitas SAKTI Kemenkeu</h3>
              <p class="text-xs text-slate-300 leading-relaxed font-normal">
                Fondasi integrasi pertukaran data posisi dan mutasi piutang negara:
                <span class="block mt-2 font-mono text-[11px] text-sky-300">
                  &bull; Standardisasi Kodefikasi 15 Satker<br>
                  &bull; Bagan Akun Standar (BAS) Penerimaan<br>
                  &bull; API Gateway Posisi & Mutasi Piutang<br>
                  &bull; Riwayat Ekspor & Rekonsiliasi Neraca
                </span>
              </p>
            </div>

          </div>

          <!-- Ringkasan Satker & Dasar Hukum -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            <div class="bg-slate-900/40 p-6 rounded-2xl border border-white/10">
              <h4 class="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <i class="pi pi-building text-emerald-400"></i>
                <span>Cakupan 15 Satuan Kerja Prioritas</span>
              </h4>
              <p class="text-xs text-slate-300 leading-relaxed">
                Mencakup Satker Sekretariat Utama, Ditjen Penegakan Hukum LHK (Gakkum), Ditjen Pengendalian Pencemaran & Kerusakan Lingkungan (PPKL), Ditjen Planologi Kehutanan & Tata Lingkungan (PKTL), Balai Penegakan Hukum Wilayah Sumatera, Jawa-Bali-Nusa Tenggara, Kalimantan, Sulawesi, hingga Maluku-Papua.
              </p>
            </div>

            <div class="bg-slate-900/40 p-6 rounded-2xl border border-white/10">
              <h4 class="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <i class="pi pi-book text-amber-400"></i>
                <span>Dasar Hukum & Kepatuhan Tata Kelola</span>
              </h4>
              <p class="text-xs text-slate-300 leading-relaxed">
                Berlandaskan Peraturan Menteri Keuangan Nomor 163/PMK.06/2020 tentang Pengelolaan Piutang Instansi Pemerintah, Undang-Undang Nomor 9 Tahun 2018 tentang PNBP, Peraturan Pemerintah Tarif Layanan KLH/BPLH, serta Standar Akuntansi Pemerintahan (SAP) Akrual.
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- Footer Resmi di Bagian Paling Bawah -->
      <footer class="border-t border-white/10 py-8 text-center text-xs text-slate-400 bg-slate-950 relative z-10">
        <div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center space-x-2">
            <i class="pi pi-shield text-emerald-400 text-sm"></i>
            <span class="text-white font-semibold">Kementerian Lingkungan Hidup / Badan Pengendalian Lingkungan Hidup</span>
          </div>
          <p>&copy; 2026 Biro Perencanaan dan Keuangan Settama &bull; Republik Indonesia</p>
        </div>
      </footer>

    </div>
  `
})
export class LandingComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);

  scrollToInfo() {
    const el = document.getElementById('info-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
