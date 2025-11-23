import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf, DatePipe, CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-courier',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, DatePipe, CurrencyPipe],
  templateUrl: './courier.component.html',
  styleUrls: ['./courier.component.css']
})
export class CourierComponent implements OnInit {

  orders: any[] = [];
  loading = false;
  errorMessage = '';
  
  // NOVAS LISTAS FILTRADAS
  ordersToPickUp: any[] = [];    // Status: READY_FOR_DELIVERY (Para pegar e sair)
  ordersEnRoute: any[] = [];     // Status: EN_ROUTE (A caminho / Para confirmar entrega)
  
  // Opcional: Lista para o rodapé (se você quiser implementá-la, por enquanto estará vazia)
  deliveredHistoryQuickView: any[] = []; 

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
    // Se quiser carregar o histórico para o rodapé, adicione uma chamada de serviço aqui:
    // this.loadDeliveredHistoryQuickView(); 
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    // Buscando APENAS status ativos
    this.orderService.getOrdersByStatus('READY_FOR_DELIVERY,EN_ROUTE').subscribe({
      next: data => {
        data.sort((a: any, b: any) => a.id - b.id); 
        this.orders = data;
        
        // FILTRAGEM DOS DADOS:
        this.ordersToPickUp = data.filter((o: any) => o.status === 'READY_FOR_DELIVERY');
        this.ordersEnRoute = data.filter((o: any) => o.status === 'EN_ROUTE');
        
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Erro ao carregar pedidos do motoboy.';
        this.loading = false;
      }
    });
  }
  
  // Opcional: Implemente se for usar a lista horizontal
  /*
  loadDeliveredHistoryQuickView(): void {
    this.orderService.getOrdersByStatus('DELIVERED', 5).subscribe({ // Ex: últimos 5
      next: data => {
        this.deliveredHistoryQuickView = data;
      }
      // Não precisa tratar erro, é uma view opcional
    });
  }
  */

  updateStatus(order: any, newStatus: string): void {
    this.orderService.updateStatus(order.id, newStatus).subscribe({
      next: () => {
        this.loadOrders(); 
        // this.loadDeliveredHistoryQuickView(); // Se implementar o rodapé
      },
      error: err => {
        console.error(err);
        alert('Erro ao atualizar status.');
      }
    });
  }
}