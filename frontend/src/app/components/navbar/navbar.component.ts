import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header>
      <div class="container nav">
        <a routerLink="/" class="brand">☕ Coffee Shop</a>
        <nav>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Acasa</a>
          <a routerLink="/produse" routerLinkActive="active">Produse</a>
          <a routerLink="/cos" routerLinkActive="active" class="cos">
            Cos
            @if (cart.totalArticole() > 0) {
              <span class="badge">{{ cart.totalArticole() }}</span>
            }
          </a>
          @if (auth.isLoggedIn()) {
            <a routerLink="/admin" routerLinkActive="active">Admin</a>
            <span class="user">Salut, {{ auth.user()?.username }}!</span>
            <button class="secondary" (click)="logout()">Iesire</button>
          } @else {
            <a routerLink="/login" routerLinkActive="active">Autentificare</a>
          }
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      header {
        background: #fff;
        border-bottom: 1px solid #e8dccd;
        position: sticky;
        top: 0;
        z-index: 10;
      }
      .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 1rem;
        padding-bottom: 1rem;
      }
      .brand {
        font-weight: 700;
        font-size: 1.25rem;
        color: #2b1d14;
      }
      nav {
        display: flex;
        align-items: center;
        gap: 1.25rem;
      }
      nav a {
        color: #2b1d14;
        font-weight: 500;
        padding: 0.25rem 0;
        border-bottom: 2px solid transparent;
        transition: border-color 0.2s ease;
      }
      nav a.active {
        border-bottom-color: #6f4e37;
        color: #6f4e37;
      }
      .user {
        font-size: 0.9rem;
        color: #6f4e37;
      }
      .cos {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
      }
      .badge {
        background: #6f4e37;
        color: #fff;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 0.1rem 0.45rem;
        border-radius: 999px;
        min-width: 20px;
        text-align: center;
      }
    `,
  ],
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
