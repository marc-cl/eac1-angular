import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FormulariNouElementComponent } from './formulari-nou-element.component';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/elements`;

describe('FormulariNouElementComponent', () => {
  let component: FormulariNouElementComponent;
  let fixture: ComponentFixture<FormulariNouElementComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulariNouElementComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormulariNouElementComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('no envia res si el formulari és invàlid', () => {
    component.crear();
    expect(component.formulari.touched).toBe(true);
    httpMock.expectNone(API_URL);
  });

  it('fa un POST amb les dades del formulari i mostra el missatge d\'èxit', () => {
    component.formulari.setValue({
      titol: 'Resistència 220 Ω',
      descripcio: 'Resistència de prova per al formulari.',
      categoria: 'Energia',
      valoracio: 4,
    });

    component.crear();
    expect(component.enviant()).toBe(true);

    const postReq = httpMock.expectOne(API_URL);
    expect(postReq.request.method).toBe('POST');
    postReq.flush({
      id: '11',
      titol: 'Resistència 220 Ω',
      descripcio: 'Resistència de prova per al formulari.',
      categoria: 'energia',
      darrera_actualitzacio: '2026-11-17',
      valoracio_mitjana: '4',
      popular: false,
    });

    httpMock.expectOne(API_URL).flush([]); // refresc del llistat (reintentar())

    expect(component.enviant()).toBe(false);
    expect(component.missatge()).toContain('Resistència 220 Ω');
  });

  it('mostra un error si l\'API no respon', () => {
    component.formulari.setValue({
      titol: 'Element de prova',
      descripcio: 'Descripció prou llarga per validar.',
      categoria: 'Energia',
      valoracio: 3,
    });

    component.crear();
    httpMock.expectOne(API_URL).flush('error', { status: 0, statusText: 'Unknown Error' });

    expect(component.enviant()).toBe(false);
    expect(component.error()).toContain("No s'ha pogut crear l'element");
  });
});
