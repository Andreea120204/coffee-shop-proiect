import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DecimalPipe],
  template: `
    @if (comandaPlasata()) {
      <div class="card succes-card">
        <div class="check">✓</div>
        <h1>Comanda plasata!</h1>
        <p class="muted">
          Numarul comenzii: <strong>{{ idComanda() }}</strong>
        </p>
        <p>
          Multumim, <strong>{{ numeClient() }}</strong>! Vei primi un email de
          confirmare la <em>{{ emailClient() }}</em>.
        </p>
        <p class="muted total-final">
          Total platit: <strong>{{ totalFinal() | number: '1.0-0' }} RON</strong>
        </p>
        <div class="actiuni-succes">
          <a routerLink="/produse">
            <button>Inapoi la magazin</button>
          </a>
          <a routerLink="/">
            <button class="secondary">Pagina principala</button>
          </a>
        </div>
      </div>
    } @else if (cart.items().length === 0) {
      <div class="card centru">
        <p class="muted">Cosul este gol. Adauga produse inainte de a comanda.</p>
        <a routerLink="/produse">
          <button>Vezi produsele</button>
        </a>
      </div>
    } @else {
      <h1>Finalizare comanda</h1>

      <div class="layout">
        <form
          [formGroup]="formularComanda"
          (ngSubmit)="trimite()"
          class="card formular"
        >
          <h2>Date livrare</h2>

          <div class="grid-2">
            <div class="camp">
              <label for="nume">Nume complet</label>
              <input id="nume" type="text" formControlName="nume" />
              @if (control('nume').touched && control('nume').errors) {
                @if (control('nume').errors?.['required']) {
                  <p class="error">Numele este obligatoriu.</p>
                }
                @if (control('nume').errors?.['minlength']) {
                  <p class="error">Numele trebuie sa aiba minim 3 caractere.</p>
                }
              }
            </div>

            <div class="camp">
              <label for="email">Email</label>
              <input id="email" type="email" formControlName="email" />
              @if (control('email').touched && control('email').errors) {
                @if (control('email').errors?.['required']) {
                  <p class="error">Email-ul este obligatoriu.</p>
                }
                @if (control('email').errors?.['email']) {
                  <p class="error">Email invalid.</p>
                }
              }
            </div>

            <div class="camp">
              <label for="telefon">Telefon</label>
              <input id="telefon" type="tel" formControlName="telefon" placeholder="07XX XXX XXX" />
              @if (control('telefon').touched && control('telefon').errors) {
                <p class="error">Numar de telefon invalid (minim 10 cifre).</p>
              }
            </div>

            <div class="camp">
              <label for="oras">Oras</label>
              <input id="oras" type="text" formControlName="oras" />
              @if (control('oras').touched && control('oras').errors?.['required']) {
                <p class="error">Orasul este obligatoriu.</p>
              }
            </div>
          </div>

          <div class="camp">
            <label for="adresa">Adresa</label>
            <input
              id="adresa"
              type="text"
              formControlName="adresa"
              placeholder="Strada, numar, bloc, apartament"
            />
            @if (control('adresa').touched && control('adresa').errors?.['required']) {
              <p class="error">Adresa este obligatorie.</p>
            }
          </div>

          <h2 style="margin-top: 1.5rem;">Metoda de plata</h2>
          <div class="metode">
            <label class="optiune">
              <input type="radio" formControlName="metodaPlata" value="ramburs" />
              <div>
                <strong>Plata la livrare</strong>
                <p class="muted">Numerar sau card, la curier.</p>
              </div>
            </label>
            <label class="optiune">
              <input type="radio" formControlName="metodaPlata" value="card" />
              <div>
                <strong>Card online</strong>
                <p class="muted">Vei fi redirectionat catre procesatorul de plati.</p>
              </div>
            </label>
          </div>

          <button
            type="submit"
            class="finalizeaza"
            [disabled]="formularComanda.invalid || trimitere()"
          >
            {{ trimitere() ? 'Se proceseaza...' : 'Plaseaza comanda' }}
          </button>
        </form>

        <aside class="rezumat card">
          <h2>Comanda ta</h2>
          @for (it of cart.items(); track it.productId) {
            <div class="rand-rezumat">
              <span>
                <strong>{{ it.quantity }}×</strong>
                {{ it.name }}
              </span>
              <span>{{ (it.price * it.quantity) | number: '1.0-0' }} RON</span>
            </div>
          }
          <hr />
          <div class="rand-rezumat">
            <span>Subtotal</span>
            <span>{{ cart.subtotal() | number: '1.0-0' }} RON</span>
          </div>
          <div class="rand-rezumat">
            <span>Livrare</span>
            <span>
              @if (cart.costLivrare() === 0) {
                <span class="success">Gratis</span>
              } @else {
                {{ cart.costLivrare() }} RON
              }
            </span>
          </div>
          <hr />
          <div class="rand-total">
            <strong>Total</strong>
            <strong>{{ cart.total() | number: '1.0-0' }} RON</strong>
          </div>
        </aside>
      </div>
    }
  `,
  styles: [
    `
      h1 {
        margin-bottom: 1.5rem;
      }
      h2 {
        margin: 0 0 1rem;
        font-size: 1.1rem;
      }
      .layout {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 1.5rem;
        align-items: start;
      }
      .formular {
        padding: 1.5rem;
      }
      .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .camp {
        margin-bottom: 0.75rem;
      }
      .camp label {
        display: block;
        margin-bottom: 0.3rem;
        font-weight: 500;
        font-size: 0.9rem;
      }
      .metode {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      .optiune {
        display: flex;
        gap: 0.75rem;
        padding: 0.85rem 1rem;
        border: 1px solid #d4c5b3;
        border-radius: 8px;
        cursor: pointer;
        transition: border-color 0.15s ease, background 0.15s ease;
      }
      .optiune:hover {
        border-color: #6f4e37;
      }
      .optiune input[type='radio'] {
        margin-top: 0.2rem;
        width: auto;
      }
      .optiune p {
        margin: 0.15rem 0 0;
        font-size: 0.85rem;
      }
      .finalizeaza {
        width: 100%;
        padding: 0.85rem;
        margin-top: 1rem;
        font-size: 1rem;
      }
      .rezumat {
        position: sticky;
        top: 90px;
      }
      .rand-rezumat {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        margin-bottom: 0.4rem;
        font-size: 0.9rem;
      }
      .rand-rezumat span:first-child {
        flex: 1;
      }
      .rand-total {
        display: flex;
        justify-content: space-between;
        font-size: 1.15rem;
        margin-top: 0.5rem;
      }
      hr {
        border: none;
        border-top: 1px solid #e8dccd;
        margin: 0.75rem 0;
      }
      .success {
        color: #1b5e20;
        font-weight: 600;
      }
      .succes-card {
        text-align: center;
        padding: 2.5rem 1.5rem;
        max-width: 540px;
        margin: 2rem auto;
      }
      .check {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #d4edda;
        color: #1b5e20;
        font-size: 2.5rem;
        line-height: 80px;
        text-align: center;
        margin: 0 auto 1rem;
      }
      .total-final {
        margin: 1rem 0;
      }
      .actiuni-succes {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 1rem;
      }
      .centru {
        text-align: center;
        padding: 3rem 1rem;
      }
      .centru button {
        margin-top: 1rem;
      }

      @media (max-width: 800px) {
        .layout,
        .grid-2 {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  readonly cart = inject(CartService);

  readonly trimitere = signal(false);
  readonly comandaPlasata = signal(false);
  readonly idComanda = signal('');
  readonly numeClient = signal('');
  readonly emailClient = signal('');
  readonly totalFinal = signal(0);

  readonly formularComanda: FormGroup = this.fb.group({
    nume: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefon: [
      '',
      [Validators.required, Validators.pattern(/^[0-9 +()-]{10,15}$/)],
    ],
    oras: ['', Validators.required],
    adresa: ['', [Validators.required, Validators.minLength(5)]],
    metodaPlata: ['ramburs', Validators.required],
  });

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.formularComanda.patchValue({ nume: user.username });
    }
  }

  control(nume: string) {
    return this.formularComanda.controls[nume];
  }

  trimite(): void {
    if (this.formularComanda.invalid) {
      this.formularComanda.markAllAsTouched();
      return;
    }
    this.trimitere.set(true);

    setTimeout(() => {
      const date = this.formularComanda.value;
      this.idComanda.set('CMD-' + Math.random().toString(36).slice(2, 8).toUpperCase());
      this.numeClient.set(date.nume);
      this.emailClient.set(date.email);
      this.totalFinal.set(this.cart.total());

      this.cart.goleste();
      this.trimitere.set(false);
      this.comandaPlasata.set(true);
    }, 800);
  }
}
