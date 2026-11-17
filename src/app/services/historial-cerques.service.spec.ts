import { TestBed } from '@angular/core/testing';
import { HistorialCerquesService } from './historial-cerques.service';

describe('HistorialCerquesService', () => {
  let service: HistorialCerquesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialCerquesService);
  });

  afterEach(() => localStorage.clear());

  it('comença buit si no hi ha res a localStorage', () => {
    expect(service.historial()).toEqual([]);
  });

  it('desa una cerca vàlida (mínim 3 caràcters)', () => {
    service.desar('arduino', 'Electrònica');
    expect(service.historial()).toHaveLength(1);
    expect(service.historial()[0].text).toBe('arduino');
  });

  it('ignora cerques de menys de 3 caràcters', () => {
    service.desar('ar', 'Totes');
    expect(service.historial()).toHaveLength(0);
  });

  it('no repeteix la mateixa cerca dues vegades consecutives', () => {
    service.desar('sensor', 'Totes');
    service.desar('sensor', 'Totes');
    expect(service.historial()).toHaveLength(1);
  });

  it('sí que permet repetir una cerca si no és la immediatament anterior', () => {
    service.desar('sensor', 'Totes');
    service.desar('motor', 'Totes');
    service.desar('sensor', 'Totes');
    expect(service.historial()).toHaveLength(3);
  });

  it('manté com a màxim 8 cerques, la més recent primer', () => {
    for (let i = 0; i < 10; i++) {
      service.desar(`terme${i}`, 'Totes');
    }
    expect(service.historial()).toHaveLength(8);
    expect(service.historial()[0].text).toBe('terme9');
  });

  it('persisteix a localStorage i es recupera en una nova instància del servei', () => {
    service.desar('bateria', 'Energia');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const altreServei = TestBed.inject(HistorialCerquesService);

    expect(altreServei.historial()).toHaveLength(1);
    expect(altreServei.historial()[0].text).toBe('bateria');
  });

  it('netejar() buida l\'historial i el localStorage', () => {
    service.desar('bateria', 'Energia');
    service.netejar();
    expect(service.historial()).toEqual([]);
    expect(localStorage.getItem('cataleg-historial-cerques')).toBe('[]');
  });

  it('tolera dades corruptes a localStorage sense trencar l\'aplicació', () => {
    localStorage.setItem('cataleg-historial-cerques', '{invalid json');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    let servei!: HistorialCerquesService;
    expect(() => (servei = TestBed.inject(HistorialCerquesService))).not.toThrow();
    expect(servei.historial()).toEqual([]);
  });
});
