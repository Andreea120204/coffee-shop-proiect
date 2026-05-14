import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, DatePipe, DecimalPipe],
  template: `
    <a routerLink="/produse" class="back">&larr; Inapoi la produse</a>

    @if (incarcare()) {
      <p class="muted">Se incarca produsul...</p>
    } @else if (eroare()) {
      <div class="card error-box">{{ eroare() }}</div>
    } @else {
      @if (produs(); as p) {
      <article class="detaliu">
        <img [src]="p.image" [alt]="p.name" />
        <div>
          <h1>{{ p.name }}</h1>
          <p class="rating-inline">
            <span class="stele">{{ stele(p) }}</span>
            <span class="muted">
              {{ mediaRating(p) | number: '1.1-1' }} · {{ p.reviews.length }} recenzii
            </span>
          </p>
          <p class="pret">{{ p.price }} <span class="moneda">RON</span></p>
          <p class="descriere">{{ p.description }}</p>

          <div class="cumparare">
            <button (click)="adaugaInCos(p)" class="primary-lg">
              Adauga in cos
            </button>
            @if (cart.cantitatePentru(p.id) > 0) {
              <p class="muted in-cos">
                In cos: {{ cart.cantitatePentru(p.id) }} buc.
                · <a routerLink="/cos">vezi cosul</a>
              </p>
            }
          </div>
        </div>
      </article>

      <section class="recenzii">
        <h2>Recenzii</h2>
        @for (review of p.reviews; track review.id) {
          <article class="card recenzie">
            <div class="header-recenzie">
              <strong>{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</strong>
              <span class="muted">
                {{ review.createdAt | date: 'dd MMMM yyyy' }}
              </span>
            </div>
            <p>{{ review.text }}</p>
          </article>
        } @empty {
          <p class="muted">Nicio recenzie inca. Fii primul!</p>
        }
      </section>

      <section class="formular">
        <h2>Adauga o recenzie</h2>
        <form [formGroup]="reviewForm" (ngSubmit)="trimite()" class="card">
          <div class="camp">
            <label for="rating">Rating (1-5)</label>
            <select id="rating" formControlName="rating">
              <option [ngValue]="null" disabled>Alege un rating</option>
              @for (n of [1, 2, 3, 4, 5]; track n) {
                <option [ngValue]="n">{{ n }} stele</option>
              }
            </select>
            @if (rating.invalid && rating.touched) {
              <p class="error">Te rugam sa alegi un rating.</p>
            }
          </div>

          <div class="camp">
            <label for="text">Comentariu</label>
            <textarea
              id="text"
              rows="4"
              formControlName="text"
              placeholder="Spune-ne ce parere ai despre acest produs..."
            ></textarea>
            @if (text.touched && text.errors) {
              @if (text.errors['required']) {
                <p class="error">Comentariul este obligatoriu.</p>
              }
              @if (text.errors['minlength']) {
                <p class="error">
                  Comentariul trebuie sa aiba minim
                  {{ text.errors['minlength'].requiredLength }} caractere.
                </p>
              }
            }
          </div>

          <button type="submit" [disabled]="reviewForm.invalid || trimitere()">
            {{ trimitere() ? 'Se trimite...' : 'Trimite recenzia' }}
          </button>

          @if (mesajSucces()) {
            <p class="success">{{ mesajSucces() }}</p>
          }
          @if (eroareTrimitere()) {
            <p class="error">{{ eroareTrimitere() }}</p>
          }
        </form>
      </section>
      }
    }
  `,
  styles: [
    `
      .back {
        display: inline-block;
        margin-bottom: 1rem;
      }
      .detaliu {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      .detaliu img {
        width: 100%;
        border-radius: 10px;
        object-fit: cover;
      }
      .rating-inline {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0.5rem 0;
      }
      .stele {
        color: #d4a017;
        letter-spacing: 0.05em;
      }
      .pret {
        font-size: 1.75rem;
        font-weight: 700;
        color: #2b1d14;
        margin: 0.75rem 0;
      }
      .moneda {
        font-size: 1rem;
        font-weight: 500;
        color: #6f4e37;
      }
      .descriere {
        margin: 0.75rem 0 1.25rem;
      }
      .cumparare {
        margin-top: 1rem;
      }
      .primary-lg {
        font-size: 1rem;
        padding: 0.75rem 1.5rem;
      }
      .in-cos {
        margin-top: 0.5rem;
        font-size: 0.85rem;
      }
      .recenzii,
      .formular {
        margin-top: 2rem;
      }
      .recenzie {
        margin-bottom: 0.75rem;
      }
      .header-recenzie {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .camp {
        margin-bottom: 1rem;
      }
      .camp label {
        display: block;
        margin-bottom: 0.35rem;
        font-weight: 500;
      }
      .error-box {
        border-left: 4px solid #b3261e;
      }
      @media (max-width: 640px) {
        .detaliu {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly fb = inject(FormBuilder);
  readonly cart = inject(CartService);

  readonly produs = signal<Product | null>(null);
  readonly incarcare = signal(true);
  readonly eroare = signal<string | null>(null);
  readonly trimitere = signal(false);
  readonly mesajSucces = signal<string | null>(null);
  readonly eroareTrimitere = signal<string | null>(null);

  readonly reviewForm: FormGroup = this.fb.group({
    rating: [null, Validators.required],
    text: ['', [Validators.required, Validators.minLength(5)]],
  });

  get rating() {
    return this.reviewForm.controls['rating'];
  }
  get text() {
    return this.reviewForm.controls['text'];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.eroare.set('ID produs lipsa.');
      this.incarcare.set(false);
      return;
    }
    this.incarcaProdus(id);
  }

  incarcaProdus(id: string): void {
    this.incarcare.set(true);
    this.productService.getProductById(id).subscribe({
      next: (p) => {
        if (!p) {
          this.eroare.set('Produsul nu a fost gasit.');
        } else {
          this.produs.set(p);
        }
        this.incarcare.set(false);
      },
      error: (err: Error) => {
        this.eroare.set(err.message);
        this.incarcare.set(false);
      },
    });
  }

  trimite(): void {
    const p = this.produs();
    if (!p || this.reviewForm.invalid) return;

    this.trimitere.set(true);
    this.mesajSucces.set(null);
    this.eroareTrimitere.set(null);

    const { text, rating } = this.reviewForm.value;
    this.productService.addReview(p.id, text, rating).subscribe({
      next: (produsActualizat) => {
        this.produs.set(produsActualizat);
        this.mesajSucces.set('Multumim pentru recenzie!');
        this.reviewForm.reset({ rating: null, text: '' });
        this.trimitere.set(false);
      },
      error: (err: Error) => {
        this.eroareTrimitere.set(err.message);
        this.trimitere.set(false);
      },
    });
  }

  mediaRating(produs: Product): number {
    if (produs.reviews.length === 0) return 0;
    return (
      produs.reviews.reduce((acc, r) => acc + r.rating, 0) /
      produs.reviews.length
    );
  }

  stele(produs: Product): string {
    if (produs.reviews.length === 0) return '☆☆☆☆☆';
    const medie = Math.round(this.mediaRating(produs));
    return '★'.repeat(medie) + '☆'.repeat(5 - medie);
  }

  adaugaInCos(produs: Product): void {
    this.cart.adauga(produs);
  }
}
