import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ElementService, TOTES_LES_CATEGORIES } from './element.service';
import { ElementApiResponse } from '../models/element.model';
import { environment } from '../../environments/environment';

const API_URL = `${environment.apiUrl}/elements`;

const ELEMENTS_API: ElementApiResponse[] = [
  {
    id: '1',
    titol: 'Portàtil UltraBook 14',
    descripcio: 'Portàtil lleuger de 14 polzades.',
    categoria: 'electronica',
    darrera_actualitzacio: '2026-09-12',
    valoracio_mitjana: '4.6',
    popular: true,
  },
  {
    id: '3',
    titol: 'Auriculars Sense Fils Studio',
    descripcio: 'Auriculars amb cancel·lació activa de soroll.',
    categoria: 'audio',
    darrera_actualitzacio: '2026-09-25',
    valoracio_mitjana: '4.8',
    popular: true,
  },
];

describe('ElementService', () => {
  let service: ElementService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ElementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('comença en estat inicial', () => {
    expect(service.estat()).toEqual({ estat: 'inicial', elements: [] });
  });

  it('carregarTot() passa per carregant i acaba en èxit amb els elements adaptats', () => {
    service.carregarTot();
    expect(service.estat().estat).toBe('carregant');

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(ELEMENTS_API);

    expect(service.estat().estat).toBe('exit');
    expect(service.estat().elements).toHaveLength(2);
    expect(service.estat().elements[0].categoria).toBe('Electrònica');
    expect(service.estat().elements[0].id).toBe('1');
  });

  it('gestiona un error de connexió amb l\'API', () => {
    service.carregarTot();
    const req = httpMock.expectOne(API_URL);
    req.flush('no disponible', { status: 0, statusText: 'Unknown Error' });

    expect(service.estat().estat).toBe('error');
    expect(service.estat().error).toContain('npm run api');
  });

  it('reintentar() repeteix l\'última cerca', () => {
    service.carregarTot();
    httpMock.expectOne(API_URL).flush('error', { status: 500, statusText: 'Server Error' });
    expect(service.estat().estat).toBe('error');

    service.reintentar();
    httpMock.expectOne(API_URL).flush(ELEMENTS_API);
    expect(service.estat().estat).toBe('exit');
  });

  it('cercar() amb una categoria envia el paràmetre normalitzat a l\'API', () => {
    service.cercar({ text: '', categoria: 'Electrònica' });

    const req = httpMock.expectOne(
      (r) => r.url === API_URL && r.params.get('categoria') === 'electronica',
    );
    req.flush([ELEMENTS_API[0]]);

    expect(service.estat().elements).toHaveLength(1);
  });

  it('cercar() amb "Totes" no envia el paràmetre de categoria', () => {
    service.cercar({ text: '', categoria: TOTES_LES_CATEGORIES });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.params.has('categoria')).toBe(false);
    req.flush(ELEMENTS_API);
  });

  it('crearElement() fa un POST i refresca el llistat', () => {
    service.crearElement({
      titol: 'Nou element',
      descripcio: 'Descripció del nou element',
      categoria: 'Energia',
      valoracio: 4,
    }).subscribe();

    const postReq = httpMock.expectOne(API_URL);
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body.titol).toBe('Nou element');
    postReq.flush({ ...ELEMENTS_API[0], id: '99', titol: 'Nou element' });

    // crearElement() refresca el llistat amb reintentar()
    const getReq = httpMock.expectOne(API_URL);
    expect(getReq.request.method).toBe('GET');
    getReq.flush(ELEMENTS_API);

    expect(service.estat().estat).toBe('exit');
  });

  it('comptarResultats() retorna el nombre de coincidències per a un text', () => {
    let total: number | undefined;
    service.comptarResultats('auriculars').subscribe((t) => (total = t));

    const req = httpMock.expectOne(API_URL);
    req.flush(ELEMENTS_API);

    expect(total).toBe(1);
  });
});
