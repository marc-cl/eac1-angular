import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';
import { ElementApiResponse } from './models/element.model';
import { environment } from '../environments/environment';

const API_URL = `${environment.apiUrl}/elements`;

function elementApi(parcial: Partial<ElementApiResponse> & { id: string }): ElementApiResponse {
  return {
    titol: 'Element',
    descripcio: 'Descripció',
    categoria: 'electronica',
    darrera_actualitzacio: '2026-01-01',
    valoracio_mitjana: '4',
    popular: false,
    ...parcial,
  };
}

const DEU_ELEMENTS: ElementApiResponse[] = Array.from({ length: 10 }, (_, i) =>
  elementApi({ id: String(i + 1), titol: `Element ${i + 1}` }),
);

describe('App', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    httpMock.expectOne(API_URL).flush([]);
  });

  it("mostra l'estat de càrrega abans que arribi la resposta de l'API", () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Carregant elements...');

    httpMock.expectOne(API_URL).flush(DEU_ELEMENTS);
  });

  it('mostra els elements un cop resolta la petició', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    httpMock.expectOne(API_URL).flush(DEU_ELEMENTS);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Mostrant 10 elements');
    expect(compiled.querySelectorAll('.targeta').length).toBe(10);
  });

  it("mostra un banner d'error i permet reintentar", () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    httpMock.expectOne(API_URL).flush('no disponible', { status: 0, statusText: 'Unknown Error' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain("No es pot connectar amb l'API");

    const botoReintentar = compiled.querySelector<HTMLButtonElement>('.estat-error__boto')!;
    botoReintentar.click();
    fixture.detectChanges();

    httpMock.expectOne(API_URL).flush(DEU_ELEMENTS);
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Mostrant 10 elements');
  });

  it('filtra per categoria demanant-ho a l\'API', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    httpMock.expectOne(API_URL).flush(DEU_ELEMENTS);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector<HTMLSelectElement>('#filtre-categoria')!;
    select.value = 'Àudio';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    compiled.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const req = httpMock.expectOne(
      (r) => r.url === API_URL && r.params.get('categoria') === 'audio',
    );
    req.flush([elementApi({ id: '3', titol: 'Auriculars', categoria: 'audio' })]);
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Mostrant 1 elements');
  });

  it('selecciona un element i mostra el seu detall, i permet tancar-lo', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    httpMock.expectOne(API_URL).flush(DEU_ELEMENTS);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const primeraTargeta = compiled.querySelector<HTMLButtonElement>('.targeta__boto')!;
    primeraTargeta.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.detall')).not.toBeNull();

    const botoTancar = compiled.querySelector<HTMLButtonElement>('.detall__tancar')!;
    botoTancar.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.detall')).toBeNull();
  });
});
