import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-penagihan-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Monitoring Penagihan & Surat Peringatan</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Penatausahaan Surat Tagihan I (SP I), Surat Peringatan II (SP II), Surat Peringatan III (SP III), hingga pelimpahan berkas PUPN
          </p>
        </div>
      </div>

      <!-- Piutang Memerlukan Tindakan Penagihan -->
      <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white">Daftar Piutang Jatuh Tempo Memerlukan Penagihan</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Berkas piutang yang telah lewat jatuh tempo dan harus diterbitkan tindakan penagihan berjenjang</p>
          </div>
          <span class="text-xs font-semibold px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
            Perhatian Khusus
          </span>
        </div>

        <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead class="table-header-theme shadow-xs">
              <tr>
                <th class="px-4 py-3">No. Register Piutang</th>
                <th class="px-4 py-3">Debitur</th>
                <th class="px-4 py-3">Satker</th>
                <th class="px-4 py-3 text-right">Sisa Tagihan</th>
                <th class="px-4 py-3 text-center">Umur Keterlambatan</th>
                <th class="px-4 py-3 text-center">Status Terakhir</th>
                <th class="px-4 py-3 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              @for (item of piutangs(); track item.id) {
                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition">
                  <td class="px-4 py-3 font-mono font-medium text-sky-600 dark:text-sky-400">{{ item.nomorRegistrasiPiutang }}</td>
                  <td class="px-4 py-3 font-semibold text-slate-900 dark:text-white">{{ item.wajibBayar?.namaWajibBayar }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-400">{{ item.satker?.namaSatker }}</td>
                  <td class="px-4 py-3 text-right font-bold text-amber-600 dark:text-amber-400">Rp {{ item.saldoPiutang | number:'1.0-0' }}</td>
                  <td class="px-4 py-3 text-center font-mono text-rose-600 dark:text-rose-400 font-semibold">{{ item.umurHari }} hari</td>
                  <td class="px-4 py-3 text-center">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700">
                      {{ item.statusPenagihan }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button (click)="openIssueModal(item)" 
                            class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] shadow-sm transition active:scale-95 flex items-center gap-1.5 mx-auto">
                      <i class="pi pi-send text-[10px]"></i>
                      <span>Terbitkan Surat</span>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Terbitkan Surat Penagihan -->
      @if (showIssueModal) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-xs">
          <div class="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-slate-900 dark:text-white">
            <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 class="text-base font-bold">Penerbitan Surat Tagihan / Penagihan</h3>
              <button (click)="showIssueModal = false" class="text-slate-400 hover:text-slate-700 dark:hover:text-white">
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
                <label class="block text-slate-600 dark:text-slate-400 mb-1">Jenis Tindakan / Tingkat Surat *</label>
                <select [(ngModel)]="penagihanForm.jenisTindakan" 
                        class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-indigo-500">
                  <option value="SP1">Surat Tagihan I (SP I)</option>
                  <option value="SP2">Surat Peringatan II (SP II)</option>
                  <option value="SP3">Surat Peringatan III (SP III)</option>
                  <option value="SOMASI">Somasi Hukum / Teguran Keras</option>
                  <option value="PENYERAHAN_PUPN">Penyerahan Berkas ke PUPN / DJKN (Macet)</option>
                </select>
              </div>

              <div>
                <label class="block text-slate-600 dark:text-slate-400 mb-1">Nomor Surat Resmi *</label>
                <input type="text" [(ngModel)]="penagihanForm.nomorSurat" placeholder="Misal: S.045/SETTAMA/ROKEU/AR/10/2026"
                       class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-600 dark:text-slate-400 mb-1">Tanggal Surat</label>
                  <input type="date" [(ngModel)]="penagihanForm.tanggalSurat" 
                         class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
                </div>
                <div>
                  <label class="block text-slate-600 dark:text-slate-400 mb-1">Batas Waktu Respon</label>
                  <input type="date" [(ngModel)]="penagihanForm.tanggalJatuhTempoSurat" 
                         class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
                </div>
              </div>

              <div>
                <label class="block text-slate-600 dark:text-slate-400 mb-1">Pejabat Penandatangan</label>
                <input type="text" [(ngModel)]="penagihanForm.pejabatPenandatangan" 
                       class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
              </div>

              <div>
                <label class="block text-slate-600 dark:text-slate-400 mb-1">Perihal Surat</label>
                <input type="text" [(ngModel)]="penagihanForm.perihal" 
                       class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button (click)="showIssueModal = false" class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700">
                Batal
              </button>
              <button (click)="submitIssuePenagihan()" class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-sm">
                Terbitkan & Simpan
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class PenagihanListComponent implements OnInit {
  private api = inject(ApiService);

  piutangs = signal<any[]>([]);
  showIssueModal = false;
  selectedPiutang: any = null;

  penagihanForm: any = {
    jenisTindakan: 'SP1',
    nomorSurat: '',
    tanggalSurat: new Date().toISOString().substring(0, 10),
    tanggalJatuhTempoSurat: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
    pejabatPenandatangan: 'Kepala Biro Perencanaan dan Keuangan',
    perihal: 'Surat Tagihan atas Kewajiban PNBP',
    statusPengiriman: 'TERKIRIM',
    createdBy: 'petugas_penagihan'
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getPiutangs(1, 50, { status: 'AKTIF' }).subscribe(res => {
      if (res.success) {
        const rawList = res.data?.items ?? (Array.isArray(res.data) ? res.data : []);
        // filter yang memiliki saldo piutang > 0
        const items = rawList.filter((p: any) => p.saldoPiutang > 0);
        this.piutangs.set(items);
      }
    });
  }

  openIssueModal(item: any) {
    this.selectedPiutang = item;
    this.penagihanForm.nomorSurat = `S.${Math.floor(Math.random() * 900 + 100)}/SETTAMA/ROKEU/AR/${new Date().getFullYear()}`;
    this.penagihanForm.perihal = `Surat Tagihan atas Ketetapan ${item.nomorDokumenPenetapan}`;
    this.showIssueModal = true;
  }

  submitIssuePenagihan() {
    if (!this.selectedPiutang) return;
    this.api.recordPenagihan(this.selectedPiutang.id, this.penagihanForm).subscribe({
      next: (res) => {
        alert(res.message);
        this.showIssueModal = false;
        this.loadData();
      },
      error: (err) => {
        alert(err.error?.message || 'Gagal menyimpan surat penagihan.');
      }
    });
  }
}
