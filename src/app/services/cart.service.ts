// src/app/services/cart.service.ts

import { Injectable } from '@angular/core';

export interface CartItem {
  dishId: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private storageKey = 'cart_items';
  private items: CartItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.items = JSON.parse(data);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
    this.saveToStorage();
  }

  /**
   * Adiciona um item ao carrinho.
   * O argumento 'dish' agora permite que 'quantity' seja opcional.
   */
  addItem(dish: { dishId: number; name: string; price: number; quantity?: number }): void {
    const existing = this.items.find(i => i.dishId === dish.dishId);
    
    // Calcula a quantidade a ser adicionada (usa o valor passado ou 1)
    const quantityToAdd = dish.quantity || 1;

    if (existing) {
      existing.quantity += quantityToAdd;
    } else {
      this.items.push({
        dishId: dish.dishId,
        name: dish.name,
        price: dish.price,
        quantity: quantityToAdd
      });
    }
    this.saveToStorage();
  }

  increment(dishId: number): void {
    const item = this.items.find(i => i.dishId === dishId);
    if (item) {
      item.quantity++;
      this.saveToStorage();
    }
  }

  decrement(dishId: number): void {
    const item = this.items.find(i => i.dishId === dishId);
    if (item) {
      item.quantity--;
      if (item.quantity <= 0) {
        this.items = this.items.filter(i => i.dishId !== dishId);
      }
      this.saveToStorage();
    }
  }

  remove(dishId: number): void {
    this.items = this.items.filter(i => i.dishId !== dishId);
    this.saveToStorage();
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}