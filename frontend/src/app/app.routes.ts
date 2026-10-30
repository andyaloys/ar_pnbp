import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PiutangListComponent } from './features/piutang/piutang-list.component';
import { PenagihanListComponent } from './features/penagihan/penagihan-list.component';
import { SaktiIntegrationComponent } from './features/sakti/sakti-integration.component';
import { MasterDataComponent } from './features/master/master-data.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard Eksekutif Piutang — AR PNBP' },
      { path: 'piutang', component: PiutangListComponent, title: 'Buku Pembantu Piutang — AR PNBP' },
      { path: 'penagihan', component: PenagihanListComponent, title: 'Monitoring Penagihan (SP) — AR PNBP' },
      { path: 'sakti', component: SaktiIntegrationComponent, title: 'Integrasi SAKTI Kemenkeu — AR PNBP' },
      { path: 'master', component: MasterDataComponent, title: 'Master Data & Satker — AR PNBP' }
    ]
  },
  { path: '**', redirectTo: '' }
];
