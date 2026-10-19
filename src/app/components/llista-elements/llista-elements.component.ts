import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Element } from '../../models/element.model';
import { TargetaElementComponent } from '../targeta-element/targeta-element.component';

@Component({
  imports: [TargetaElementComponent],
  selector: 'app-llista-elements',
  styleUrl: './llista-elements.component.scss',
  templateUrl: './llista-elements.component.html',
})
export class LlistaElementsComponent {
  @Input() elements: Element[] = [];
  @Input() elementSeleccionat: Element | null = null;

  @Output() elementSeleccionatChange = new EventEmitter<Element>();

  onSeleccio(element: Element): void {
    this.elementSeleccionatChange.emit(element);
  }
}
