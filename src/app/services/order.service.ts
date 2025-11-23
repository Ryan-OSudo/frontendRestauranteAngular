import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItemRequest {
  dishId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) {}

  createOrder(items: OrderItemRequest[]): Observable<any> {
    return this.http.post(this.apiUrl, items);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateStatus(id: number, newStatus: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status?value=${newStatus}`, {});
  }

  getOrdersByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?status=${status}`);
  }
}
