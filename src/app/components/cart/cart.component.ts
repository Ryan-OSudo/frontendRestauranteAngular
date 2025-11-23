// src/app/components/cart/cart.component.ts

import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { NgForOf, NgIf, CurrencyPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Router, RouterModule } from '@angular/router'; // Adicione RouterModule aqui

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgForOf, NgIf, CurrencyPipe, RouterModule], // Adicione RouterModule
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  items: CartItem[] = [];
  total = 0;
  // Variável para armazenar a mensagem de erro do servidor
  errorMessage: string | null = null; 

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
  }

  increment(item: CartItem): void {
    this.cartService.increment(item.dishId);
    this.loadCart();
  }

  decrement(item: CartItem): void {
    this.cartService.decrement(item.dishId);
    this.loadCart();
  }

  remove(item: CartItem): void {
    // Certificando-se de que o item.id é o dishId se o CartService usar dishId
    // Se você estiver usando item.id no HTML, este é o local para corrigir.
    this.cartService.remove(item.dishId);
    this.loadCart();
  }

  clear(): void {
    this.cartService.clear();
    this.loadCart();
  }

  checkout(): void {
    this.errorMessage = null; // Limpa erros anteriores
    
    if (this.items.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    // Mapeamento dos itens do carrinho para o formato esperado pelo serviço de pedidos
    const orderItems = this.items.map(item => ({
      // Assumindo que CartItem tem dishId e quantity, e o serviço precisa desses nomes:
      dishId: item.dishId,
      quantity: item.quantity,
      // Se você precisar de dishName ou price aqui, inclua
    }));

    this.orderService.createOrder(orderItems).subscribe({
      next: (order) => {
        // ✅ Sucesso: Pedido criado
        console.log('Pedido criado:', order);
        alert(`🎉 Pedido #${order.id} criado com sucesso!`);
        this.cartService.clear();
        this.router.navigate(['/cliente/historico']);
      },
      error: (err) => {
        // ❌ Erro: Tratamento de erro detalhado
        console.error('Erro ao criar pedido:', err);
        
        // Mensagem de erro padrão
        let displayMessage = "Erro desconhecido ao finalizar o pedido. Tente novamente.";

        if (err.status === 400 && err.error && err.error.message) {
          // Erro Bad Request (Ex: Dados inválidos retornados pelo backend)
          displayMessage = `Falha nos dados: ${err.error.message}`;
        } else if (err.status === 0) {
          // Erro de rede ou CORS
          displayMessage = "Falha de conexão com o servidor. Verifique sua rede.";
        } else if (err.error && err.error.message) {
          // Captura mensagem de erro vinda do corpo da resposta do servidor
          displayMessage = `Erro do servidor: ${err.error.message}`;
        }

        // Armazena e exibe a mensagem de erro
        this.errorMessage = displayMessage;
        alert(`⚠️ Erro ao criar pedido:\n${displayMessage}`);
      }
    });
  }
}