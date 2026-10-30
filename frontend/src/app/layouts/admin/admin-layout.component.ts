import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent
  ],
  template: `
    <div class="flex h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden transition-colors duration-200">
      <!-- Sidebar -->
      <app-sidebar 
        [collapsed]="sidebarCollapsed()" 
        (collapsedChange)="sidebarCollapsed.set($event)" 
      />

      <!-- Main Wrapper -->
      <div class="flex-1 flex flex-col h-screen overflow-hidden">
        <app-header 
          [sidebarCollapsed]="sidebarCollapsed()" 
          (toggleSidebar)="toggleSidebar()" 
        />
        
        <!-- Content Area -->
        <main class="flex-1 overflow-y-auto p-6 bg-slate-100/90 dark:bg-slate-900/60 transition-colors duration-200">
          <div class="max-w-7xl mx-auto space-y-6">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  sidebarCollapsed = signal(false);

  toggleSidebar() {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }
}
