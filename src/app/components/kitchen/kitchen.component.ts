import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf, DatePipe, CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, DatePipe, CurrencyPipe],
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit {

  orders: any[] = [];
  loading = false;
  errorMessage = '';
  
  // NOVAS LISTAS FILTRADAS
  ordersToPrepare: any[] = []; // Status: CREATED
  ordersPreparing: any[] = []; // Status: PREPARING

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    // Buscando apenas CREATED e PREPARING
    this.orderService.getOrdersByStatus('CREATED,PREPARING').subscribe({
      next: data => {
        // Ordena por ID ou Data, se necessário
        data.sort((a: any, b: any) => a.id - b.id); 
        this.orders = data;
        
        // FILTRAGEM DOS DADOS:
        this.ordersToPrepare = data.filter((o: any) => o.status === 'CREATED');
        this.ordersPreparing = data.filter((o: any) => o.status === 'PREPARING');
        
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Erro ao carregar pedidos da cozinha.';
        this.loading = false;
      }
    });
  }

  updateStatus(order: any, newStatus: string): void {
    this.orderService.updateStatus(order.id, newStatus).subscribe({
      next: () => {
        this.loadOrders(); // Recarrega e refiltra as listas
      },
      error: err => {
        console.error(err);
        alert('Erro ao atualizar status.');
      }
    });
  }
}