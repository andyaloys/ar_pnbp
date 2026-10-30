import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5200/api';

  // Dashboard API
  getDashboardSummary(tahun?: number, satkerId?: number): Observable<any> {
    let params = new HttpParams();
    if (tahun) params = params.set('tahun', tahun);
    if (satkerId) params = params.set('satkerId', satkerId);
    return this.http.get(`${this.baseUrl}/dashboard/summary`, { params });
  }

  getAgingMatrix(satkerId?: number): Observable<any> {
    let params = new HttpParams();
    if (satkerId) params = params.set('satkerId', satkerId);
    return this.http.get(`${this.baseUrl}/dashboard/aging-matrix`, { params });
  }

  getKualitasBreakdown(satkerId?: number): Observable<any> {
    let params = new HttpParams();
    if (satkerId) params = params.set('satkerId', satkerId);
    return this.http.get(`${this.baseUrl}/dashboard/kualitas-breakdown`, { params });
  }

  getSatkerSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/satker-summary`);
  }

  // Master Data API
  getSatkers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/masterdata/satker`);
  }

  getWajibBayars(search?: string): Observable<any> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get(`${this.baseUrl}/masterdata/wajib-bayar`, { params });
  }

  createWajibBayar(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/masterdata/wajib-bayar`, data);
  }

  getJenisPnbps(): Observable<any> {
    return this.http.get(`${this.baseUrl}/masterdata/jenis-pnbp`);
  }

  getDokumenDasars(): Observable<any> {
    return this.http.get(`${this.baseUrl}/masterdata/dokumen-dasar`);
  }

  getKualitasAgings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/masterdata/kualitas-aging`);
  }

  // Piutang Ledger API
  getPiutangs(page: number = 1, pageSize: number = 15, filters: any = {}): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (filters.satkerId) params = params.set('satkerId', filters.satkerId);
    if (filters.wajibBayarId) params = params.set('wajibBayarId', filters.wajibBayarId);
    if (filters.kualitas) params = params.set('kualitas', filters.kualitas);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.search) params = params.set('search', filters.search);

    return this.http.get(`${this.baseUrl}/piutang`, { params });
  }

  getPiutangDetail(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/piutang/${id}`);
  }

  createPiutang(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/piutang`, data);
  }

  recordPembayaran(id: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/piutang/${id}/pembayaran`, data);
  }

  recordPenagihan(id: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/piutang/${id}/penagihan`, data);
  }

  recalculateAging(): Observable<any> {
    return this.http.post(`${this.baseUrl}/piutang/recalculate-aging`, {});
  }

  // SAKTI Integration API
  getSaktiPosisiPiutang(kodeSatker?: string, tahun?: number, kualitas?: string): Observable<any> {
    let params = new HttpParams();
    if (kodeSatker) params = params.set('kodeSatker', kodeSatker);
    if (tahun) params = params.set('tahun', tahun);
    if (kualitas) params = params.set('kualitas', kualitas);
    return this.http.get(`${this.baseUrl}/sakti/posisi-piutang`, { params });
  }

  getSaktiMutasiPiutang(startDate?: string, endDate?: string, kodeSatker?: string): Observable<any> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (kodeSatker) params = params.set('kodeSatker', kodeSatker);
    return this.http.get(`${this.baseUrl}/sakti/mutasi-piutang`, { params });
  }

  // User Management API (RBAC)
  getUsers(role?: string, satkerId?: number, search?: string): Observable<any> {
    let params = new HttpParams();
    if (role) params = params.set('role', role);
    if (satkerId) params = params.set('satkerId', satkerId);
    if (search) params = params.set('search', search);
    return this.http.get(`${this.baseUrl}/users`, { params });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`);
  }

  getRoles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/roles`);
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, data);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, data);
  }

  toggleUserStatus(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/${id}/toggle-status`, {});
  }
}
