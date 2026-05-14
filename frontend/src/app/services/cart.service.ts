import { Injectable, computed, effect, signal } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

const STORAGE_KEY = 'coffee_shop_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>(this.citesteDinStorage());

  readonly items = this._items.asReadonly();

  readonly totalArticole = computed(() =>
    this._items().reduce((acc, it) => acc + it.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this._items().reduce((acc, it) => acc + it.price * it.quantity, 0)
  );

  // Livrare gratuita peste 200 RON
  readonly costLivrare = computed(() => (this.subtotal() >= 200 ? 0 : 15));

  readonly total = computed(() => this.subtotal() + this.costLivrare());

  constructor() {
    // Sincronizare localStorage
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
      } catch { /* noop */ }
    });
  }

  adauga(produs: Product, cantitate: number = 1): void {
    this._items.update((lista) => {
      const existent = lista.find((it) => it.productId === produs.id);
      if (existent) {
        return lista.map((it) =>
          it.productId === produs.id
            ? { ...it, quantity: it.quantity + cantitate }
            : it
        );
      }
      const nou: CartItem = {
        productId: produs.id,
        name: produs.name,
        image: produs.image,
        price: produs.price,
        quantity: cantitate,
      };
      return [...lista, nou];
    });
  }

  setCantitate(productId: string, cantitate: number): void {
    if (cantitate <= 0) {
      this.elimina(productId);
      return;
    }
    this._items.update((lista) =>
      lista.map((it) =>
        it.productId === productId ? { ...it, quantity: cantitate } : it
      )
    );
  }

  elimina(productId: string): void {
    this._items.update((lista) => lista.filter((it) => it.productId !== productId));
  }

  goleste(): void {
    this._items.set([]);
  }

  cantitatePentru(productId: string): number {
    return this._items().find((it) => it.productId === productId)?.quantity ?? 0;
  }

  private citesteDinStorage(): CartItem[] {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
