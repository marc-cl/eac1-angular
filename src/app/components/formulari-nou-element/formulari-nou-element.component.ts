import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaElement } from '../../models/element.model';
import { ElementService } from '../../services/element.service';

const CATEGORIES: readonly CategoriaElement[] = [
  'Electrònica',
  'Àudio',
  'Accessoris',
  'Pantalles',
  'Energia',
];

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-formulari-nou-element',
  styleUrl: './formulari-nou-element.component.scss',
  templateUrl: './formulari-nou-element.component.html',
})
export class FormulariNouElementComponent {
  private readonly elementService = inject(ElementService);

  readonly categories = CATEGORIES;

  readonly formulari = new FormGroup({
    titol: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    descripcio: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
    categoria: new FormControl<CategoriaElement>('Electrònica', { nonNullable: true, validators: [Validators.required] }),
    valoracio: new FormControl(3, { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(5)] }),
  });

  readonly enviant = signal(false);
  readonly missatge = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  crear(): void {
    if (this.formulari.invalid) {
      this.formulari.markAllAsTouched();
      return;
    }

    this.enviant.set(true);
    this.missatge.set(null);
    this.error.set(null);

    this.elementService.crearElement(this.formulari.getRawValue()).subscribe({
      next: (element) => {
        this.missatge.set(`S'ha creat "${element.titol}" amb l'identificador ${element.id}.`);
        this.formulari.reset({ titol: '', descripcio: '', categoria: 'Electrònica', valoracio: 3 });
        this.enviant.set(false);
      },
      error: () => {
        this.error.set("No s'ha pogut crear l'element. Comproveu que l'API està activa.");
        this.enviant.set(false);
      },
    });
  }

  teError(control: 'titol' | 'descripcio' | 'valoracio'): boolean {
    const c = this.formulari.controls[control];
    return c.invalid && (c.dirty || c.touched);
  }
}
