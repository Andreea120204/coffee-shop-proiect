import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    title: 'Acasa - Coffee Shop',
  },
  {
    path: 'produse',
    loadComponent: () =>
      import('./components/product-list/product-list.component').then(
        (m) => m.ProductListComponent
      ),
    title: 'Produse - Coffee Shop',
  },
  {
    path: 'produse/:id',
    loadComponent: () =>
      import('./components/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
    title: 'Detaliu produs - Coffee Shop',
  },
  {
    path: 'cos',
    loadComponent: () =>
      import('./components/cart/cart.component').then((m) => m.CartComponent),
    title: 'Cosul tau - Coffee Shop',
  },
  {
    path: 'comanda',
    loadComponent: () =>
      import('./components/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
    title: 'Finalizare comanda - Coffee Shop',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
    title: 'Autentificare - Coffee Shop',
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/admin/admin.component').then((m) => m.AdminComponent),
    title: 'Administrare - Coffee Shop',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    title: 'Pagina nu a fost gasita',
  },
];
