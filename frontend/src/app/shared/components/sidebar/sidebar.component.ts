import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar bg-slate-950 border-r border-slate-800 flex flex-col h-screen transition-all duration-300"
           [class.w-64]="!collapsed()"
           [class.w-20]="collapsed()">
      
      <!-- Logo / Header -->
      <div class="h-16 flex items-center px-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div class="flex items-center gap-3 overflow-hidden cursor-pointer" (click)="toggleCollapse()">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
            <span class="text-white font-bold text-lg tracking-wider">AR</span>
          </div>
          @if (!collapsed()) {
            <div class="flex flex-col">
              <span class="font-bold text-sm tracking-wide text-white leading-tight">AR MANAGEMENT</span>
              <span class="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">PNBP • KLH / BPLH</span>
            </div>
          }
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        
        <div class="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase" [class.hidden]="collapsed()">
          Menu Utama
        </div>

        <a routerLink="/dashboard" 
           routerLinkActive="bg-indigo-600/20 text-sky-400 border-l-4 border-sky-400 font-medium" 
           class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition group">
          <i class="pi pi-chart-pie text-lg group-hover:scale-110 transition"></i>
          @if (!collapsed()) {
            <span class="text-xs">Dashboard Eksekutif</span>
          }
        </a>

        <a routerLink="/piutang" 
           routerLinkActive="bg-indigo-600/20 text-sky-400 border-l-4 border-sky-400 font-medium" 
           class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition group">
          <i class="pi pi-book text-lg group-hover:scale-110 transition"></i>
          @if (!collapsed()) {
            <span class="text-xs">Buku Piutang (AR Ledger)</span>
          }
        </a>

        <a routerLink="/penagihan" 
           routerLinkActive="bg-indigo-600/20 text-sky-400 border-l-4 border-sky-400 font-medium" 
           class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition group">
          <i class="pi pi-send text-lg group-hover:scale-110 transition"></i>
          @if (!collapsed()) {
            <span class="text-xs">Monitoring Penagihan (SP)</span>
          }
        </a>

        <div class="pt-4 px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase" [class.hidden]="collapsed()">
          Integrasi & Master
        </div>

        <a routerLink="/sakti" 
           routerLinkActive="bg-indigo-600/20 text-amber-400 border-l-4 border-amber-400 font-medium" 
           class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition group">
          <i class="pi pi-link text-lg text-amber-400 group-hover:scale-110 transition"></i>
          @if (!collapsed()) {
            <span class="text-xs">Integrasi SAKTI (OpenAPI)</span>
          }
        </a>

        <a routerLink="/master" 
           routerLinkActive="bg-indigo-600/20 text-sky-400 border-l-4 border-sky-400 font-medium" 
           class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition group">
          <i class="pi pi-database text-lg group-hover:scale-110 transition"></i>
          @if (!collapsed()) {
            <span class="text-xs">Master Data & Satker</span>
          }
        </a>
      </nav>

      <!-- Footer Info -->
      <div class="p-3 border-t border-slate-800 bg-slate-950/60">
        @if (!collapsed()) {
          <div class="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p class="text-[10px] text-slate-400 leading-none">Database Status</p>
              <p class="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                109.123.235.50
              </p>
            </div>
            <span class="text-[9px] px-1.5 py-0.5 bg-indigo-900/60 text-indigo-300 rounded font-mono">pnbp_ar</span>
          </div>
        }
      </div>

    </aside>
  `
})
export class SidebarComponent {
  collapsed = input(false);
  collapsedChange = output<boolean>();

  toggleCollapse() {
    this.collapsedChange.emit(!this.collapsed());
  }
}
