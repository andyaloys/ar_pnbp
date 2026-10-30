import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-sakti-integration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Layanan Integrasi SAKTI Kemenkeu</h1>
            <span class="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
              Prototype OpenAPI 3.0
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Persiapan pertukaran data elektronik posisi piutang dan jurnal mutasi piutang menuju National PNBP Platform (PMK 171/2021 jo. PMK 158/2023)
          </p>
        </div>

        <a href="http://localhost:5200/swagger" target="_blank" 
           class="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 border border-slate-200 dark:border-slate-700 font-semibold text-xs flex items-center gap-2 shadow-xs transition">
          <i class="pi pi-external-link"></i>
          <span>Buka Swagger / OpenAPI UI</span>
        </a>
      </div>

      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div class="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-semibold">
            <i class="pi pi-send"></i>
            <span>Arsitektur Web Service</span>
          </div>
          <p class="text-sm font-bold text-slate-900 dark:text-white mt-2">REST API Satu Arah (JSON)</p>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Menyediakan data saldo dan mutasi dari PNBP KLH untuk dikonsumsi modul Piutang SAKTI.</p>
        </div>

        <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <i class="pi pi-shield"></i>
            <span>Otorisasi & Keamanan</span>
          </div>
          <p class="text-sm font-bold text-slate-900 dark:text-white mt-2">Bearer JWT & API Key</p>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Dilengkapi pencatatan request ID, IP address consumer, dan audit logging di database.</p>
        </div>

        <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <i class="pi pi-database"></i>
            <span>Standar Akun Akuntansi</span>
          </div>
          <p class="text-sm font-bold text-slate-900 dark:text-white mt-2">Kode Akun 115xxx</p>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Pemetaan otomatis kode layanan PNBP menjadi bagan akun standar (BAS) piutang negara.</p>
        </div>

      </div>

      <!-- Live API Tester Panel -->
      <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white">Live Simulator Pemanggilan Web Service SAKTI</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Uji langsung respon JSON yang dikirimkan ke endpoint SAKTI Kemenkeu</p>
          </div>

          <div class="flex items-center gap-2">
            <button (click)="testPosisiPiutang()" 
                    [class.bg-sky-600]="activeEndpoint === 'posisi'"
                    [class.text-white]="activeEndpoint === 'posisi'"
                    [class.bg-slate-100]="activeEndpoint !== 'posisi'"
                    [class.dark:bg-slate-800]="activeEndpoint !== 'posisi'"
                    [class.text-slate-700]="activeEndpoint !== 'posisi'"
                    [class.dark:text-slate-300]="activeEndpoint !== 'posisi'"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs">
              GET /api/sakti/posisi-piutang
            </button>
            <button (click)="testMutasiPiutang()" 
                    [class.bg-sky-600]="activeEndpoint === 'mutasi'"
                    [class.text-white]="activeEndpoint === 'mutasi'"
                    [class.bg-slate-100]="activeEndpoint !== 'mutasi'"
                    [class.dark:bg-slate-800]="activeEndpoint !== 'mutasi'"
                    [class.text-slate-700]="activeEndpoint !== 'mutasi'"
                    [class.dark:text-slate-300]="activeEndpoint !== 'mutasi'"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs">
              GET /api/sakti/mutasi-piutang
            </button>
          </div>
        </div>

        <!-- Terminal / JSON Viewer -->
        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto max-h-[480px]">
          <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px] text-slate-500">
            <span>HTTP/1.1 200 OK • Content-Type: application/json</span>
            <span class="text-emerald-400 font-semibold">Status: CONNECTED</span>
          </div>
          @if (isLoading()) {
            <div class="text-amber-400 py-4 flex items-center gap-2">
              <i class="pi pi-spin pi-spinner"></i>
              <span>Memanggil Web Service SAKTI...</span>
            </div>
          } @else {
            <pre class="text-emerald-400 whitespace-pre-wrap">{{ jsonResult() }}</pre>
          }
        </div>
      </div>

    </div>
  `
})
export class SaktiIntegrationComponent implements OnInit {
  private api = inject(ApiService);

  activeEndpoint = 'posisi';
  isLoading = signal(false);
  jsonResult = signal<string>('');

  ngOnInit() {
    this.testPosisiPiutang();
  }

  testPosisiPiutang() {
    this.activeEndpoint = 'posisi';
    this.isLoading.set(true);
    this.api.getSaktiPosisiPiutang().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.jsonResult.set(JSON.stringify(res, null, 2));
      },
      error: (err) => {
        this.isLoading.set(false);
        this.jsonResult.set(JSON.stringify(err, null, 2));
      }
    });
  }

  testMutasiPiutang() {
    this.activeEndpoint = 'mutasi';
    this.isLoading.set(true);
    this.api.getSaktiMutasiPiutang().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.jsonResult.set(JSON.stringify(res, null, 2));
      },
      error: (err) => {
        this.isLoading.set(false);
        this.jsonResult.set(JSON.stringify(err, null, 2));
      }
    });
  }
}
