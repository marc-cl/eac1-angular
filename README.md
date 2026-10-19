# Catàleg d'elements

Aplicació Angular (v22, standalone) que mostra un catàleg d'elements (productes electrònics)
classificats per categoria, amb cerca i filtrat per text/categoria, llistat en targetes i un
panell de detall de l'element seleccionat.

Projecte desenvolupat per a l'assignatura DA2_OA01 - Programació Avançada amb Angular.

## Funcionalitats

- Llistat de 10 elements (dades mock) en forma de targetes, amb etiqueta de categoria,
  valoració, data d'actualització formatada i distintiu "Destacat" quan correspon.
- Barra de filtres amb cerca per text (opcional, mínim 3 caràcters si s'escriu) i selector
  de categoria (les 5 categories o "Totes"), amb validació, missatges d'ajuda/error i botó
  de restabliment.
- Filtratge combinat (text + categoria) sense distingir majúscules/minúscules, sense
  modificar les dades originals.
- Comptador dinàmic de resultats ("Mostrant N de 10 elements").
- Estat de càrrega breu ("Carregant elements...") i missatge quan no hi ha resultats.
- Selecció d'un element per veure'n el detall en un panell lateral, amb opció de tancar-lo.
- Accessibilitat: enllaç de salt al contingut principal, focus visible, labels associats,
  `aria-live`/`role="status"`/`role="alert"` en els estats dinàmics i en els errors de
  validació, i estructura semàntica (`header`, `nav`, `main`, `section`, `aside`).
- Layout responsive (escriptori, tauleta i mòbil) i respecte per `prefers-reduced-motion`.

## Estructura de fitxers

```
src/app/
├── app.ts / app.html / app.scss / app.spec.ts   Component arrel: integra filtres,
│                                                 llistat i panell de detall
├── app.config.ts, app.routes.ts                 Configuració i rutes de l'aplicació
├── models/
│   └── element.model.ts                         Model Element i CategoriaElement
├── mocks/
│   └── dades-mock.ts                            10 elements de dades mock
└── components/
    ├── etiqueta-element/      EtiquetaElementComponent    Distintiu visual de categoria
    ├── targeta-element/       TargetaElementComponent     Targeta/resum d'un element
    ├── llista-elements/       LlistaElementsComponent      Llistat d'elements (@for/@empty)
    └── barra-filtres/         BarraFiltresComponent        Formulari de filtres (text + categoria)
```

## Requisits

- Node.js i npm instal·lats.
- Angular CLI 22.x (s'invoca via `npx ng` si no està instal·lat globalment).

## Instal·lació

```bash
npm install
```

## Execució en mode desenvolupament

```bash
npm start
```

(equivalent a `ng serve`). Un cop arrencat el servidor, obre el navegador a
`http://localhost:4200/`. L'aplicació es recarrega automàticament en modificar els fitxers
font.

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
- `ra2-components`: components, filtres i integració de la interfície (EAC2, aquesta branca).
- `ra3-serveis`: prevista per a la unitat de serveis (RA3).
- `ra4-navegacio`: prevista per a la unitat de navegació (RA4).
