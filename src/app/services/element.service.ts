import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Service, inject, signal } from '@angular/core';
import { Observable, Subject, catchError, map, of, switchMap, tap } from 'rxjs';

import { adaptarElement, adaptarElements, prepararElementApi } from '../adaptadors/element.adaptador';
import {
  CategoriaElement,
  Element,
  ElementApiResponse,
  EstatElements,
  NouElement,
} from '../models/element.model';
import { environment } from '../../environments/environment';

export const TOTES_LES_CATEGORIES = 'Totes' as const;

export type CategoriaFiltre = CategoriaElement | typeof TOTES_LES_CATEGORIES;

export interface CriterisCerca {
  text: string;
  categoria: CategoriaFiltre;
}

const CRITERIS_INICIALS: CriterisCerca = { text: '', categoria: TOTES_LES_CATEGORIES };

@Service()
export class ElementService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/elements`;

  // Flux de criteris de cerca: cada cerca confirmada s'emet aquí.
  // Subject (no BehaviorSubject): la primera petició la dispara el component amb carregarTot()
  private readonly criteris$ = new Subject<CriterisCerca>();
  private darrersCriteris: CriterisCerca = CRITERIS_INICIALS;

  // Estat únic del servei (fase, elements i error), exposat com a signal de només lectura
  private readonly estatSignal = signal<EstatElements>({ estat: 'inicial', elements: [] });
  readonly estat = this.estatSignal.asReadonly();

  constructor() {
    this.criteris$
      .pipe(
        tap((criteris) => {
          this.darrersCriteris = criteris;
          this.estatSignal.set({ estat: 'carregant', elements: [] });
        }),
        // switchMap cancel·la la petició anterior si arriben criteris nous abans que acabi
        switchMap((criteris) =>
          this.obtenirElements(criteris).pipe(
            map((elements): EstatElements => ({ estat: 'exit', elements })),
            catchError((error: HttpErrorResponse) =>
              of<EstatElements>({
                estat: 'error',
                elements: [],
                error: this.gestionarError(error),
              }),
            ),
          ),
        ),
      )
      .subscribe((estat) => this.estatSignal.set(estat));
  }

  /** Carrega tots els elements (sense criteris de cerca) */
  carregarTot(): void {
    this.cercar(CRITERIS_INICIALS);
  }

  /** Emet criteris nous: el flux del constructor fa la petició */
  cercar(criteris: CriterisCerca): void {
    this.criteris$.next({ text: criteris.text.trim(), categoria: criteris.categoria });
  }

  /** Repeteix l'última cerca (botó "Reintentar") */
  reintentar(): void {
    this.criteris$.next(this.darrersCriteris);
  }

  /** Crea un element nou amb POST i, si va bé, refresca el llistat */
  crearElement(nou: NouElement): Observable<Element> {
    return this.http.post<ElementApiResponse>(this.apiUrl, prepararElementApi(nou)).pipe(
      map(adaptarElement),
      tap(() => this.reintentar()),
    );
  }

  /** Nombre de resultats per a un text (per al validador asíncron) */
  comptarResultats(text: string): Observable<number> {
    return this.obtenirElements({ text, categoria: TOTES_LES_CATEGORIES }).pipe(
      map((elements) => elements.length),
    );
  }

  private obtenirElements(criteris: CriterisCerca): Observable<Element[]> {
    let params = new HttpParams();
    if (criteris.categoria !== TOTES_LES_CATEGORIES) {
      // L'API espera el valor en minúscules i sense accents
      params = params.set('categoria', this.aCategoriaApi(criteris.categoria));
    }

    return this.http.get<ElementApiResponse[]>(this.apiUrl, { params }).pipe(
      map(adaptarElements),
      map((elements) => this.filtrarPerText(elements, criteris.text)),
    );
  }

  private aCategoriaApi(categoria: CategoriaElement): string {
    return categoria
      .toLocaleLowerCase('ca')
      .replace('ò', 'o')
      .replace('à', 'a');
  }

  private filtrarPerText(elements: Element[], text: string): Element[] {
    const terme = text.trim().toLocaleLowerCase('ca');
    if (terme.length < 3) {
      return elements;
    }
    return elements.filter((element) =>
      `${element.titol} ${element.descripcio}`.toLocaleLowerCase('ca').includes(terme),
    );
  }

  private gestionarError(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0:
        return "No es pot connectar amb l'API. Comproveu que 'npm run api' està actiu.";
      case 404:
        return "Recurs no trobat. Verifiqueu la URL de l'API.";
      case 500:
        return 'Error intern del servidor.';
      default:
        return `Error inesperat (${error.status}): ${error.message}`;
    }
  }
}
