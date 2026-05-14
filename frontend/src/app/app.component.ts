import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <main class="container">
      <router-outlet />
    </main>
    <footer>
      <p class="muted">© 2025 Coffee Shop - Proiect Angular pentru laborator</p>
    </footer>
  `,
  styles: [
    `
      main {
        min-height: calc(100vh - 130px);
        padding-top: 1.5rem;
        padding-bottom: 2rem;
      }
      footer {
        text-align: center;
        padding: 1rem;
        border-top: 1px solid #e8dccd;
      }
    `,
  ],
})
export class AppComponent {}
