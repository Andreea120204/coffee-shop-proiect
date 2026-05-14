import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="centru">
      <h1>404</h1>
      <p>Pagina cautata nu exista.</p>
      <a routerLink="/">
        <button>Inapoi acasa</button>
      </a>
    </div>
  `,
  styles: [
    `
      .centru {
        text-align: center;
        padding: 4rem 1rem;
      }
      h1 {
        font-size: 5rem;
        color: #6f4e37;
        margin-bottom: 0.5rem;
      }
      p {
        margin-bottom: 1.5rem;
        color: #5a463a;
      }
    `,
  ],
})
export class NotFoundComponent {}
