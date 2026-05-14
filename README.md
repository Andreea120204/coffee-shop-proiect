# Coffee Shop - Proiect Angular

Aplicatie web tip magazin online de accesorii pentru cafea.

Repository-ul contine doua proiecte separate care lucreaza impreuna:

```
coffee-shop-proiect/
├── frontend/   # Aplicatia Angular 19 (standalone components)
├── api/        # REST API mock (Node.js + Express)
└── docs/       # Documentatia .docx in romana
```

## Pornire rapida

Ai nevoie de **Node.js 20.11.1+** si **npm 10+**.

In **doua terminale separate**, ruleaza:

**Terminal 1 - API (port 8055)**

```bash
cd api
npm install
npm start
```

**Terminal 2 - Frontend (port 4200)**

```bash
cd frontend
npm install
npm start
```

Apoi deschide [http://localhost:4200](http://localhost:4200) in browser.

## Conturi demo

| Utilizator | Parola |
|---|---|
| `admin` | `admin123` |
| `barista` | `cafea2025` |

Dupa autentificare, ai acces la `/admin` (panou de administrare cu stergere recenzii).

## Functionalitati implementate

- **Catalog produse** - listare + cautare in timp real
- **Detaliu produs** - imagine, pret, recenzii, formular pentru recenzie noua
- **Cos de cumparaturi** - persistent in localStorage, cu calcul automat de subtotal/livrare/total
- **Finalizare comanda** - formular reactiv complet (livrare + metoda de plata), confirmare simulata
- **Autentificare** - login mock cu route protection (`/admin` accesibil doar autentificat)
- **Panou admin** - statistici, vizualizare si stergere recenzii (operatiune autentificata)

## Cerintele temei (din PDF) - mapare

| Capitol | Acoperire in cod |
|---|---|
| a) Framework basics (binding + directive) | Toate componentele; directiva custom `HighlightDirective`; control flow nou `@if`/`@for` |
| b) Setarea mediului | Sectiunea "Pornire rapida" de mai sus + capitolul 3 din doc |
| c) Services si DI | `ProductService`, `AuthService`, `CartService` (toate `@Injectable({ providedIn: 'root' })`) |
| d) Forms | Template-driven (login) + Reactive (recenzie + checkout) |
| e) HTTP | GET, POST si DELETE in `ProductService` cu RxJS si error handling |
| f) Auth si route protection | `authGuard` (client) + `authInterceptor` (token automat) + verificare pe server |
| g) Deployment | `angular-cli-ghpages` configurat; vezi `frontend/README.md` pentru pasi detaliati |

## Tehnologii

- **Frontend:** Angular 19, TypeScript 5.6, RxJS, Signals
- **Backend:** Node.js, Express
- **Persistenta:** fisier JSON pentru produse + localStorage pentru sesiune si cos

## Documentatie

Documentatia teoretica completa se afla la:
[`docs/Documentatie.docx`](docs/Documentatie.docx)
