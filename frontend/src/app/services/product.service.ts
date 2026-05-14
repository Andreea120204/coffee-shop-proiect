import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiUrl}/products`)
      .pipe(catchError(this.handleError));
  }

  getProductById(id: string): Observable<Product | null> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/${id}`).pipe(
      map((list) => (list.length > 0 ? list[0] : null)),
      catchError(this.handleError)
    );
  }

  addReview(
    productId: string,
    text: string,
    rating: number
  ): Observable<Product> {
    return this.http
      .post<{ product: Product }>(
        `${this.apiUrl}/products/${productId}/reviews`,
        { text, rating }
      )
      .pipe(
        map((response) => response.product),
        catchError(this.handleError)
      );
  }

  deleteReview(productId: string, reviewId: string): Observable<Product> {
    return this.http
      .delete<{ product: Product }>(
        `${this.apiUrl}/products/${productId}/reviews/${reviewId}`
      )
      .pipe(
        map((response) => response.product),
        catchError(this.handleError)
      );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let mesaj = 'A aparut o eroare necunoscuta.';
    if (err.error instanceof ErrorEvent) {
      mesaj = `Eroare retea: ${err.error.message}`;
    } else if (err.status === 0) {
      mesaj = 'API-ul nu raspunde. Verifica daca serverul ruleaza pe portul 8055.';
    } else if (err.error?.error) {
      mesaj = err.error.error;
    } else {
      mesaj = `Cod ${err.status}: ${err.message}`;
    }
    console.error('[ProductService]', mesaj, err);
    return throwError(() => new Error(mesaj));
  }
}
