import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <h1>Cosul tau</h1>

    @if (cart.items().length === 0) {
      <div class="gol card">
        <p class="muted">Cosul este gol.</p>
        <a routerLink="/produse">
          <button>Vezi produsele</button>
        </a>
      </div>
    } @else {
      <div class="layout">
        <section class="lista">
          @for (it of cart.items(); track it.productId) {
            <article class="card rand">
              <img [src]="it.image" [alt]="it.name" />
              <div class="info">
                <a [routerLink]="['/produse', it.productId]" class="nume">
                  {{ it.name }}
                </a>
                <p class="pret-unit muted">
                  {{ it.price | number: '1.0-0' }} RON / buc.
                </p>
              </div>
              <div class="cantitate">
                <button
                  class="qty"
                  (click)="cart.setCantitate(it.productId, it.quantity - 1)"
                  aria-label="Scade cantitatea"
                >−</button>
                <span class="nr">{{ it.quantity }}</span>
                <button
                  class="qty"
                  (click)="cart.setCantitate(it.productId, it.quantity + 1)"
                  aria-label="Creste cantitatea"
                >+</button>
              </div>
              <div class="subtotal-rand">
                <strong>{{ (it.price * it.quantity) | number: '1.0-0' }} RON</strong>
                <button
                  class="elimina"
                  (click)="cart.elimina(it.productId)"
                >Elimina</button>
              </div>
            </article>
          }
        </section>

        <aside class="rezumat card">
          <h2>Rezumat</h2>
          <div class="rand-rezumat">
            <span>Subtotal ({{ cart.totalArticole() }} art.)</span>
            <span>{{ cart.subtotal() | number: '1.0-0' }} RON</span>
          </div>
          <div class="rand-rezumat">
            <span>Livrare</span>
            @if (cart.costLivrare() === 0) {
              <span class="success">Gratis</span>
            } @else {
              <span>{{ cart.costLivrare() }} RON</span>
            }
          </div>
          @if (cart.subtotal() < 200) {
            <p class="hint muted">
              Mai adauga produse de
              {{ 200 - cart.subtotal() | number: '1.0-0' }} RON pentru livrare gratuita.
            </p>
          }
          <hr />
          <div class="rand-total">
            <strong>Total</strong>
            <strong>{{ cart.total() | number: '1.0-0' }} RON</strong>
          </div>
          <a routerLink="/comanda">
            <button class="finalizeaza">Finalizeaza comanda</button>
          </a>
          <a routerLink="/produse" class="link-continuare muted">
            ← Continua cumparaturile
          </a>
        </aside>
      </div>
    }
  `,
  styles: [
    `
      h1 {
        margin-bottom: 1.5rem;
      }
      .gol {
        text-align: center;
        padding: 3rem 1rem;
      }
      .gol button {
        margin-top: 1rem;
      }
      .layout {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 1.5rem;
        align-items: start;
      }
      .rand {
        display: grid;
        grid-template-columns: 80px 1fr auto auto;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.75rem;
      }
      .rand img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
      }
      .nume {
        font-weight: 600;
        color: #2b1d14;
      }
      .pret-unit {
        font-size: 0.85rem;
        margin: 0.15rem 0 0;
      }
      .cantitate {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .qty {
        width: 32px;
        height: 32px;
        padding: 0;
        border-radius: 50%;
        background: transparent;
        color: #6f4e37;
        border: 1px solid #d4c5b3;
        font-size: 1.1rem;
        line-height: 1;
      }
      .qty:hover:not(:disabled) {
        background: #6f4e37;
        color: #fff;
      }
      .nr {
        min-width: 24px;
        text-align: center;
        font-weight: 600;
      }
      .subtotal-rand {
        text-align: right;
      }
      .subtotal-rand strong {
        display: block;
        font-size: 1.05rem;
      }
      .elimina {
        background: transparent;
        color: #b3261e;
        padding: 0.25rem 0;
        font-size: 0.8rem;
      }
      .elimina:hover:not(:disabled) {
        background: transparent;
        text-decoration: underline;
      }
      .rezumat {
        position: sticky;
        top: 90px;
      }
      .rezumat h2 {
        margin-top: 0;
        margin-bottom: 1rem;
      }
      .rand-rezumat,
      .rand-total {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .rand-total {
        font-size: 1.15rem;
        margin: 0.5rem 0 1rem;
      }
      hr {
        border: none;
        border-top: 1px solid #e8dccd;
        margin: 0.75rem 0;
      }
      .hint {
        font-size: 0.85rem;
        margin: 0.5rem 0 0;
      }
      .finalizeaza {
        width: 100%;
        padding: 0.75rem;
        margin-top: 0.5rem;
      }
      .link-continuare {
        display: block;
        text-align: center;
        margin-top: 0.75rem;
        font-size: 0.9rem;
      }
      .success {
        color: #1b5e20;
        font-weight: 600;
      }

      @media (max-width: 800px) {
        .layout {
          grid-template-columns: 1fr;
        }
        .rand {
          grid-template-columns: 60px 1fr;
          grid-template-rows: auto auto;
          gap: 0.5rem 0.75rem;
        }
        .rand img {
          width: 60px;
          height: 60px;
        }
        .cantitate,
        .subtotal-rand {
          grid-column: 1 / -1;
          justify-content: space-between;
        }
        .subtotal-rand {
          display: flex;
          align-items: center;
        }
      }
    `,
  ],
})
export class CartComponent {
  readonly cart = inject(CartService);
}
