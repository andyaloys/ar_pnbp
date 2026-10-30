import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- Top Bar: Title & Global Filter -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Nasional Piutang PNBP</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitoring umur piutang (*aging schedule*), kualitas piutang negara (PMK 163/2020), dan realisasi 15 Satker Prioritas
          </p>
        </div>

        <div class="flex items-center gap-3">
          <label class="text-xs text-slate-500 dark:text-slate-400 font-medium">Filter Satker:</label>
          <select [(ngModel)]="selectedSatkerId" (change)="onFilterChange()" 
                  class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 shadow-xs">
            <option [ngValue]="null">Semua Satker (Nasional)</option>
            @for (s of satkers(); track s.id) {
              <option [ngValue]="s.id">{{ s.kodeSatker }} - {{ s.namaSatker }}</option>
            }
          </select>
        </div>
      </div>

      <!-- KPI Metrics Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Card 1: Total Piutang Bruto -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-sky-500/10 rounded-full blur-xl group-hover:bg-sky-500/20 transition"></div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Piutang Bruto</span>
            <div class="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <i class="pi pi-wallet text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white mt-3">
            Rp {{ (summary()?.totalPiutangBruto || 0) | number:'1.0-0' }}
          </p>
          <div class="flex items-center gap-2 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{{ summary()?.counts?.totalDokumen || 0 }} Dokumen Penetapan</span>
          </div>
        </div>

        <!-- Card 2: Saldo Tertagih / Lunas -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition"></div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Piutang Tertagih (Lunas)</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <i class="pi pi-check-circle text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-3">
            Rp {{ (summary()?.totalTertagih || 0) | number:'1.0-0' }}
          </p>
          <div class="flex items-center gap-2 mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <i class="pi pi-chart-line"></i>
            <span>Recovery Rate: {{ summary()?.recoveryRate || 0 }}%</span>
          </div>
        </div>

        <!-- Card 3: Saldo Sisa Piutang Aktif -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition"></div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sisa Saldo Piutang</span>
            <div class="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <i class="pi pi-clock text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-3">
            Rp {{ (summary()?.totalSaldoPiutang || 0) | number:'1.0-0' }}
          </p>
          <div class="flex items-center gap-2 mt-2 text-[11px] text-amber-600 dark:text-amber-400">
            <span>{{ summary()?.counts?.aktif || 0 }} Dokumen Masih Aktif</span>
          </div>
        </div>

        <!-- Card 4: Estimasi Penyisihan PMK 163 -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition"></div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estimasi Penyisihan</span>
            <div class="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <i class="pi pi-shield text-sm"></i>
            </div>
          </div>
          <p class="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-3">
            Rp {{ (summary()?.totalPenyisihan || 0) | number:'1.0-0' }}
          </p>
          <div class="flex items-center gap-2 mt-2 text-[11px] text-rose-600 dark:text-rose-400">
            <span>Formula PMK 163/PMK.06/2020</span>
          </div>
        </div>

      </div>

      <!-- Aging Schedule & Kualitas Piutang Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Matriks Aging Schedule (2 Cols) -->
        <div class="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white">Distribusi Umur Piutang (Aging Schedule)</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Pengelompokan rentang hari keterlambatan terhadap sisa saldo</p>
            </div>
            <span class="text-[10px] px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-400 rounded-md border border-slate-200 dark:border-slate-700 font-mono">
              Real-time Engine
            </span>
          </div>

          <div class="space-y-4 pt-2">
            @for (item of agingMatrix(); track item.label) {
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs">
                  <span class="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full" [style.backgroundColor]="item.color"></span>
                    {{ item.label }}
                  </span>
                  <div class="text-right">
                    <span class="font-semibold text-slate-900 dark:text-white">Rp {{ item.jumlah | number:'1.0-0' }}</span>
                    <span class="text-slate-500 text-[11px] ml-1.5">({{ item.count }} berkas)</span>
                  </div>
                </div>
                <div class="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500" 
                       [style.width.%]="getPercent(item.jumlah)" 
                       [style.backgroundColor]="item.color"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Klasifikasi Kualitas Piutang Negara (1 Col) -->
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white">Kualitas Piutang (PMK 163)</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Penggolongan tingkat risiko kolektibilitas</p>
          </div>

          <div class="space-y-3 pt-2">
            @for (k of kualitasBreakdown(); track k.kualitas) {
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded uppercase"
                        [ngClass]="{
                          'badge-lancar': k.kualitas === 'LANCAR',
                          'badge-kurang-lancar': k.kualitas === 'KURANG_LANCAR',
                          'badge-diragukan': k.kualitas === 'DIRAGUKAN',
                          'badge-macet': k.kualitas === 'MACET'
                        }">
                    {{ k.kualitas.replace('_', ' ') }}
                  </span>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{{ k.jumlahDokumen }} berkas piutang</p>
                </div>
                <span class="font-bold text-sm text-slate-900 dark:text-white">
                  Rp {{ k.totalSaldo | number:'1.0-0' }}
                </span>
              </div>
            }
          </div>
        </div>

      </div>

      <!-- Satker Performance Drilldown Table -->
      <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white">Konsolidasi 15 Satuan Kerja Prioritas</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Rekapitulasi beban piutang, pelunasan, dan piutang macet per unit satker</p>
          </div>
          <span class="text-xs text-slate-500 dark:text-slate-400">15 Satker Terdaftar</span>
        </div>

        <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead class="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="px-4 py-3">Kode Satker</th>
                <th class="px-4 py-3">Nama Satuan Kerja</th>
                <th class="px-4 py-3 text-right">Total Piutang</th>
                <th class="px-4 py-3 text-right">Tertagih</th>
                <th class="px-4 py-3 text-right">Sisa Saldo</th>
                <th class="px-4 py-3 text-right">Piutang Macet</th>
                <th class="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              @for (satker of satkerSummary(); track satker.satkerId) {
                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition">
                  <td class="px-4 py-3 font-mono font-medium text-sky-600 dark:text-sky-400">{{ satker.kodeSatker }}</td>
                  <td class="px-4 py-3 font-semibold text-slate-900 dark:text-white">{{ satker.namaSatker }}</td>
                  <td class="px-4 py-3 text-right">Rp {{ satker.totalPiutang | number:'1.0-0' }}</td>
                  <td class="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">Rp {{ satker.totalTerbayar | number:'1.0-0' }}</td>
                  <td class="px-4 py-3 text-right font-bold text-amber-600 dark:text-amber-400">Rp {{ satker.totalSaldo | number:'1.0-0' }}</td>
                  <td class="px-4 py-3 text-right text-rose-600 dark:text-rose-400">
                    {{ satker.piutangMacet > 0 ? ('Rp ' + (satker.piutangMacet | number:'1.0-0')) : '-' }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    @if (satker.totalSaldo === 0 && satker.totalPiutang > 0) {
                      <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">LUNAS</span>
                    } @else if (satker.piutangMacet > 0) {
                      <span class="text-[10px] px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">PERHATIAN</span>
                    } @else {
                      <span class="text-[10px] px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30">MONITORING</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);

  summary = signal<any>(null);
  agingMatrix = signal<any[]>([]);
  kualitasBreakdown = signal<any[]>([]);
  satkerSummary = signal<any[]>([]);
  satkers = signal<any[]>([]);

  selectedSatkerId: number | null = null;

  ngOnInit() {
    this.loadSatkers();
    this.loadDashboardData();
  }

  loadSatkers() {
    this.api.getSatkers().subscribe(res => {
      if (res.success) this.satkers.set(res.data);
    });
  }

  loadDashboardData() {
    const sId = this.selectedSatkerId || undefined;
    this.api.getDashboardSummary(undefined, sId).subscribe(res => {
      if (res.success) this.summary.set(res.data);
    });

    this.api.getAgingMatrix(sId).subscribe(res => {
      if (res.success) this.agingMatrix.set(res.data);
    });

    this.api.getKualitasBreakdown(sId).subscribe(res => {
      if (res.success) this.kualitasBreakdown.set(res.data);
    });

    this.api.getSatkerSummary().subscribe(res => {
      if (res.success) this.satkerSummary.set(res.data);
    });
  }

  onFilterChange() {
    this.loadDashboardData();
  }

  getPercent(amount: number): number {
    const total = this.summary()?.totalSaldoPiutang || 1;
    return Math.min(100, Math.round((amount / total) * 100));
  }
}
