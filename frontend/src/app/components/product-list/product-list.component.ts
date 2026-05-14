import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe],
  template: `
    <h1>Produsele noastre</h1>

    <div class="cautare">
      <input
        type="text"
        placeholder="Cauta produs..."
        [ngModel]="termen()"
        (ngModelChange)="termen.set($event)"
      />
      <p class="muted">
        Afisate: {{ produseFiltrate().length }} / {{ produse().length }}
      </p>
    </div>

    @if (incarcare()) {
      <div class="centru">
        <div class="spinner"></div>
        <p class="muted">Se incarca produsele...</p>
      </div>
    } @else if (eroare()) {
      <div class="card error-box">
        <strong>Eroare:</strong> {{ eroare() }}
        <button class="secondary" (click)="incarcaProdusele()">Reincearca</button>
      </div>
    } @else {
      <div class="grid">
        @for (produs of produseFiltrate(); track produs.id) {
          <a [routerLink]="['/produse', produs.id]" class="card produs">
            <img [src]="produs.image" [alt]="produs.name" />
            <h3>{{ produs.name }}</h3>
            <p class="pret">{{ produs.price }} <span class="moneda">RON</span></p>
            <p class="descriere">{{ produs.description }}</p>
            <p class="rating">
              <span class="stele">{{ stele(produs) }}</span>
              <span class="muted">
                {{ mediaRating(produs) | number: '1.1-1' }} ·
                {{ produs.reviews.length }} recenzii
              </span>
            </p>
          </a>
        } @empty {
          <p class="muted">Niciun produs nu corespunde cautarii.</p>
        }
      </div>
    }
  `,
  styles: [
    `
      h1 {
        margin-bottom: 1rem;
      }
      .cautare {
        margin-bottom: 1.5rem;
        max-width: 480px;
      }
      .cautare input {
        margin-bottom: 0.25rem;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1rem;
      }
      .produs {
        display: block;
        color: inherit;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .produs:hover {
        transform: translateY(-2px);
        text-decoration: none;
        box-shadow: 0 6px 16px rgba(43, 29, 20, 0.12);
      }
      .produs img {
        width: 100%;
        height: 160px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 0.75rem;
      }
      .produs h3 {
        margin-bottom: 0.25rem;
      }
      .pret {
        font-size: 1.1rem;
        font-weight: 700;
        color: #2b1d14;
        margin: 0.25rem 0 0.5rem;
      }
      .moneda {
        font-size: 0.8rem;
        font-weight: 500;
        color: #6f4e37;
      }
      .descriere {
        font-size: 0.9rem;
        color: #5a463a;
        margin-bottom: 0.5rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
      }
      .stele {
        color: #d4a017;
        letter-spacing: 0.05em;
      }
      .centru {
        text-align: center;
        padding: 3rem 1rem;
      }
      .spinner {
        margin: 0 auto 1rem;
        width: 40px;
        height: 40px;
        border: 4px solid #e8dccd;
        border-top-color: #6f4e37;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .error-box {
        border-left: 4px solid #b3261e;
      }
      .error-box button {
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly produse = signal<Product[]>([]);
  readonly termen = signal('');
  readonly incarcare = signal(true);
  readonly eroare = signal<string | null>(null);

  readonly produseFiltrate = computed(() => {
    const filtru = this.termen().trim().toLowerCase();
    if (!filtru) return this.produse();
    return this.produse().filter(
      (p) =>
        p.name.toLowerCase().includes(filtru) ||
        p.description.toLowerCase().includes(filtru)
    );
  });

  ngOnInit(): void {
    this.incarcaProdusele();
  }

  incarcaProdusele(): void {
    this.incarcare.set(true);
    this.eroare.set(null);
    this.productService.getProducts().subscribe({
      next: (produse) => {
        this.produse.set(produse);
        this.incarcare.set(false);
      },
      error: (err: Error) => {
        this.eroare.set(err.message);
        this.incarcare.set(false);
      },
    });
  }

  mediaRating(produs: Product): number {
    if (produs.reviews.length === 0) return 0;
    const suma = produs.reviews.reduce((acc, r) => acc + r.rating, 0);
    return suma / produs.reviews.length;
  }

  stele(produs: Product): string {
    if (produs.reviews.length === 0) return '☆☆☆☆☆';
    const medie = Math.round(this.mediaRating(produs));
    return '★'.repeat(medie) + '☆'.repeat(5 - medie);
  }
}
