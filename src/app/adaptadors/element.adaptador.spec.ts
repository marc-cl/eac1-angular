import { adaptarElement, adaptarElements, prepararElementApi } from './element.adaptador';
import { ElementApiResponse } from '../models/element.model';

describe('adaptarElement', () => {
  const apiElement: ElementApiResponse = {
    id: '42',
    titol: '  Element de prova  ',
    descripcio: '  Descripció de prova  ',
    categoria: 'electronica',
    darrera_actualitzacio: '2026-11-01',
    valoracio_mitjana: '4.5',
    popular: true,
  };

  it('manté l\'id com a string i converteix la valoracio a número', () => {
    const adaptat = adaptarElement(apiElement);
    expect(adaptat.id).toBe('42');
    expect(adaptat.valoracio).toBe(4.5);
  });

  it('manté com a string un id no numèric (p. ex. assignat per POST)', () => {
    const adaptat = adaptarElement({ ...apiElement, id: 'v_12_6Vcml0' });
    expect(adaptat.id).toBe('v_12_6Vcml0');
  });

  it('retalla espais sobrants de titol i descripcio', () => {
    const adaptat = adaptarElement(apiElement);
    expect(adaptat.titol).toBe('Element de prova');
    expect(adaptat.descripcio).toBe('Descripció de prova');
  });

  it('normalitza la categoria a la forma amb accents', () => {
    expect(adaptarElement(apiElement).categoria).toBe('Electrònica');
  });

  it('canvia el nom del camp popular per destacat', () => {
    expect(adaptarElement(apiElement).destacat).toBe(true);
    expect(adaptarElement({ ...apiElement, popular: false }).destacat).toBe(false);
  });

  it('canvia el nom del camp darrera_actualitzacio per dataActualitzacio', () => {
    expect(adaptarElement(apiElement).dataActualitzacio).toBe('2026-11-01');
  });

  it('converteix valors numèrics no vàlids a 0', () => {
    const adaptat = adaptarElement({ ...apiElement, valoracio_mitjana: 'abc' });
    expect(adaptat.valoracio).toBe(0);
  });

  it('adapta un array complet', () => {
    expect(adaptarElements([apiElement, { ...apiElement, id: '43' }])).toHaveLength(2);
  });
});

describe('prepararElementApi', () => {
  it('prepara un element nou amb els noms de camp de l\'API', () => {
    const preparat = prepararElementApi({
      titol: '  Nou element  ',
      descripcio: '  Descripció nova  ',
      categoria: 'Energia',
      valoracio: 4,
    });

    expect(preparat.titol).toBe('Nou element');
    expect(preparat.descripcio).toBe('Descripció nova');
    expect(preparat.categoria).toBe('Energia');
    expect(preparat.valoracio_mitjana).toBe('4');
    expect(preparat.popular).toBe(false);
    expect(preparat.darrera_actualitzacio).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
