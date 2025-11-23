import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { CommonModule } from '@angular/common'; // Inclui NgFor, NgIf, CurrencyPipe, e NgClass
import { OrderService } from '../../services/order.service';
import { Router, RouterModule } from '@angular/router'; // Router e RouterModule

// 1. Interface Estendida para incluir a propriedade de hover
interface CartItemWithHover extends CartItem {
  isHovered?: boolean;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  // 2. Importar CommonModule e RouterModule para todas as diretivas e pipes
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  // 3. Usar a interface CartItemWithHover para os itens
  items: CartItemWithHover[] = [];
  total = 0;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const rawItems = this.cartService.getItems();
    // 4. Inicializar isHovered como false ao carregar os itens
    this.items = rawItems.map((item) => ({
      ...item,
      isHovered: false,
    }));
    this.total = this.cartService.getTotal();
  }

  // 5. Método setHover, chamado pelo (mouseenter) e (mouseleave)
  setHover(item: CartItemWithHover, isHovered: boolean): void {
    item.isHovered = isHovered;
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
    this.cartService.remove(item.dishId);
    this.loadCart();
  }

  clear(): void {
    this.cartService.clear();
    this.loadCart();
  }

  checkout(): void {
    if (this.items.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    const orderItems = this.items.map((item) => ({
      dishId: item.dishId,
      quantity: item.quantity,
    }));

    this.orderService.createOrder(orderItems).subscribe({
      next: (order) => {
        alert('Pedido criado com sucesso!');
        this.cartService.clear();
        this.router.navigate(['/cliente/historico']);
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao criar pedido.');
      },
    });
  }
}
