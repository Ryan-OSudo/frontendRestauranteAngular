// src/app/components/dish-list/dish-list.component.ts

import { Component, OnInit } from '@angular/core';
import { DishService, Dish } from '../../services/dish.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms'; // 👈 NOVO: Importado para usar [(ngModel)]

// Interface estendida para incluir a quantidade para o formulário
interface DishWithQuantity extends Dish {
  quantity: number;
}

@Component({
  selector: 'app-dish-list',
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css'],
  standalone: true,
  // 👈 CORRIGIDO: Adicionado FormsModule
  imports: [CommonModule, RouterModule, FormsModule] 
})
export class DishListComponent implements OnInit {
  // 👈 CORRIGIDO: Usando DishWithQuantity
  dishes: DishWithQuantity[] = []; 
  notificationMessage: string = '';
  showNotification: boolean = false;

  constructor(
    private dishService: DishService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadDishes();
  }

  loadDishes() {
    this.dishService.getDishes().subscribe((data: Dish[]) => {
      // 👈 CORRIGIDO: Mapear para inicializar a quantidade com 1
      this.dishes = data.map(dish => ({ ...dish, quantity: 1 })); 
    });
  }

  deleteDish(id: number | undefined): void {
    if (id == null) {
      return;
    }

    this.dishService.deleteDish(id).subscribe(() => {
      this.loadDishes();
      this.showToast('Prato excluído com sucesso.', 'warning');
    });
  }

  // 👈 CORRIGIDO: Função de adicionar ao carrinho
  addToCart(dish: DishWithQuantity): void {
    // 1. Validação do ID
    if (dish.id === undefined || dish.id === null) {
        console.error("Prato sem ID válido:", dish);
        this.showToast(`ERRO: Prato "${dish.name}" não possui ID válido.`, 'error');
        return; 
    }
    
    // 2. Validação da Quantidade
    if (dish.quantity < 1) {
        this.showToast(`ERRO: Quantidade deve ser 1 ou mais.`, 'error');
        return; 
    }

    // 3. Adiciona ao carrinho com a quantidade selecionada
    this.cartService.addItem({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: dish.quantity 
    });

    // 4. Resetar a quantidade para 1 após adicionar
    dish.quantity = 1;

    // 5. Notificação
    this.showToast(`${dish.quantity}x "${dish.name}" adicionado(s) ao carrinho!`, 'success');
  }
  
  // Função auxiliar para exibir a notificação (Toast)
  showToast(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    this.notificationMessage = message;
    this.showNotification = true;
    
    // Opcional: Adicionar classe para estilo de erro/aviso no CSS
    // Não implementado, mas útil para o CSS
    
    setTimeout(() => {
      this.showNotification = false;
      this.notificationMessage = '';
    }, 3000);
  }
}