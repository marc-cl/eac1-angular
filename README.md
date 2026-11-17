# Catàleg d'elements

Aplicació Angular (v22, standalone) que mostra un catàleg d'elements (productes electrònics)
classificats per categoria, amb cerca i filtrat per text/categoria, llistat en targetes i un
panell de detall de l'element seleccionat.

Projecte desenvolupat per a l'assignatura DA2_OA01 - Programació Avançada amb Angular.

## Funcionalitats

- Llistat d'elements carregat des d'una API local (json-server), en forma de targetes, amb
  etiqueta de categoria, valoració, data d'actualització formatada i distintiu "Destacat"
  quan correspon.
- Formulari reactiu de cerca amb validació síncrona (mínim 3 caràcters) i asíncrona
  (el text ha de tenir resultats a l'API, amb debounce de 400 ms) i selector de categoria
  (les 5 categories o "Totes").
- Gestió de 4 estats del servei (inicial, carregant, èxit, error), amb banner d'error i
  botó "Reintentar" que repeteix l'última cerca.
- Historial de les 8 últimes cerques desades a `localStorage`, sense repetir dues vegades
  consecutives la mateixa cerca, amb opció de recuperar-les o netejar-les.
- Formulari d'alta d'un element nou, amb POST a l'API i refresc automàtic del llistat.
- Selecció d'un element per veure'n el detall en un panell lateral, amb opció de tancar-lo.
- Accessibilitat: enllaç de salt al contingut principal, focus visible, labels associats,
  `aria-live`/`role="status"`/`role="alert"` en els estats dinàmics i en els errors de
  validació, i estructura semàntica (`header`, `nav`, `main`, `section`, `aside`).
- Layout responsive (escriptori, tauleta i mòbil) i respecte per `prefers-reduced-motion`.

## Estructura de fitxers

```
src/app/
├── app.ts / app.html / app.scss / app.spec.ts   Component arrel: integra filtres,
│                                                 llistat, alta d'elements i panell de detall
├── app.config.ts, app.routes.ts                 Configuració (provideHttpClient) i rutes
├── models/
│   └── element.model.ts            Element, ElementApiResponse, EstatElements, CercaDesada...
├── adaptadors/
│   └── element.adaptador.ts        Transformació API ↔ model intern (+ test unitari)
├── services/
│   ├── element.service.ts          HTTP (GET/POST), estat amb signal, switchMap, reintentar
│   └── historial-cerques.service.ts  Historial de cerques a localStorage
├── validadors/
│   └── terme-amb-resultats.validator.ts  Validador asíncron amb debounce
├── mocks/
│   └── dades-mock.ts               Dades mock originals (ja no s'utilitzen en temps d'execució)
└── components/
    ├── etiqueta-element/        EtiquetaElementComponent    Distintiu visual de categoria
    ├── targeta-element/         TargetaElementComponent     Targeta/resum d'un element
    ├── llista-elements/         LlistaElementsComponent     Llistat d'elements (@for/@empty)
    ├── barra-filtres/           BarraFiltresComponent       Formulari reactiu de cerca + historial
    └── formulari-nou-element/   FormulariNouElementComponent  Alta d'un element (POST)

tools/api/
└── cataleg.json                API local servida amb json-server
```

## Requisits

- Node.js 24.x LTS i npm instal·lats.
- Angular CLI 22.x (s'invoca via `npx ng` si no està instal·lat globalment).

## Instal·lació

```bash
npm install
```

## Serveis

L'aplicació consumeix una API local reproduïble amb [json-server](https://github.com/typicode/json-server),
servida a partir de `tools/api/cataleg.json`.

### Arrencar l'API

```bash
npm run api
```

Arrenca `json-server` al port 4301. Verificació: `http://localhost:4301/elements` ha de
mostrar un array JSON amb 10 elements.

### Endpoints disponibles

- `GET /elements` — Retorna tots els elements.
- `GET /elements?categoria=electronica` — Filtra per categoria (valor en minúscules i
  sense accents).
- `POST /elements` — Crea un element nou (l'id l'assigna l'API).

### Configuració

- **Port:** 4301 (`src/environments/environment.ts`, camp `apiUrl`).
- **Fitxer de dades:** `tools/api/cataleg.json`.
- El filtre de text s'aplica al servei Angular després d'adaptar les dades (el paràmetre
  de cerca global de json-server no és prou fiable per a aquest cas).

### ElementService (`src/app/services/element.service.ts`)

| Membre | Tipus | Descripció |
|---|---|---|
| `estat()` | `Signal<EstatElements>` | Fase actual (`inicial`/`carregant`/`exit`/`error`), elements i missatge d'error |
| `carregarTot()` | `void` | Emet criteris buits: carrega tots els elements |
| `cercar(criteris)` | `void` | Emet criteris nous (text i categoria) |
| `reintentar()` | `void` | Repeteix l'última cerca (botó "Reintentar") |
| `crearElement(nou)` | `Observable<Element>` | POST d'un element nou; en acabar, refresca el llistat |
| `comptarResultats(text)` | `Observable<number>` | Nombre d'elements que coincideixen (validador asíncron) |

Les cerques passen per un `Subject` + `switchMap`: si arriben criteris nous abans que
acabi la petició anterior, aquesta es cancel·la i només compta l'última.

### Gestió d'errors

| Codi HTTP | Missatge |
|---|---|
| 0 | No es pot connectar amb l'API. Comproveu que `npm run api` està actiu. |
| 404 | Recurs no trobat. Verifiqueu la URL de l'API. |
| 500 | Error intern del servidor. |
| Altres | Error inesperat (codi): missatge |

## Models i adaptadors

L'API i el model intern de l'aplicació tenen formes diferents (`src/app/models/element.model.ts`),
i `src/app/adaptadors/element.adaptador.ts` fa la transformació:

### Mapeig de camps (API → model intern)

| Camp API | Camp intern | Transformació |
|---|---|---|
| `id` (string) | `id` (number) | Conversió numèrica segura |
| `titol` | `titol` | `trim()` |
| `descripcio` | `descripcio` | `trim()` |
| `categoria` (minúscules, sense accents) | `categoria` | Normalització a `CategoriaElement` (amb accents) |
| `darrera_actualitzacio` | `dataActualitzacio` | Canvi de nom |
| `valoracio_mitjana` (string) | `valoracio` | Conversió numèrica segura (0 si no és vàlid) |
| `popular` | `destacat` | Canvi de nom, booleà |

Funcions: `adaptarElement()`, `adaptarElements()` (API → intern) i `prepararElementApi()`
(intern → API, per al POST). Testades a `element.adaptador.spec.ts`.

## Formularis

### BarraFiltresComponent (cerca)

| Control | Validacions | Missatge |
|---|---|---|
| `text` | `minLength(3)` (síncrona), `termeAmbResultatsValidator` (asíncrona, `timer(400)` + `switchMap` contra l'API) | "El text de cerca ha de tenir almenys 3 caràcters." / "Cap element coincideix amb aquest text." |
| `categoria` | cap | — |

- El botó "Aplicar" es desactiva si el formulari és invàlid o pendent de validar.
- En confirmar una cerca vàlida, es desa a l'historial (`HistorialCerquesService`,
  `localStorage`, clau `cataleg-historial-cerques`, màxim 8 entrades, sense repetir la
  mateixa cerca dues vegades consecutives, lectura/escriptura protegides amb `try/catch`).
- El botó "Restablir" buida el formulari i torna a mostrar tots els elements.

### FormulariNouElementComponent (alta)

Formulari reactiu amb validadors síncrons (`required`, `minLength`, `min`/`max`) que crida
`ElementService.crearElement()`. Mostra "Enviant..." mentre s'espera la resposta i un
missatge d'èxit o d'error segons el resultat.

## Execució en mode desenvolupament

Calen dos terminals:

```bash
npm run api     # terminal 1: API local al port 4301
npm start       # terminal 2: ng serve, http://localhost:4200
```

L'aplicació es recarrega automàticament en modificar els fitxers font.

## Build de producció

```bash
ng build
```

## Tests unitaris

```bash
ng test
```

## Branques del repositori

- `main`: branca base del projecte.
- `ra1-setup`: configuració inicial del projecte (EAC1).
- `ra2-components`: components, filtres i integració de la interfície (EAC2).
- `ra3-serveis`: API local, models/adaptadors, servei HTTP, cerca reactiva amb validació
  asíncrona, historial a `localStorage` i alta d'elements amb POST (EAC3, aquesta branca).
- `ra4-navegacio`: prevista per a la unitat de navegació (RA4).
