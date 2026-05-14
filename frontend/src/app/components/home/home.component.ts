import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HighlightDirective } from '../../directives/highlight.directive';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, HighlightDirective, DecimalPipe],
  template: `
    <section class="hero">
      <div class="hero-text">
        <span class="eyebrow">CAFEA DE SPECIALITATE</span>
        <h1>{{ titlu }}</h1>
        <p class="lead">{{ subtitlu }}</p>
        <div class="actiuni">
          <a routerLink="/produse">
            <button>Cumpara acum</button>
          </a>
          <a routerLink="/cos">
            <button class="secondary">Vezi cosul</button>
          </a>
        </div>
        <div class="stats">
          <div>
            <strong>20+</strong>
            <span class="muted">produse</span>
          </div>
          <div>
            <strong>{{ mediaGenerala() | number: '1.1-1' }}/5</strong>
            <span class="muted">rating mediu</span>
          </div>
          <div>
            <strong>24h</strong>
            <span class="muted">livrare</span>
          </div>
        </div>
      </div>
      <div class="hero-image">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&h=900&q=80"
          alt="Cafea de specialitate"
        />
      </div>
    </section>

    <section class="featured">
      <div class="featured-header">
        <h2>Produse populare</h2>
        <a routerLink="/produse">Vezi toate →</a>
      </div>
      @if (incarcare()) {
        <p class="muted">Se incarca...</p>
      } @else {
        <div class="grid">
          @for (produs of recomandate(); track produs.id) {
            <a [routerLink]="['/produse', produs.id]" class="card produs" appHighlight="#fff7ed">
              <img [src]="produs.image" [alt]="produs.name" />
              <h3>{{ produs.name }}</h3>
              <p class="rating">
                <span class="stele">{{ stele(produs) }}</span>
                <span class="muted">{{ produs.reviews.length }} recenzii</span>
              </p>
            </a>
          }
        </div>
      }
    </section>

    <section class="beneficii">
      <h2>De ce sa alegi Coffee Shop?</h2>
      <div class="grid-3">
        @for (beneficiu of beneficii; track beneficiu.titlu) {
          <article class="card beneficiu" appHighlight="#fff7ed">
            <span class="icon">{{ beneficiu.icon }}</span>
            <h3>{{ beneficiu.titlu }}</h3>
            <p class="muted">{{ beneficiu.descriere }}</p>
          </article>
        }
      </div>
    </section>
  `,
  styles: [
    `
      /* Hero */
      .hero {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 2.5rem;
        align-items: center;
        padding: 2rem 0 3rem;
      }
      .eyebrow {
        display: inline-block;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        color: #6f4e37;
        margin-bottom: 0.75rem;
      }
      .hero h1 {
        font-size: 2.75rem;
        line-height: 1.15;
        margin-bottom: 1rem;
        letter-spacing: -0.01em;
      }
      .lead {
        font-size: 1.1rem;
        color: #5a463a;
        margin-bottom: 1.5rem;
        max-width: 48ch;
      }
      .actiuni {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-bottom: 2rem;
      }
      .stats {
        display: flex;
        gap: 2.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid #e8dccd;
      }
      .stats div {
        display: flex;
        flex-direction: column;
      }
      .stats strong {
        font-size: 1.5rem;
        color: #2b1d14;
      }
      .stats .muted {
        font-size: 0.8rem;
      }
      .hero-image img {
        width: 100%;
        height: 460px;
        object-fit: cover;
        border-radius: 14px;
        box-shadow: 0 12px 32px rgba(43, 29, 20, 0.18);
      }

      /* Featured */
      .featured {
        margin-top: 1rem;
      }
      .featured-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 1.25rem;
      }
      .featured-header a {
        font-weight: 500;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }
      .produs {
        display: block;
        color: inherit;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .produs:hover {
        transform: translateY(-3px);
        text-decoration: none;
        box-shadow: 0 8px 20px rgba(43, 29, 20, 0.12);
      }
      .produs img {
        width: 100%;
        height: 160px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 0.75rem;
      }
      .produs h3 {
        font-size: 1rem;
        margin-bottom: 0.5rem;
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

      /* Beneficii */
      .beneficii {
        margin-top: 3rem;
      }
      .beneficii h2 {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      .grid-3 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
      }
      .beneficiu {
        text-align: center;
        padding: 1.5rem 1.25rem;
      }
      .beneficiu .icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 0.5rem;
      }
      .beneficiu h3 {
        margin-bottom: 0.5rem;
        color: #6f4e37;
      }

      @media (max-width: 760px) {
        .hero {
          grid-template-columns: 1fr;
          padding-top: 1rem;
        }
        .hero h1 {
          font-size: 2rem;
        }
        .hero-image img {
          height: 280px;
        }
        .stats {
          gap: 1.5rem;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly titlu = 'Cafea de specialitate, livrata acasa';
  readonly subtitlu =
    'Accesorii alese cu grija pentru cei care isi pregatesc cafeaua acasa: pour over, espresso, cold brew si tot ce ai nevoie intre.';

  readonly incarcare = signal(true);
  readonly produse = signal<Product[]>([]);

  readonly beneficii = [
    {
      icon: '☕',
      titlu: 'Calitate selectata',
      descriere: 'Fiecare produs e testat de baristii nostri inainte sa intre in catalog.',
    },
    {
      icon: '🚚',
      titlu: 'Livrare rapida',
      descriere: 'Comenzile ajung in 24-48 de ore, oriunde in tara, ambalate cu grija.',
    },
    {
      icon: '⭐',
      titlu: 'Recenzii reale',
      descriere: 'Citeste parerile altor cumparatori inainte sa decizi, fara filtru.',
    },
  ];

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (p) => {
        this.produse.set(p);
        this.incarcare.set(false);
      },
      error: () => this.incarcare.set(false),
    });
  }

  recomandate(): Product[] {
    return [...this.produse()]
      .sort((a, b) => b.reviews.length - a.reviews.length)
      .slice(0, 4);
  }

  mediaGenerala(): number {
    const toate = this.produse().flatMap((p) => p.reviews.map((r) => r.rating));
    if (toate.length === 0) return 0;
    return toate.reduce((a, b) => a + b, 0) / toate.length;
  }

  stele(produs: Product): string {
    if (produs.reviews.length === 0) return '☆☆☆☆☆';
    const medie = Math.round(
      produs.reviews.reduce((acc, r) => acc + r.rating, 0) / produs.reviews.length
    );
    return '★'.repeat(medie) + '☆'.repeat(5 - medie);
  }
}
