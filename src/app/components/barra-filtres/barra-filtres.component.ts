import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CategoriaElement } from '../../models/element.model';

export const TOTES_LES_CATEGORIES = 'Totes' as const;

export type CategoriaFiltre = CategoriaElement | typeof TOTES_LES_CATEGORIES;

export interface FiltresElement {
  text: string;
  categoria: CategoriaFiltre;
}

export const CATEGORIES_FILTRE: readonly CategoriaFiltre[] = [
  TOTES_LES_CATEGORIES,
  'Electrònica',
  'Àudio',
  'Accessoris',
  'Pantalles',
  'Energia',
];

@Component({
  imports: [FormsModule],
  selector: 'app-barra-filtres',
  styleUrl: './barra-filtres.component.scss',
  templateUrl: './barra-filtres.component.html',
})
export class BarraFiltresComponent {
  @Output() filtresAplicats = new EventEmitter<FiltresElement>();

  readonly categories = CATEGORIES_FILTRE;
  readonly totes = TOTES_LES_CATEGORIES;

  text = '';
  categoria: CategoriaFiltre = TOTES_LES_CATEGORIES;

  aplicarFiltres(formulari: NgForm): void {
    if (formulari.invalid) {
      return;
    }

    this.filtresAplicats.emit({ text: this.text.trim(), categoria: this.categoria });
  }

  restablirFiltres(formulari: NgForm): void {
    this.text = '';
    this.categoria = TOTES_LES_CATEGORIES;
    formulari.resetForm({ text: '', categoria: TOTES_LES_CATEGORIES });

    this.filtresAplicats.emit({ text: '', categoria: TOTES_LES_CATEGORIES });
  }
}
