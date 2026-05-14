import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="centru">
      <div class="card formular-card">
        <h1>Autentificare</h1>
        <p class="muted hint">
          Conturi demo: <code>admin / admin123</code> sau
          <code>barista / cafea2025</code>
        </p>

        <form #formLogin="ngForm" (ngSubmit)="autentifica(formLogin)">
          <div class="camp">
            <label for="username">Utilizator</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              minlength="3"
              [(ngModel)]="username"
              #usernameCtrl="ngModel"
            />
            @if (usernameCtrl.invalid && usernameCtrl.touched) {
              <p class="error">
                @if (usernameCtrl.errors?.['required']) {
                  <span>Utilizatorul este obligatoriu.</span>
                } @else if (usernameCtrl.errors?.['minlength']) {
                  <span>Minim 3 caractere.</span>
                }
              </p>
            }
          </div>

          <div class="camp">
            <label for="password">Parola</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              [(ngModel)]="password"
              #passwordCtrl="ngModel"
            />
            @if (passwordCtrl.invalid && passwordCtrl.touched) {
              <p class="error">Parola este obligatorie.</p>
            }
          </div>

          <button type="submit" [disabled]="formLogin.invalid || incarcare()">
            {{ incarcare() ? 'Se verifica...' : 'Intra in cont' }}
          </button>

          @if (eroare()) {
            <p class="error" style="margin-top: 0.75rem;">{{ eroare() }}</p>
          }
        </form>

        <p class="muted hint">
          <a routerLink="/">Inapoi la pagina principala</a>
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .centru {
        display: flex;
        justify-content: center;
        padding: 2rem 1rem;
      }
      .formular-card {
        width: 100%;
        max-width: 420px;
      }
      .formular-card h1 {
        margin-bottom: 0.5rem;
      }
      .hint {
        margin-bottom: 1rem;
      }
      .camp {
        margin-bottom: 1rem;
      }
      .camp label {
        display: block;
        margin-bottom: 0.35rem;
        font-weight: 500;
      }
      code {
        background: #f0e6d6;
        padding: 0.1rem 0.35rem;
        border-radius: 4px;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  username = '';
  password = '';
  readonly eroare = signal<string | null>(null);
  readonly incarcare = signal(false);

  autentifica(form: NgForm): void {
    if (form.invalid) return;
    this.incarcare.set(true);
    this.eroare.set(null);

    setTimeout(() => {
      const reusit = this.authService.login(this.username, this.password);
      if (!reusit) {
        this.eroare.set('Utilizator sau parola incorecte.');
        this.incarcare.set(false);
        return;
      }

      const returnUrl =
        this.route.snapshot.queryParamMap.get('returnUrl') ?? '/admin';
      this.router.navigateByUrl(returnUrl);
    }, 400);
  }
}
