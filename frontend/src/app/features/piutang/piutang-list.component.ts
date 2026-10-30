import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-piutang-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- Header & Action -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Buku Pembantu Piutang (AR Ledger)</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Perekaman ketetapan, monitoring saldo, dan mutasi pembayaran per debitur / satuan kerja
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button (click)="openAddModal()" 
                  class="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition active:scale-95">
            <i class="pi pi-plus"></i>
            <span>Catat Piutang Baru</span>
          </button>
        </div>
      </div>

      <!-- Filters Row -->
      <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-4">
        
        <!-- Search Input -->
        <div class="flex-1 min-w-[240px] relative">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input type="text" [(ngModel)]="searchKeyword" (input)="onSearch()" placeholder="Cari No. Register, No. SK, atau Debitur..." 
                 class="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500">
        </div>

        <!-- Filter Satker -->
        <div class="w-56">
          <select [(ngModel)]="filterSatkerId" (change)="loadData()" 
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500">
            <option [ngValue]="null">Semua Satker</option>
            @for (s of satkers(); track s.id) {
              <option [ngValue]="s.id">{{ s.kodeSatker }} - {{ s.namaSatker }}</option>
            }
          </select>
        </div>

        <!-- Filter Kualitas -->
        <div class="w-44">
          <select [(ngModel)]="filterKualitas" (change)="loadData()" 
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500">
            <option [ngValue]="null">Semua Kualitas</option>
            <option value="LANCAR">Lancar</option>
            <option value="KURANG_LANCAR">Kurang Lancar</option>
            <option value="DIRAGUKAN">Diragukan</option>
            <option value="MACET">Macet</option>
          </select>
        </div>

      </div>

      <!-- Table View -->
      <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead class="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="px-4 py-3.5">No. Register / SK</th>
                <th class="px-4 py-3.5">Wajib Bayar (Debitur)</th>
                <th class="px-4 py-3.5">Satuan Kerja</th>
                <th class="px-4 py-3.5">Jatuh Tempo</th>
                <th class="px-4 py-3.5 text-right">Nilai Ketetapan</th>
                <th class="px-4 py-3.5 text-right">Sisa Saldo</th>
                <th class="px-4 py-3.5 text-center">Umur</th>
                <th class="px-4 py-3.5 text-center">Kualitas</th>
                <th class="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              @for (item of piutangs(); track item.id) {
                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition">
                  <td class="px-4 py-3.5">
                    <p class="font-mono font-bold text-sky-600 dark:text-sky-400">{{ item.nomorRegistrasiPiutang }}</p>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{{ item.nomorDokumenPenetapan }}</p>
                  </td>
                  <td class="px-4 py-3.5">
                    <p class="font-semibold text-slate-900 dark:text-white">{{ item.wajibBayar?.namaWajibBayar }}</p>
                    <p class="text-[10px] text-slate-400 font-mono mt-0.5">NPWP: {{ item.wajibBayar?.nomorIdentitas }}</p>
                  </td>
                  <td class="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                    <p class="truncate max-w-[180px] font-medium">{{ item.satker?.namaSatker }}</p>
                    <p class="text-[10px] text-slate-400 font-mono">{{ item.satker?.kodeSatker }}</p>
                  </td>
                  <td class="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-300">
                    {{ item.tanggalJatuhTempo | date:'dd/MM/yyyy' }}
                  </td>
                  <td class="px-4 py-3.5 text-right font-medium text-slate-700 dark:text-slate-300">
                    Rp {{ item.totalPiutang | number:'1.0-0' }}
                  </td>
                  <td class="px-4 py-3.5 text-right font-bold text-amber-600 dark:text-amber-400">
                    Rp {{ item.saldoPiutang | number:'1.0-0' }}
                  </td>
                  <td class="px-4 py-3.5 text-center font-mono">
                    <span [class.text-rose-600]="item.umurHari > 30" [class.dark:text-rose-400]="item.umurHari > 30" [class.text-emerald-600]="item.umurHari === 0" [class.dark:text-emerald-400]="item.umurHari === 0">
                      {{ item.umurHari }} hr
                    </span>
                  </td>
                  <td class="px-4 py-3.5 text-center">
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded uppercase"
                          [ngClass]="{
                            'badge-lancar': item.kualitasPiutang === 'LANCAR',
                            'badge-kurang-lancar': item.kualitasPiutang === 'KURANG_LANCAR',
                            'badge-diragukan': item.kualitasPiutang === 'DIRAGUKAN',
                            'badge-macet': item.kualitasPiutang === 'MACET'
                          }">
                      {{ item.kualitasPiutang.replace('_', ' ') }}
                    </span>
                  </td>
                  <td class="px-4 py-3.5 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                      @if (item.saldoPiutang > 0) {
                        <button (click)="openPaymentModal(item)" title="Catat Pelunasan"
                                class="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition">
                          <i class="pi pi-money-bill text-xs"></i>
                        </button>
                      }
                      <button (click)="openDetailModal(item)" title="Rincian & Riwayat"
                              class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 hover:bg-sky-600 hover:text-white transition">
                        <i class="pi pi-eye text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              }
              @if (piutangs().length === 0) {
                <tr>
                  <td colspan="9" class="text-center py-8 text-slate-400">
                    Tidak ada data piutang yang sesuai kriteria.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Perekaman Pembayaran -->
      @if (showPaymentModal) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-xs">
          <div class="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-slate-900 dark:text-white">
            <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 class="text-base font-bold">Catat Pelunasan / Setoran NTPN</h3>
              <button (click)="showPaymentModal = false" class="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <i class="pi pi-times"></i>
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <p class="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{{ selectedPiutang?.nomorRegistrasiPiutang }}</p>
                <p class="font-bold text-slate-900 dark:text-white mt-0.5">{{ selectedPiutang?.wajibBayar?.namaWajibBayar }}</p>
                <p class="text-amber-600 dark:text-amber-400 font-semibold mt-1">Sisa Piutang: Rp {{ selectedPiutang?.saldoPiutang | number:'1.0-0' }}</p>
              </div>

              <div>
                <label class="block text-slate-600 dark:text-slate-400 mb-1">Jumlah Setoran (Rp) *</label>
                <input type="number" [(ngModel)]="paymentForm.jumlahBayar" 
                       class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-emerald-500">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-600 dark:text-slate-400 mb-1">NTPN (SIMPONI)</label>
                  <input type="text" [(ngModel)]="paymentForm.ntpn" placeholder="16 Karakter NTPN"
                         class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500">
                </div>
                <div>
                  <label class="block text-slate-600 dark:text-slate-400 mb-1">Kode Billing</label>
                  <input type="text" [(ngModel)]="paymentForm.kodeBilling" placeholder="15 Digit Billing"
                         class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-600 dark:text-slate-400 mb-1">Tanggal Setor</label>
                  <input type="date" [(ngModel)]="paymentForm.tanggalBayar" 
                         class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500">
                </div>
                <div>
                  <label class="block text-slate-600 dark:text-slate-400 mb-1">Bank Persepsi</label>
                  <input type="text" [(ngModel)]="paymentForm.bankPersepsi" placeholder="Misal: Bank Mandiri / BNI"
                         class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500">
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button (click)="showPaymentModal = false" class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700">
                Batal
              </button>
              <button (click)="submitPayment()" class="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 shadow-sm">
                Simpan Setoran
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modal Perekaman Piutang Baru -->
      @if (showAddModal) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-xs">
          <div class="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-slate-900 dark:text-white">
            <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 class="text-base font-bold">Catat Ketetapan Piutang Baru</h3>
              <button (click)="showAddModal = false" class="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <i class="pi pi-times"></i>
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-600 dark:text-slate-400 mb-1">Satuan Kerja *</label>
                  <select [(ngModel)]="addForm.satkerId" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-sky-500">
                    @for (s of satkers(); track s.id) {
                      <option [ngValue]="s.id">{{ s.kodeSatker }} - {{ s.namaSatker }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-slate-600 dark:text-slate-400 mb-1">Wajib Bayar (Debitur) *</label>
                  <select [(ngModel)]="addForm.wajibBayarId" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-sky-500">
                    @for (w of wajibBayars(); track w.id) {
                      <option [ngValue]="w.id">{{ w.namaWajibBayar }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-600 dark:text-slate-400 mb-1">Nomor Dokumen SK/SPTNP *</label>
                  <input type="text" [(ngModel)]="addForm.nomorDokumenPenetapan" placeholder="Misal: SK-PNBP/144/2026"
                         class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-sky-500">
                </div>
                <div>
                  <label class="block text-slate-600 dark:text-slate-400 mb-1">Jenis Dokumen Dasar</label>
                  <select [(ngModel)]="addForm.dokumenDasarId" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-sky-500">
                    @for (d of dokumenDasars(); track d.id) {
                      <option [ngValue]="d.id">{{ d.namaDokumen }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-600 dark:text-slate-400 mb-1">Tanggal Dokumen Penetapan</label>
                  <input type="date" [(ngModel)]="addForm.tanggalDokumen" 
                         class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-sky-500">
                </div>
                <div>
                  <label class="block text-slate-600 dark:text-slate-400 mb-1">Tanggal Jatuh Tempo *</label>
                  <input type="date" [(ngModel)]="addForm.tanggalJatuhTempo" 
                         class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-sky-500">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-600 dark:text-slate-400 mb-1">Nilai Pokok (Rp) *</label>
                  <input type="number" [(ngModel)]="addForm.nilaiPokok" 
                         class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:border-sky-500">
                </div>
                <div>
                  <label class="block text-slate-600 dark:text-slate-400 mb-1">Nilai Denda/Bunga (Rp)</label>
                  <input type="number" [(ngModel)]="addForm.nilaiDendaBunga" 
                         class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:border-sky-500">
                </div>
              </div>

              <div>
                <label class="block text-slate-600 dark:text-slate-400 mb-1">Jenis Layanan PNBP</label>
                <select [(ngModel)]="addForm.jenisPnbpId" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-sky-500">
                  @for (j of jenisPnbps(); track j.id) {
                    <option [ngValue]="j.id">{{ j.kodeAkun }} - {{ j.namaLayanan }}</option>
                  }
                </select>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button (click)="showAddModal = false" class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700">
                Batal
              </button>
              <button (click)="submitAddPiutang()" class="px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500 shadow-sm">
                Simpan Ketetapan
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class PiutangListComponent implements OnInit {
  private api = inject(ApiService);

  piutangs = signal<any[]>([]);
  satkers = signal<any[]>([]);
  wajibBayars = signal<any[]>([]);
  jenisPnbps = signal<any[]>([]);
  dokumenDasars = signal<any[]>([]);

  searchKeyword = '';
  filterSatkerId: number | null = null;
  filterKualitas: string | null = null;

  showPaymentModal = false;
  selectedPiutang: any = null;
  paymentForm: any = {
    jumlahBayar: 0,
    ntpn: '',
    kodeBilling: '',
    tanggalBayar: new Date().toISOString().substring(0, 10),
    bankPersepsi: '',
    createdBy: 'operator_keuangan'
  };

  showAddModal = false;
  addForm: any = {
    satkerId: 1,
    wajibBayarId: 1,
    jenisPnbpId: 1,
    dokumenDasarId: 1,
    nomorDokumenPenetapan: '',
    tanggalDokumen: new Date().toISOString().substring(0, 10),
    tanggalJatuhTempo: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
    nilaiPokok: 0,
    nilaiDendaBunga: 0,
    createdBy: 'operator_keuangan'
  };

  ngOnInit() {
    this.loadDropdowns();
    this.loadData();
  }

  loadDropdowns() {
    this.api.getSatkers().subscribe(res => {
      if (res.success) this.satkers.set(res.data);
    });
    this.api.getWajibBayars().subscribe(res => {
      if (res.success) this.wajibBayars.set(res.data);
    });
    this.api.getJenisPnbps().subscribe(res => {
      if (res.success) this.jenisPnbps.set(res.data);
    });
    this.api.getDokumenDasars().subscribe(res => {
      if (res.success) this.dokumenDasars.set(res.data);
    });
  }

  loadData() {
    const filters: any = {};
    if (this.filterSatkerId) filters.satkerId = this.filterSatkerId;
    if (this.filterKualitas) filters.kualitas = this.filterKualitas;
    if (this.searchKeyword) filters.search = this.searchKeyword;

    this.api.getPiutangs(1, 50, filters).subscribe(res => {
      if (res.success) {
        const rawItems = res.data?.items ?? (Array.isArray(res.data) ? res.data : []);
        this.piutangs.set(rawItems);
      }
    });
  }

  onSearch() {
    this.loadData();
  }

  openPaymentModal(item: any) {
    this.selectedPiutang = item;
    this.paymentForm.jumlahBayar = item.saldoPiutang;
    this.paymentForm.nomorBuktiBayar = 'BUKTI-' + Date.now();
    this.showPaymentModal = true;
  }

  submitPayment() {
    if (!this.selectedPiutang) return;
    this.api.recordPembayaran(this.selectedPiutang.id, this.paymentForm).subscribe({
      next: (res) => {
        alert(res.message);
        this.showPaymentModal = false;
        this.loadData();
      },
      error: (err) => {
        alert(err.error?.message || 'Gagal menyimpan pembayaran.');
      }
    });
  }

  openAddModal() {
    this.showAddModal = true;
  }

  submitAddPiutang() {
    this.api.createPiutang(this.addForm).subscribe({
      next: (res) => {
        alert(res.message);
        this.showAddModal = false;
        this.loadData();
      },
      error: (err) => {
        alert(err.error?.message || 'Gagal menyimpan ketetapan piutang.');
      }
    });
  }

  openDetailModal(item: any) {
    alert(`Nomor Register: ${item.nomorRegistrasiPiutang}\nDebitur: ${item.wajibBayar?.namaWajibBayar}\nStatus: ${item.statusPiutang}\nKualitas: ${item.kualitasPiutang}`);
  }
}
