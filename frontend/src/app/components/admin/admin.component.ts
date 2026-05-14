import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  template: `
    <header class="antet">
      <div>
        <h1>Panou administrare</h1>
        <p class="muted">
          Conectat ca <strong>{{ auth.user()?.username }}</strong>
        </p>
      </div>
    </header>

    @if (incarcare()) {
      <p class="muted">Se incarca statisticile...</p>
    } @else if (eroare()) {
      <div class="card">{{ eroare() }}</div>
    } @else {
      <div class="statistici">
        <div class="card stat">
          <span class="numar">{{ produse().length }}</span>
          <span class="muted">Produse in catalog</span>
        </div>
        <div class="card stat">
          <span class="numar">{{ totalRecenzii() }}</span>
          <span class="muted">Recenzii in total</span>
        </div>
        <div class="card stat">
          <span class="numar">{{ mediaGenerala() | number: '1.2-2' }}</span>
          <span class="muted">Rating mediu</span>
        </div>
      </div>

      <h2>Recenzii ({{ totalRecenzii() }})</h2>
      @if (mesajActiune()) {
        <p class="success">{{ mesajActiune() }}</p>
      }
      <div class="card" style="padding: 0; overflow: hidden;">
        <table>
          <thead>
            <tr>
              <th>Produs</th>
              <th>Rating</th>
              <th>Comentariu</th>
              <th>Data</th>
              <th class="actiune">Actiuni</th>
            </tr>
          </thead>
          <tbody>
            @for (linie of toateRecenziile(); track linie.id) {
              <tr>
                <td>{{ linie.numeProdus }}</td>
                <td>{{ linie.rating }} / 5</td>
                <td class="comentariu">{{ linie.text }}</td>
                <td>{{ linie.createdAt | date: 'dd.MM.yyyy HH:mm' }}</td>
                <td class="actiune">
                  <button
                    class="sterge"
                    [disabled]="stergereInCurs() === linie.id"
                    (click)="stergeRecenzia(linie.productId, linie.id)"
                  >
                    {{ stergereInCurs() === linie.id ? '...' : 'Sterge' }}
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="muted" style="text-align: center; padding: 2rem;">
                  Nicio recenzie inca.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: [
    `
      .antet {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      h1 {
        margin-bottom: 0.25rem;
      }
      h2 {
        margin: 2rem 0 1rem;
      }
      .statistici {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
        margin-top: 1.5rem;
      }
      .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .numar {
        font-size: 2rem;
        font-weight: 700;
        color: #6f4e37;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 0.65rem 0.85rem;
        text-align: left;
        border-bottom: 1px solid #e8dccd;
        font-size: 0.9rem;
        vertical-align: top;
      }
      th {
        background: #f7f3ee;
        color: #6f4e37;
        font-weight: 600;
      }
      tr:last-child td {
        border-bottom: none;
      }
      .comentariu {
        max-width: 380px;
      }
      .actiune {
        text-align: right;
        white-space: nowrap;
      }
      button.sterge {
        background: transparent;
        color: #b3261e;
        border: 1px solid #b3261e;
        padding: 0.3rem 0.7rem;
        font-size: 0.85rem;
      }
      button.sterge:hover:not(:disabled) {
        background: #b3261e;
        color: #fff;
      }
    `,
  ],
})
export class AdminComponent implements OnInit {
  private readonly productService = inject(ProductService);
  readonly auth = inject(AuthService);

  readonly produse = signal<Product[]>([]);
  readonly incarcare = signal(true);
  readonly eroare = signal<string | null>(null);
  readonly stergereInCurs = signal<string | null>(null);
  readonly mesajActiune = signal<string | null>(null);

  readonly totalRecenzii = computed(() =>
    this.produse().reduce((acc, p) => acc + p.reviews.length, 0)
  );

  readonly mediaGeneralaSignal = computed(() => {
    const toate = this.produse().flatMap((p) => p.reviews.map((r) => r.rating));
    if (toate.length === 0) return 0;
    return toate.reduce((a, b) => a + b, 0) / toate.length;
  });

  readonly toateRecenziile = computed(() =>
    this.produse()
      .flatMap((p) =>
        p.reviews.map((r) => ({
          ...r,
          numeProdus: p.name,
          productId: p.id,
        }))
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );

  ngOnInit(): void {
    this.incarcaDate();
  }

  incarcaDate(): void {
    this.incarcare.set(true);
    this.productService.getProducts().subscribe({
      next: (p) => {
        this.produse.set(p);
        this.incarcare.set(false);
      },
      error: (err: Error) => {
        this.eroare.set(err.message);
        this.incarcare.set(false);
      },
    });
  }

  mediaGenerala(): number {
    return this.mediaGeneralaSignal();
  }

  stergeRecenzia(productId: string, reviewId: string): void {
    if (!confirm('Sigur stergi aceasta recenzie? Actiunea este definitiva.')) {
      return;
    }
    this.stergereInCurs.set(reviewId);
    this.mesajActiune.set(null);

    this.productService.deleteReview(productId, reviewId).subscribe({
      next: (produsActualizat) => {
        this.produse.update((lista) =>
          lista.map((p) => (p.id === produsActualizat.id ? produsActualizat : p))
        );
        this.stergereInCurs.set(null);
        this.mesajActiune.set('Recenzia a fost stearsa.');
        setTimeout(() => this.mesajActiune.set(null), 3000);
      },
      error: (err: Error) => {
        this.stergereInCurs.set(null);
        this.eroare.set(err.message);
        setTimeout(() => this.eroare.set(null), 4000);
      },
    });
  }
}
