# Coffee Shop - Aplicatie Angular 19

Proiect de laborator pentru tema **Angular** (Web Development). Aplicatia este un mic
magazin online de accesorii pentru cafea care comunica cu un REST API local (Node/Express)
si demonstreaza toate conceptele cerute: data binding, directive, servicii, dependency
injection, formulare, HTTP, autentificare cu route guards si deployment.

## Cuprins

1. [Cerintele acoperite](#cerintele-acoperite)
2. [Structura proiectului](#structura-proiectului)
3. [Cerinte de sistem](#cerinte-de-sistem)
4. [Instalare si rulare](#instalare-si-rulare)
5. [Conturi demo](#conturi-demo)
6. [Deployment pe GitHub Pages](#deployment-pe-github-pages)
7. [Tehnologii folosite](#tehnologii-folosite)

## Cerintele acoperite

| Capitol din tema | Unde se gaseste in cod |
|---|---|
| a) Framework basics: data, property, event binding, directive | `home.component.ts`, `product-list.component.ts`, `navbar.component.ts` |
| b) Setarea mediului de dezvoltare | Sectiunea [Instalare](#instalare-si-rulare) |
| c) Servicii si dependency injection | `services/product.service.ts`, `services/auth.service.ts` |
| d) Handling forms (template-driven + reactive) | `login.component.ts` (template-driven), `product-detail.component.ts` (reactive) |
| e) Http requests | `services/product.service.ts` cu `HttpClient` |
| f) Authentication and route protection | `services/auth.service.ts`, `guards/auth.guard.ts`, `interceptors/auth.interceptor.ts` |
| g) Deployment | Sectiunea [Deployment](#deployment-pe-github-pages) |

## Structura proiectului

```
coffee-shop/
├── angular.json              # Configurare Angular CLI
├── package.json              # Dependinte si script-uri
├── tsconfig.json             # Configurare TypeScript
├── public/                   # Resurse statice (favicon, imagini)
└── src/
    ├── index.html            # Pagina HTML principala
    ├── main.ts               # Punct de start - bootstrapApplication()
    ├── styles.css            # Stiluri globale
    ├── environments/         # Configurari pentru dev / productie
    └── app/
        ├── app.component.ts  # Componenta radacina
        ├── app.config.ts     # Provideri globali (router, http, interceptori)
        ├── app.routes.ts     # Definirea rutelor
        ├── models/           # Interfete TypeScript (Product, Review)
        ├── services/         # ProductService, AuthService
        ├── guards/           # authGuard - protectie rute
        ├── interceptors/     # authInterceptor - adauga token-ul pe cereri
        ├── directives/       # HighlightDirective - directiva custom
        └── components/       # Toate componentele (standalone)
            ├── navbar/
            ├── home/
            ├── product-list/
            ├── product-detail/
            ├── login/
            ├── admin/        # ruta protejata
            └── not-found/    # pagina 404
```

## Cerinte de sistem

- **Node.js** versiunea 20.11.1 sau mai noua (Angular 19 nu mai accepta versiuni mai vechi)
- **npm** versiunea 10 sau mai noua (vine cu Node.js)
- **Angular CLI** versiunea 19 (se instaleaza global o singura data)

Verifica versiunile instalate:

```bash
node --version
npm --version
```

Instaleaza Angular CLI global (daca nu il ai):

```bash
npm install -g @angular/cli@19
ng version
```

## Instalare si rulare

Aplicatia are doua parti care trebuie pornite in paralel:

1. **REST API-ul** (Node.js + Express) - pe portul `8055`
2. **Aplicatia Angular** (frontend) - pe portul `4200`

### 1. Pornirea REST API-ului

Intra in folderul cu API-ul (`rw-api-main`) si ruleaza:

```bash
cd rw-api-main
npm install
npm start
```

API-ul va asculta pe `http://localhost:8055`. Testeaza cu:

```bash
curl http://localhost:8055/products
```

### 2. Pornirea aplicatiei Angular

Intr-un al doilea terminal, intra in folderul `coffee-shop` si ruleaza:

```bash
cd coffee-shop
npm install
npm start
```

Aplicatia va fi accesibila la `http://localhost:4200`.

### Comenzi utile

```bash
npm start            # ruleaza serverul de dezvoltare cu live-reload
npm run build        # construieste varianta de productie in dist/coffee-shop
npm run watch        # construieste in mod dezvoltare cu watch
npm run deploy       # deploy pe GitHub Pages (vezi sectiunea dedicata)
```

## Conturi demo

Aplicatia foloseste autentificare mock client-side. Conturile valabile sunt:

| Utilizator | Parola |
|---|---|
| `admin` | `admin123` |
| `barista` | `cafea2025` |

Dupa autentificare, ruta `/admin` devine accesibila. Daca incerci sa accesezi `/admin`
fara autentificare, vei fi redirectionat automat la `/login` si readus la `/admin` dupa
ce te autentifici (parametrul `returnUrl`).

## Deployment pe GitHub Pages

1. Asigura-te ca proiectul este urcat pe GitHub intr-un repo numit `coffee-shop`.

2. Construieste aplicatia cu base href corect (numele repo-ului):

   ```bash
   ng build --base-href "/coffee-shop/"
   ```

3. Deploy automat cu `angular-cli-ghpages` (deja in dependinte):

   ```bash
   npm run deploy
   ```

   Sau manual:

   ```bash
   npx angular-cli-ghpages --dir=dist/coffee-shop/browser
   ```

4. In setarile repo-ului GitHub, sectiunea **Pages**, alege branch-ul `gh-pages`.

5. Aplicatia va fi disponibila la `https://<utilizator>.github.io/coffee-shop/`.

**Important pentru routing:**
GitHub Pages nu gestioneaza nativ rutele Angular (single-page app). Pentru a evita
404 cand se face refresh pe o ruta, copiaza `index.html` ca `404.html` in folderul
publicat (`angular-cli-ghpages` face acest pas automat).

**Important pentru API:**
API-ul ruleaza local pe `localhost:8055`. Dupa deploy, fie schimbi `apiUrl` din
`environments/environment.ts` cu un URL public (de exemplu un API gazduit pe Render
sau Railway), fie pastrezi demo-ul local in care utilizatorul ruleaza si API-ul local.

## Tehnologii folosite

- **Angular 19** cu standalone components (fara NgModule)
- **TypeScript 5.6**
- **RxJS 7.8** pentru gestiunea fluxurilor asincrone
- **Signals** (Angular 16+) pentru reactivitate moderna
- **Control flow nou** (`@if`, `@for`, `@empty`) introdus in Angular 17
- **Reactive Forms** si **Template-driven Forms**
- **HttpClient** cu interceptori functionali
- **Functional Route Guards** (Angular 14+)
- **Lazy loading** pentru toate rutele (`loadComponent`)
