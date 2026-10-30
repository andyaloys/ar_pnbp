import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PiutangListComponent } from './features/piutang/piutang-list.component';
import { PenagihanListComponent } from './features/penagihan/penagihan-list.component';
import { SaktiIntegrationComponent } from './features/sakti/sakti-integration.component';
import { MasterDataComponent } from './features/master/master-data.component';
import { UserManagementComponent } from './features/users/user-management.component';

export const routes: Routes = [
  // Public Landing & Login Pages
  { path: '', component: LandingComponent, pathMatch: 'full', title: 'Portal AR Management PNBP — KLH/BPLH 2026' },
  { path: 'login', component: LoginComponent, title: 'Masuk Akun — AR Management PNBP' },

  // Admin Workspace
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard Eksekutif Piutang — AR PNBP' },
      { path: 'piutang', component: PiutangListComponent, title: 'Buku Pembantu Piutang — AR PNBP' },
      { path: 'penagihan', component: PenagihanListComponent, title: 'Monitoring Penagihan (SP) — AR PNBP' },
      { path: 'sakti', component: SaktiIntegrationComponent, title: 'Integrasi SAKTI Kemenkeu — AR PNBP' },
      { path: 'master', component: MasterDataComponent, title: 'Master Data & Satker — AR PNBP' },
      { path: 'users', component: UserManagementComponent, title: 'Manajemen Pengguna & RBAC — AR PNBP' }
    ]
  },
  { path: '**', redirectTo: '' }
];
