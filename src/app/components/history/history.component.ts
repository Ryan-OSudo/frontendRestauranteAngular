import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf, DatePipe, CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, DatePipe, CurrencyPipe],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  orders: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getOrders().subscribe({
      next: (data) => {
        data.sort((a: any, b: any) => b.id - a.id);
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao carregar pedidos.';
        this.loading = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'CREATED': return 'Criado';
      case 'PREPARING': return 'Preparando';
      case 'READY_FOR_DELIVERY': return 'Pronto para entrega';
      case 'EN_ROUTE': return 'A caminho';
      case 'DELIVERED': return 'Entregue';
      default: return status;
    }
  }
}
