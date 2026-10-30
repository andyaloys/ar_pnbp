import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Master Data & Satuan Kerja</h1>
          <p class="text-xs text-slate-400 mt-1">
            Pengelolaan identitas debitur wajib bayar, 15 Satuan Kerja Prioritas, dan referensi tarif layanan PNBP
          </p>
        </div>

        <!-- Tab Selector -->
        <div class="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button (click)="activeTab = 'satker'" 
                  [class.bg-sky-500]="activeTab === 'satker'"
                  [class.text-white]="activeTab === 'satker'"
                  class="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition font-medium">
            15 Satker Prioritas
          </button>
          <button (click)="activeTab = 'wajibBayar'" 
                  [class.bg-sky-500]="activeTab === 'wajibBayar'"
                  [class.text-white]="activeTab === 'wajibBayar'"
                  class="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition font-medium">
            Wajib Bayar (Debitur)
          </button>
          <button (click)="activeTab = 'jenisPnbp'" 
                  [class.bg-sky-500]="activeTab === 'jenisPnbp'"
                  [class.text-white]="activeTab === 'jenisPnbp'"
                  class="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition font-medium">
            Jenis Tarif PNBP
          </button>
        </div>
      </div>

      <!-- Tab 1: Satker Prioritas -->
      @if (activeTab === 'satker') {
        <div class="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          <div class="p-4 border-b border-slate-800 flex justify-between items-center">
            <h2 class="text-sm font-bold text-white">Daftar 15 Satker Prioritas KLH / BPLH</h2>
            <span class="text-xs text-sky-400 font-mono">Total: {{ satkers().length }} Satker</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th class="px-4 py-3">Kode Satker</th>
                  <th class="px-4 py-3">Nama Satuan Kerja</th>
                  <th class="px-4 py-3">Unit Eselon</th>
                  <th class="px-4 py-3">Penanggung Jawab</th>
                  <th class="px-4 py-3 text-center">Prioritas</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                @for (s of satkers(); track s.id) {
                  <tr class="hover:bg-slate-850/50 transition">
                    <td class="px-4 py-3 font-mono font-bold text-sky-400">{{ s.kodeSatker }}</td>
                    <td class="px-4 py-3 font-semibold text-white">{{ s.namaSatker }}</td>
                    <td class="px-4 py-3 text-slate-400">{{ s.unitEselon }}</td>
                    <td class="px-4 py-3 text-slate-300">{{ s.penanggungJawab }}</td>
                    <td class="px-4 py-3 text-center">
                      <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        PRIORITAS
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Tab 2: Wajib Bayar -->
      @if (activeTab === 'wajibBayar') {
        <div class="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden space-y-4 p-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 class="text-sm font-bold text-white">Master Identitas Wajib Bayar (Debitur)</h2>
            <button (click)="showWbModal = true" 
                    class="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs flex items-center gap-1.5 self-start">
              <i class="pi pi-plus"></i>
              <span>Tambah Debitur</span>
            </button>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-800">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th class="px-4 py-3">Identitas (NPWP/NIK)</th>
                  <th class="px-4 py-3">Nama Wajib Bayar</th>
                  <th class="px-4 py-3">Badan Usaha</th>
                  <th class="px-4 py-3">Kota / Provinsi</th>
                  <th class="px-4 py-3">Kontak / PIC</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                @for (w of wajibBayars(); track w.id) {
                  <tr class="hover:bg-slate-850/50 transition">
                    <td class="px-4 py-3 font-mono font-medium text-sky-400">{{ w.nomorIdentitas }}</td>
                    <td class="px-4 py-3 font-semibold text-white">{{ w.namaWajibBayar }}</td>
                    <td class="px-4 py-3 text-slate-400">{{ w.badanUsaha || '-' }}</td>
                    <td class="px-4 py-3 text-slate-300">{{ w.kotaKabupaten }}, {{ w.provinsi }}</td>
                    <td class="px-4 py-3 text-slate-300">{{ w.picNama || w.email || '-' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Tab 3: Jenis PNBP -->
      @if (activeTab === 'jenisPnbp') {
        <div class="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          <div class="p-4 border-b border-slate-800">
            <h2 class="text-sm font-bold text-white">Klasifikasi Tarif & Layanan PNBP Lingkungan Hidup</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th class="px-4 py-3">Kode Akun</th>
                  <th class="px-4 py-3">Nama Layanan PNBP</th>
                  <th class="px-4 py-3">Dasar Hukum</th>
                  <th class="px-4 py-3">Satuan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                @for (j of jenisPnbps(); track j.id) {
                  <tr class="hover:bg-slate-850/50 transition">
                    <td class="px-4 py-3 font-mono font-bold text-sky-400">{{ j.kodeAkun }}</td>
                    <td class="px-4 py-3 font-semibold text-white">{{ j.namaLayanan }}</td>
                    <td class="px-4 py-3 text-slate-400">{{ j.dasarHukum }}</td>
                    <td class="px-4 py-3 text-slate-300">{{ j.satuan || '-' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Modal Tambah Wajib Bayar -->
      @if (showWbModal) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div class="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 class="text-base font-bold text-white">Tambah Wajib Bayar Baru</h3>
              <button (click)="showWbModal = false" class="text-slate-500 hover:text-white">
                <i class="pi pi-times"></i>
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-slate-400 mb-1">Identitas</label>
                  <select [(ngModel)]="wbForm.jenisIdentitas" class="w-full px-2 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white">
                    <option value="NPWP">NPWP</option>
                    <option value="NIK">NIK</option>
                  </select>
                </div>
                <div class="col-span-2">
                  <label class="block text-slate-400 mb-1">Nomor Identitas *</label>
                  <input type="text" [(ngModel)]="wbForm.nomorIdentitas" placeholder="15/16 Digit"
                         class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-sky-500">
                </div>
              </div>

              <div>
                <label class="block text-slate-400 mb-1">Nama Perusahaan / Wajib Bayar *</label>
                <input type="text" [(ngModel)]="wbForm.namaWajibBayar" placeholder="Nama Lengkap"
                       class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500">
              </div>

              <div>
                <label class="block text-slate-400 mb-1">Bentuk Badan Usaha</label>
                <input type="text" [(ngModel)]="wbForm.badanUsaha" placeholder="PT / CV / Perorangan"
                       class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-400 mb-1">Kota / Kab</label>
                  <input type="text" [(ngModel)]="wbForm.kotaKabupaten" 
                         class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500">
                </div>
                <div>
                  <label class="block text-slate-400 mb-1">Provinsi</label>
                  <input type="text" [(ngModel)]="wbForm.provinsi" 
                         class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500">
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button (click)="showWbModal = false" class="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700">
                Batal
              </button>
              <button (click)="submitWajibBayar()" class="px-4 py-2 rounded-lg bg-sky-500 text-white text-xs font-semibold hover:bg-sky-600 shadow-lg shadow-sky-500/20">
                Simpan
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class MasterDataComponent implements OnInit {
  private api = inject(ApiService);

  activeTab: 'satker' | 'wajibBayar' | 'jenisPnbp' = 'satker';

  satkers = signal<any[]>([]);
  wajibBayars = signal<any[]>([]);
  jenisPnbps = signal<any[]>([]);

  showWbModal = false;
  wbForm: any = {
    jenisIdentitas: 'NPWP',
    nomorIdentitas: '',
    namaWajibBayar: '',
    badanUsaha: 'PT',
    kotaKabupaten: '',
    provinsi: ''
  };

  ngOnInit() {
    this.api.getSatkers().subscribe(res => {
      if (res.success) this.satkers.set(res.data);
    });
    this.api.getWajibBayars().subscribe(res => {
      if (res.success) this.wajibBayars.set(res.data);
    });
    this.api.getJenisPnbps().subscribe(res => {
      if (res.success) this.jenisPnbps.set(res.data);
    });
  }

  submitWajibBayar() {
    this.api.createWajibBayar(this.wbForm).subscribe({
      next: (res) => {
        alert(res.message);
        this.showWbModal = false;
        this.api.getWajibBayars().subscribe(r => {
          if (r.success) this.wajibBayars.set(r.data);
        });
      },
      error: (err) => {
        alert(err.error?.message || 'Gagal menyimpan wajib bayar.');
      }
    });
  }
}
