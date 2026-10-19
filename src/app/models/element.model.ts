export type CategoriaElement =
  | 'Electrònica'
  | 'Àudio'
  | 'Accessoris'
  | 'Pantalles'
  | 'Energia';

export interface Element {
  id: number;
  titol: string;
  descripcio: string;
  categoria: CategoriaElement;
  dataActualitzacio: string;
  valoracio: number;
  destacat?: boolean;
}
