import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private static BASE_URL = 'http://localhost:8080/api';
  private static ENCRYPTION_KEY = 'my-encryption-key';
  authStatusChanged = new EventEmitter<void>();

  constructor(private http: HttpClient, private router: Router) {}

  public encryptAndSaveToStorage(key: string, value: string): void {
    const encryptedValue = CryptoJS.AES.encrypt(value, ApiService.ENCRYPTION_KEY).toString();
    localStorage.setItem(key, encryptedValue);
  }

  public getFromStorageAndDecrypt(key: string): string | null {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      return CryptoJS.AES.decrypt(encryptedValue, ApiService.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    } catch {
      return null;
    }
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  // ✅ Popravljeno: ako token ne postoji, ne dodaje Authorization header
  private getHeader(): HttpHeaders {
    const token = this.getFromStorageAndDecrypt('token');
    if (!token || token.trim() === '') {
      return new HttpHeaders();
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  logout(): void {
    this.clearAuth();
    this.authStatusChanged.emit(); // ako koristiš eventove
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getFromStorageAndDecrypt('token');
    return !!(token && token.trim() !== '');
  }

  isAdmin(): boolean {
    const role = this.getFromStorageAndDecrypt('role');
    return role === 'ADMIN';
  }

  // --- AUTH ---
  registerUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/register`, body);
  }

  loginUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/login`, body);
  }

  getLoggedInUserInfo(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/users/current`, {
      headers: this.getHeader()
    });
  }

  // --- CATEGORY ---
  createCategory(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/categories/add`, body, {
      headers: this.getHeader()
    });
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/categories/all`, {
      headers: this.getHeader()
    });
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/categories/${id}`, {
      headers: this.getHeader()
    });
  }

  updateCategoryBy(id: string, body: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/categories/update/${id}`, body, {
      headers: this.getHeader()
    });
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/categories/delete/${id}`, {
      headers: this.getHeader()
    });
  }

  // --- SUPPLIER ---
  addSupplier(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/suppliers/add`, body, {
      headers: this.getHeader()
    });
  }

  getAllSuppliers(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/suppliers/all`, {
      headers: this.getHeader()
    });
  }

  getSupplierById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/suppliers/${id}`, {
      headers: this.getHeader()
    });
  }

  updateSupplierBy(id: string, body: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/suppliers/update/${id}`, body, {
      headers: this.getHeader()
    });
  }

  deleteSupplier(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/suppliers/delete/${id}`, {
      headers: this.getHeader()
    });
  }

  // --- PRODUCT ---
  addProduct(formData: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/products/add`, formData, {
      headers: this.getHeader()
    });
  }

  updateProduct(formData: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/products/update`, formData, {
      headers: this.getHeader()
    });
  }

  getAllProducts(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/products/all`, {
      headers: this.getHeader()
    });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/products/${id}`, {
      headers: this.getHeader()
    });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/products/delete/${id}`, {
      headers: this.getHeader()
    });
  }

  // --- TRANSACTIONS ---
  purchaseProduct(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/transactions/purchase`, body, {
      headers: this.getHeader()
    });
  }

  sellProduct(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/transactions/sell`, body, {
      headers: this.getHeader()
    });
  }

  getAllTransactions(searchText: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/all`, {
      params: { searchText },
      headers: this.getHeader()
    });
  }

  getTransactionById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/${id}`, {
      headers: this.getHeader()
    });
  }

  updateTransactionStatus(id: string, status: string): Observable<any> {
    return this.http.put(
      `${ApiService.BASE_URL}/transactions/update/${id}`,
      JSON.stringify(status),
      {
        headers: this.getHeader().set('Content-Type', 'application/json')
      }
    );
  }

  getTransactionsByMonthAndYear(month: number, year: number): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/by-month-year`, {
      headers: this.getHeader(),
      params: { month, year }
    });
  }
}
