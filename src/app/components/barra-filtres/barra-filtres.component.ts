import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CercaDesada } from '../../models/element.model';
import { CategoriaFiltre, CriterisCerca, ElementService, TOTES_LES_CATEGORIES } from '../../services/element.service';
import { HistorialCerquesService } from '../../services/historial-cerques.service';
import { termeAmbResultatsValidator } from '../../validadors/terme-amb-resultats.validator';

export const CATEGORIES_FILTRE: readonly CategoriaFiltre[] = [
  TOTES_LES_CATEGORIES,
  'Electrònica',
  'Àudio',
  'Accessoris',
  'Pantalles',
  'Energia',
];

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-barra-filtres',
  styleUrl: './barra-filtres.component.scss',
  templateUrl: './barra-filtres.component.html',
})
export class BarraFiltresComponent {
  private readonly elementService = inject(ElementService);
  readonly historial = inject(HistorialCerquesService);

  filtresAplicats = output<CriterisCerca>();

  readonly categories = CATEGORIES_FILTRE;
  readonly totes = TOTES_LES_CATEGORIES;

  readonly filtresForm = new FormGroup({
    text: new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(3)],
      asyncValidators: [termeAmbResultatsValidator(this.elementService)],
    }),
    categoria: new FormControl<CategoriaFiltre>(TOTES_LES_CATEGORIES, { nonNullable: true }),
  });

  get text(): FormControl<string> {
    return this.filtresForm.controls.text;
  }

  get mostrarErrors(): boolean {
    return this.text.invalid && (this.text.dirty || this.text.touched);
  }

  get missatgeError(): string {
    if (this.text.hasError('minlength')) {
      return 'El text de cerca ha de tenir almenys 3 caràcters.';
    }
    if (this.text.hasError('senseResultats')) {
      return 'Cap element coincideix amb aquest text.';
    }
    return '';
  }

  aplicarFiltres(): void {
    if (this.filtresForm.invalid) {
      this.filtresForm.markAllAsTouched();
      return;
    }

    const criteris = this.filtresForm.getRawValue();
    this.historial.desar(criteris.text, criteris.categoria);
    this.emetre();
  }

  restablirFiltres(): void {
    this.filtresForm.reset({ text: '', categoria: TOTES_LES_CATEGORIES });
    this.emetre();
  }

  recuperar(cerca: CercaDesada): void {
    this.filtresForm.patchValue({
      text: cerca.text,
      categoria: cerca.categoria as CategoriaFiltre,
    });
    this.aplicarFiltres();
  }

  private emetre(): void {
    this.filtresAplicats.emit(this.filtresForm.getRawValue());
  }
}
