import { Routes } from '@angular/router';
import { DishListComponent } from './components/dish-list/dish-list.component';
import { DishFormComponent } from './components/dish-form/dish-form.component';

import { CartComponent } from './components/cart/cart.component';
import { HistoryComponent } from './components/history/history.component';
import { KitchenComponent } from './components/kitchen/kitchen.component';
import { CourierComponent } from './components/courier/courier.component';

export const routes: Routes = [
  // Cliente
  { path: 'cliente/menu', component: DishListComponent },
  { path: 'cliente/carrinho', component: CartComponent },
  { path: 'cliente/historico', component: HistoryComponent },

  // Cozinha
  { path: 'cozinha', component: KitchenComponent },

  // Motoboy
  { path: 'motoboy', component: CourierComponent },

  // Rotas de cadastro/edição de prato (como era antes)
  { path: 'add-dish', component: DishFormComponent },
  { path: 'edit-dish/:id', component: DishFormComponent },

  // Redirecionamentos
  { path: '', redirectTo: 'cliente/menu', pathMatch: 'full' },
  { path: '**', redirectTo: 'cliente/menu' }
];
