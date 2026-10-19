import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Element } from '../../models/element.model';
import { EtiquetaElementComponent } from '../etiqueta-element/etiqueta-element.component';

@Component({
  imports: [DatePipe, EtiquetaElementComponent],
  selector: 'app-targeta-element',
  styleUrl: './targeta-element.component.scss',
  templateUrl: './targeta-element.component.html',
})
export class TargetaElementComponent {
  @Input() element!: Element;

  @Output() elementSeleccionat = new EventEmitter<Element>();

  seleccionar(): void {
    this.elementSeleccionat.emit(this.element);
  }
}
