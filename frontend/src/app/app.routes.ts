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
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // 1. Public Landing Page
  { 
    path: '', 
    component: LandingComponent, 
    pathMatch: 'full', 
    title: 'Portal AR Management PNBP — KLH/BPLH 2026' 
  },

  // 2. Authentication Login (Dilindungi guestGuard agar yang sudah login langsung ke dashboard)
  { 
    path: 'login', 
    component: LoginComponent, 
    canActivate: [guestGuard],
    title: 'Masuk Akun — AR Management PNBP' 
  },

  // 3. Admin Workspace Terproteksi (Dilindungi authGuard secara menyeluruh)
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard Eksekutif Piutang — AR PNBP' },
      { path: 'piutang', component: PiutangListComponent, title: 'Buku Pembantu Piutang — AR PNBP' },
      { path: 'penagihan', component: PenagihanListComponent, title: 'Monitoring Penagihan (SP) — AR PNBP' },
      { path: 'sakti', component: SaktiIntegrationComponent, title: 'Integrasi SAKTI Kemenkeu — AR PNBP' },
      { path: 'master', component: MasterDataComponent, title: 'Master Data & Satker — AR PNBP' },
      { path: 'users', component: UserManagementComponent, title: 'Manajemen Pengguna & RBAC — AR PNBP' }
    ]
  },

  // Wildcard fallback
  { path: '**', redirectTo: '' }
];
