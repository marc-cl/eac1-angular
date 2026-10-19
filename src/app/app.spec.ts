import { TestBed } from '@angular/core/testing';
import { App } from './app';

/** Espera que acabi l'estat de càrrega simulat del component arrel. */
function esperarFiCarrega(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra l\'estat de càrrega abans que apareguin els elements', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Carregant elements...');
  });

  it('mostra els 10 elements del mock un cop acabada la càrrega', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await esperarFiCarrega();
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Mostrant 10 de 10 elements');
    expect(compiled.querySelectorAll('.targeta').length).toBe(10);
  });

  it('filtra per text sense distingir majúscules/minúscules', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await esperarFiCarrega();
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const inputText = compiled.querySelector<HTMLInputElement>('#filtre-text')!;
    inputText.value = 'PORTÀTIL';
    inputText.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    compiled.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();

    // "Portàtil" apareix al títol de 2 elements i a la descripció de 2 més
    // (p. ex. "...compatible amb portàtils i mòbils"), ja que el filtre
    // cerca tant al títol com a la descripció.
    expect(compiled.textContent).toContain('Mostrant 4 de 10 elements');
  });

  it('filtra per categoria', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await esperarFiCarrega();
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector<HTMLSelectElement>('#filtre-categoria')!;
    select.value = 'Àudio';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    compiled.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('Mostrant 2 de 10 elements');
  });

  it('combina text i categoria', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await esperarFiCarrega();
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const inputText = compiled.querySelector<HTMLInputElement>('#filtre-text')!;
    inputText.value = 'auricular';
    inputText.dispatchEvent(new Event('input'));

    const select = compiled.querySelector<HTMLSelectElement>('#filtre-categoria')!;
    select.value = 'Àudio';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    compiled.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('Mostrant 1 de 10 elements');
  });

  it('mostra un missatge quan no hi ha cap resultat', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await esperarFiCarrega();
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const inputText = compiled.querySelector<HTMLInputElement>('#filtre-text')!;
    inputText.value = 'zzz';
    inputText.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    compiled.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('Mostrant 0 de 10 elements');
    expect(compiled.textContent).toContain('No hi ha cap element per mostrar.');
  });

  it('restableix els filtres i torna a mostrar els 10 elements', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await esperarFiCarrega();
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const inputText = compiled.querySelector<HTMLInputElement>('#filtre-text')!;
    inputText.value = 'zzz';
    inputText.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    compiled.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.textContent).toContain('Mostrant 0 de 10 elements');

    const botoRestablir = compiled.querySelector<HTMLButtonElement>(
      'button[type="button"]',
    )!;
    botoRestablir.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('Mostrant 10 de 10 elements');
  });

  it('selecciona un element i mostra el seu detall, i permet tancar-lo', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    await esperarFiCarrega();
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const primeraTargeta = compiled.querySelector<HTMLButtonElement>('.targeta__boto')!;
    primeraTargeta.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelector('.detall')).not.toBeNull();

    const botoTancar = compiled.querySelector<HTMLButtonElement>('.detall__tancar')!;
    botoTancar.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelector('.detall')).toBeNull();
  });
});
