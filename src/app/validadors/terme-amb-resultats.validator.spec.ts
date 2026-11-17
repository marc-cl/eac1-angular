import { FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { termeAmbResultatsValidator } from './terme-amb-resultats.validator';
import { ElementService } from '../services/element.service';

type ServeiFals = Pick<ElementService, 'comptarResultats'>;

function creaControl(serveiFals: ServeiFals): FormControl<string> {
  return new FormControl('', {
    nonNullable: true,
    asyncValidators: [termeAmbResultatsValidator(serveiFals as ElementService)],
  });
}

describe('termeAmbResultatsValidator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('no consulta l\'API ni marca error amb menys de 3 caràcters', async () => {
    const comptarResultats = vi.fn();
    const control = creaControl({ comptarResultats });

    control.setValue('ar');
    await vi.runAllTimersAsync();

    expect(comptarResultats).not.toHaveBeenCalled();
    expect(control.errors).toBeNull();
  });

  it('és vàlid quan l\'API retorna almenys un resultat', async () => {
    const comptarResultats = vi.fn().mockReturnValue(of(3));
    const control = creaControl({ comptarResultats });

    control.setValue('arduino');
    await vi.advanceTimersByTimeAsync(400);

    expect(comptarResultats).toHaveBeenCalledWith('arduino');
    expect(control.errors).toBeNull();
  });

  it('marca senseResultats quan l\'API no troba cap element', async () => {
    const comptarResultats = vi.fn().mockReturnValue(of(0));
    const control = creaControl({ comptarResultats });

    control.setValue('zzzz');
    await vi.advanceTimersByTimeAsync(400);

    expect(control.errors).toEqual({ senseResultats: true });
  });

  it('espera 400ms (debounce) abans de consultar l\'API', async () => {
    const comptarResultats = vi.fn().mockReturnValue(of(1));
    const control = creaControl({ comptarResultats });

    control.setValue('arduino');
    await vi.advanceTimersByTimeAsync(399);
    expect(comptarResultats).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(comptarResultats).toHaveBeenCalled();
  });

  it('no bloqueja el formulari si l\'API falla', async () => {
    const comptarResultats = vi.fn().mockReturnValue(throwError(() => new Error('fail')));
    const control = creaControl({ comptarResultats });

    control.setValue('arduino');
    await vi.advanceTimersByTimeAsync(400);

    expect(control.errors).toBeNull();
  });
});
