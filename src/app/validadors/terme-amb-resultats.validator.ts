import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, catchError, map, of, switchMap, timer } from 'rxjs';
import { ElementService } from '../services/element.service';

/**
 * Validador asíncron: el text ha de coincidir amb algun element de l'API.
 * Error retornat: { senseResultats: true }
 */
export function termeAmbResultatsValidator(elementService: ElementService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const text = (control.value ?? '').toString().trim();

    // Textos curts o buits: ja els atura la validació síncrona, no cal consultar l'API
    if (text.length < 3) {
      return of(null);
    }

    return timer(400).pipe(
      switchMap(() => elementService.comptarResultats(text)),
      map((total) => (total > 0 ? null : { senseResultats: true })),
      catchError(() => of(null)), // si l'API falla, no bloquegem el formulari
    );
  };
}
