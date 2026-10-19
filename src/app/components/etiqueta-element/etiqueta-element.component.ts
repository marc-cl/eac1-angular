import { Component, Input } from '@angular/core';
import { CategoriaElement } from '../../models/element.model';

@Component({
  imports: [],
  selector: 'app-etiqueta-element',
  styleUrl: './etiqueta-element.component.scss',
  templateUrl: './etiqueta-element.component.html',
})
export class EtiquetaElementComponent {
  @Input() categoria!: CategoriaElement;
}
