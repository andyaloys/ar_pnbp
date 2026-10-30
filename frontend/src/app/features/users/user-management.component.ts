import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { UserDto, RoleDto } from '../../core/models/auth.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Manajemen Pengguna & Hak Akses (RBAC)</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pengelolaan akun aparatur sipil negara, penetapan peran (Role-Based Access Control), dan penugasan pada 15 Satker Prioritas KLH
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            (click)="openCreateModal()"
            class="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]">
            <i class="pi pi-user-plus"></i>
            <span>Tambah Pengguna Baru</span>
          </button>
        </div>
      </div>

      <!-- Role Stats Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        @for (role of roles(); track role.id) {
          <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <div class="text-xs font-semibold text-slate-500 dark:text-slate-400">{{ role.roleName }}</div>
              <div class="text-xl font-black text-slate-900 dark:text-white mt-1">{{ role.userCount }} Akun</div>
            </div>
            <div [class]="getRoleIconClass(role.roleCode)" class="w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-sm">
              <i [class]="getRoleIcon(role.roleCode)"></i>
            </div>
          </div>
        }
      </div>

      <!-- Filter Bar -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <!-- Search input -->
          <div class="relative w-full sm:w-64">
            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="loadUsers()"
              placeholder="Cari nama, username, NIP..."
              class="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <!-- Role Filter -->
          <select
            [(ngModel)]="selectedRole"
            (change)="loadUsers()"
            class="py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">Semua Peran</option>
            @for (r of roles(); track r.id) {
              <option [value]="r.roleCode">{{ r.roleName }}</option>
            }
          </select>

          <!-- Satker Filter -->
          <select
            [(ngModel)]="selectedSatkerId"
            (change)="loadUsers()"
            class="py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option [ngValue]="null">Semua Satuan Kerja</option>
            @for (s of satkers(); track s.id) {
              <option [ngValue]="s.id">{{ s.kodeSatker }} - {{ s.namaSatker }}</option>
            }
          </select>
        </div>

        <button
          (click)="loadUsers(); loadRoles()"
          class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5">
          <i class="pi pi-refresh"></i>
          <span>Segarkan</span>
        </button>
      </div>

      <!-- Table Section -->
      <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="table-header-theme">
              <tr>
                <th class="py-3 px-4 font-semibold">Pengguna & Akun</th>
                <th class="py-3 px-4 font-semibold">NIP / Kontak</th>
                <th class="py-3 px-4 font-semibold">Peran & Akses</th>
                <th class="py-3 px-4 font-semibold">Satuan Kerja</th>
                <th class="py-3 px-4 font-semibold">Status</th>
                <th class="py-3 px-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              @if (isLoading()) {
                <tr>
                  <td colspan="6" class="text-center py-10 text-slate-400">
                    <i class="pi pi-spin pi-spinner text-2xl mb-2 block"></i>
                    Memuat data pengguna...
                  </td>
                </tr>
              } @else if (users().length === 0) {
                <tr>
                  <td colspan="6" class="text-center py-10 text-slate-400">
                    <i class="pi pi-users text-3xl mb-2 block text-slate-300"></i>
                    Tidak ada pengguna yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              } @else {
                @for (u of users(); track u.id) {
                  <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="py-3.5 px-4">
                      <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-xs">
                          {{ u.fullName.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <div class="font-bold text-slate-900 dark:text-white">{{ u.fullName }}</div>
                          <div class="text-[11px] text-slate-400">{{ '@' + u.username }} &bull; {{ u.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                      <div>{{ u.nip || '-' }}</div>
                      <div class="text-[10px] text-slate-400">{{ u.telepon || '-' }}</div>
                    </td>
                    <td class="py-3.5 px-4">
                      <span [class]="getRoleBadgeClass(u.roleCode)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border">
                        {{ u.roleName }}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 max-w-xs truncate" [title]="u.namaSatker || 'Pusat / Seluruh Satker'">
                      @if (u.namaSatker) {
                        <div class="font-medium text-slate-800 dark:text-slate-200">{{ u.namaSatker }}</div>
                        <div class="text-[10px] text-slate-400 font-mono">Kode: {{ u.kodeSatker }}</div>
                      } @else {
                        <span class="text-slate-400 italic">Biro Perencanaan dan Keuangan Pusat</span>
                      }
                    </td>
                    <td class="py-3.5 px-4">
                      @if (u.isActive) {
                        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Aktif
                        </span>
                      } @else {
                        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                          <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Non-Aktif
                        </span>
                      }
                    </td>
                    <td class="py-3.5 px-4 text-center">
                      <div class="inline-flex items-center gap-1.5">
                        <button
                          (click)="openEditModal(u)"
                          class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                          title="Edit Pengguna">
                          <i class="pi pi-pencil text-xs"></i>
                        </button>
                        <button
                          (click)="toggleStatus(u)"
                          [class.text-rose-600]="u.isActive"
                          [class.text-emerald-600]="!u.isActive"
                          class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                          [title]="u.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'">
                          <i [class]="u.isActive ? 'pi pi-ban text-xs' : 'pi pi-check text-xs'"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create / Edit Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 text-slate-900 dark:text-white">
            <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 class="font-bold text-base flex items-center gap-2">
                <i [class]="isEditMode() ? 'pi pi-user-edit' : 'pi pi-user-plus'" class="text-emerald-600 dark:text-emerald-400"></i>
                <span>{{ isEditMode() ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru' }}</span>
              </h3>
              <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <i class="pi pi-times"></i>
              </button>
            </div>

            @if (modalError()) {
              <div class="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                {{ modalError() }}
              </div>
            }

            <form (ngSubmit)="saveUser()" class="space-y-3 text-xs">
              @if (!isEditMode()) {
                <div>
                  <label class="block font-semibold mb-1">Username <span class="text-rose-500">*</span></label>
                  <input
                    type="text"
                    [(ngModel)]="formData.username"
                    name="username"
                    required
                    placeholder="misal: operator.samarinda"
                    class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>

                <div>
                  <label class="block font-semibold mb-1">Password Awal <span class="text-rose-500">*</span></label>
                  <input
                    type="password"
                    [(ngModel)]="formData.password"
                    name="password"
                    required
                    placeholder="Minimal 6 karakter"
                    class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              }

              <div>
                <label class="block font-semibold mb-1">Nama Lengkap <span class="text-rose-500">*</span></label>
                <input
                  type="text"
                  [(ngModel)]="formData.fullName"
                  name="fullName"
                  required
                  placeholder="Nama lengkap beserta gelar"
                  class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold mb-1">Email Kedinasan <span class="text-rose-500">*</span></label>
                  <input
                    type="email"
                    [(ngModel)]="formData.email"
                    name="email"
                    required
                    placeholder="nama@menlhk.go.id"
                    class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>

                <div>
                  <label class="block font-semibold mb-1">NIP (Opsional)</label>
                  <input
                    type="text"
                    [(ngModel)]="formData.nip"
                    name="nip"
                    placeholder="18 digit NIP"
                    class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold mb-1">Peran (Role RBAC) <span class="text-rose-500">*</span></label>
                  <select
                    [(ngModel)]="formData.roleId"
                    name="roleId"
                    required
                    class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    @for (r of roles(); track r.id) {
                      <option [value]="r.id">{{ r.roleName }}</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="block font-semibold mb-1">Satuan Kerja</label>
                  <select
                    [(ngModel)]="formData.satkerId"
                    name="satkerId"
                    class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option [ngValue]="null">Pusat / Biro Keuangan</option>
                    @for (s of satkers(); track s.id) {
                      <option [ngValue]="s.id">{{ s.kodeSatker }} - {{ s.namaSatker }}</option>
                    }
                  </select>
                </div>
              </div>

              @if (isEditMode()) {
                <div class="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <label class="block font-semibold mb-1">Ganti Password (Kosongkan jika tidak diubah)</label>
                  <input
                    type="password"
                    [(ngModel)]="formData.newPassword"
                    name="newPassword"
                    placeholder="Password baru"
                    class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>

                <div class="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    [(ngModel)]="formData.isActive"
                    name="isActive"
                    class="rounded text-emerald-600 focus:ring-emerald-500" />
                  <label for="isActiveCheck" class="font-medium cursor-pointer">Akun Aktif (Dapat Login)</label>
                </div>
              }

              <div class="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  (click)="closeModal()"
                  class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  Batal
                </button>
                <button
                  type="submit"
                  [disabled]="isSaving()"
                  class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50 flex items-center gap-2">
                  @if (isSaving()) {
                    <i class="pi pi-spin pi-spinner"></i>
                    <span>Menyimpan...</span>
                  } @else {
                    <span>Simpan Pengguna</span>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);

  users = signal<UserDto[]>([]);
  roles = signal<RoleDto[]>([]);
  satkers = signal<any[]>([]);

  isLoading = signal(false);
  isSaving = signal(false);
  showModal = signal(false);
  isEditMode = signal(false);
  modalError = signal<string | null>(null);

  selectedRole = '';
  selectedSatkerId: number | null = null;
  searchQuery = '';

  selectedUserId: number | null = null;
  formData = {
    username: '',
    password: '',
    fullName: '',
    email: '',
    nip: '',
    telepon: '',
    roleId: 3,
    satkerId: null as number | null,
    isActive: true,
    newPassword: ''
  };

  ngOnInit() {
    this.loadRoles();
    this.loadSatkers();
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.apiService.getUsers(this.selectedRole || undefined, this.selectedSatkerId || undefined, this.searchQuery || undefined).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res?.success) {
          this.users.set(res.data || []);
        }
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadRoles() {
    this.apiService.getRoles().subscribe({
      next: (res) => {
        if (res?.success) {
          this.roles.set(res.data || []);
        }
      }
    });
  }

  loadSatkers() {
    this.apiService.getSatkers().subscribe({
      next: (res) => {
        if (res?.success) {
          this.satkers.set(res.data || []);
        }
      }
    });
  }

  openCreateModal() {
    this.isEditMode.set(false);
    this.selectedUserId = null;
    this.modalError.set(null);
    this.formData = {
      username: '',
      password: '',
      fullName: '',
      email: '',
      nip: '',
      telepon: '',
      roleId: 3,
      satkerId: null,
      isActive: true,
      newPassword: ''
    };
    this.showModal.set(true);
  }

  openEditModal(user: UserDto) {
    this.isEditMode.set(true);
    this.selectedUserId = user.id;
    this.modalError.set(null);
    this.formData = {
      username: user.username,
      password: '',
      fullName: user.fullName,
      email: user.email,
      nip: user.nip || '',
      telepon: user.telepon || '',
      roleId: user.roleId,
      satkerId: user.satkerId || null,
      isActive: user.isActive,
      newPassword: ''
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.modalError.set(null);
  }

  saveUser() {
    this.modalError.set(null);
    this.isSaving.set(true);

    if (this.isEditMode() && this.selectedUserId) {
      const payload = {
        fullName: this.formData.fullName,
        email: this.formData.email,
        nip: this.formData.nip,
        telepon: this.formData.telepon,
        roleId: this.formData.roleId,
        satkerId: this.formData.satkerId,
        isActive: this.formData.isActive,
        newPassword: this.formData.newPassword || undefined
      };
      this.apiService.updateUser(this.selectedUserId, payload).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          if (res?.success) {
            this.closeModal();
            this.loadUsers();
            this.loadRoles();
          } else {
            this.modalError.set(res?.message || 'Gagal menyimpan perubahan.');
          }
        },
        error: (err) => {
          this.isSaving.set(false);
          this.modalError.set(err?.error?.message || 'Terjadi kesalahan saat memperbarui pengguna.');
        }
      });
    } else {
      const payload = {
        username: this.formData.username,
        password: this.formData.password,
        fullName: this.formData.fullName,
        email: this.formData.email,
        nip: this.formData.nip,
        telepon: this.formData.telepon,
        roleId: this.formData.roleId,
        satkerId: this.formData.satkerId
      };
      this.apiService.createUser(payload).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          if (res?.success) {
            this.closeModal();
            this.loadUsers();
            this.loadRoles();
          } else {
            this.modalError.set(res?.message || 'Gagal menambahkan pengguna baru.');
          }
        },
        error: (err) => {
          this.isSaving.set(false);
          this.modalError.set(err?.error?.message || 'Terjadi kesalahan saat menambahkan pengguna.');
        }
      });
    }
  }

  toggleStatus(user: UserDto) {
    if (confirm(`Apakah Anda yakin ingin mengubah status aktif pengguna '${user.fullName}'?`)) {
      this.apiService.toggleUserStatus(user.id).subscribe({
        next: () => {
          this.loadUsers();
        }
      });
    }
  }

  getRoleIcon(roleCode: string): string {
    switch (roleCode) {
      case 'SUPERADMIN': return 'pi pi-shield';
      case 'ADMIN_PUSAT': return 'pi pi-building';
      case 'OPERATOR_SATKER': return 'pi pi-desktop';
      case 'EKSEKUTIF': return 'pi pi-chart-pie';
      default: return 'pi pi-user';
    }
  }

  getRoleIconClass(roleCode: string): string {
    switch (roleCode) {
      case 'SUPERADMIN': return 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400';
      case 'ADMIN_PUSAT': return 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400';
      case 'OPERATOR_SATKER': return 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400';
      case 'EKSEKUTIF': return 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400';
      default: return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  }

  getRoleBadgeClass(roleCode: string): string {
    switch (roleCode) {
      case 'SUPERADMIN': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
      case 'ADMIN_PUSAT': return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800';
      case 'OPERATOR_SATKER': return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
      case 'EKSEKUTIF': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  }
}
