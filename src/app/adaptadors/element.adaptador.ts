import { Element, ElementApiResponse, NouElement } from '../models/element.model';

/** L'API envia la categoria en minúscules i sense accents; aquí es normalitza al valor intern. */
const CATEGORIES_NORMALITZADES: Record<string, Element['categoria']> = {
  electronica: 'Electrònica',
  audio: 'Àudio',
  accessoris: 'Accessoris',
  pantalles: 'Pantalles',
  energia: 'Energia',
};

function normalitzaCategoria(categoria: string | undefined): Element['categoria'] {
  const neta = (categoria ?? '').trim().toLocaleLowerCase('ca');
  return CATEGORIES_NORMALITZADES[neta] ?? (categoria as Element['categoria']);
}

function numeroSegur(valor: unknown, perDefecte = 0): number {
  const n = Number(valor);
  return Number.isFinite(n) ? n : perDefecte;
}

/** Transforma un element tal com arriba de l'API al model intern de l'aplicació. */
export function adaptarElement(apiElement: ElementApiResponse): Element {
  return {
    // L'API (json-server) assigna ids com a string, no sempre numèrics
    // (p. ex. a les creacions amb POST), així que es manté com a string.
    id: String(apiElement.id),
    titol: (apiElement.titol ?? '').trim(),
    descripcio: (apiElement.descripcio ?? '').trim(),
    categoria: normalitzaCategoria(apiElement.categoria),
    dataActualitzacio: apiElement.darrera_actualitzacio,
    valoracio: numeroSegur(apiElement.valoracio_mitjana),
    destacat: apiElement.popular === true,
  };
}

export function adaptarElements(apiElements: ElementApiResponse[]): Element[] {
  return apiElements.map(adaptarElement);
}

/** Camí invers: prepara un element nou en el format que espera l'API. */
export function prepararElementApi(nou: NouElement): Omit<ElementApiResponse, 'id'> {
  const avui = new Date().toISOString().slice(0, 10);

  return {
    titol: nou.titol.trim(),
    descripcio: nou.descripcio.trim(),
    categoria: nou.categoria,
    darrera_actualitzacio: avui,
    valoracio_mitjana: String(numeroSegur(nou.valoracio)),
    popular: false,
  };
}
