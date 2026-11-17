export type CategoriaElement =
  | 'Electrònica'
  | 'Àudio'
  | 'Accessoris'
  | 'Pantalles'
  | 'Energia';

export interface Element {
  id: string;
  titol: string;
  descripcio: string;
  categoria: CategoriaElement;
  dataActualitzacio: string;
  valoracio: number;
  destacat?: boolean;
}

/** Forma real de les dades tal com les retorna l'API (json-server). */
export interface ElementApiResponse {
  id: string;
  titol: string;
  descripcio: string;
  categoria: string;
  darrera_actualitzacio: string;
  valoracio_mitjana: string;
  popular: boolean;
}

/** Camps necessaris per donar d'alta un element nou (l'id l'assigna l'API). */
export type NouElement = Pick<Element, 'titol' | 'descripcio' | 'categoria' | 'valoracio'>;

export type EstatServei = 'inicial' | 'carregant' | 'exit' | 'error';

export interface EstatElements {
  estat: EstatServei;
  elements: Element[];
  error?: string;
}

/** Cerca confirmada per l'usuari, desada a l'historial. */
export interface CercaDesada {
  text: string;
  categoria: string;
  data: string;
}
