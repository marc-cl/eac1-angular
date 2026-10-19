import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DADES_MOCK } from './mocks/dades-mock';
import { Element } from './models/element.model';
import {
  BarraFiltresComponent,
  FiltresElement,
  TOTES_LES_CATEGORIES,
} from './components/barra-filtres/barra-filtres.component';
import { LlistaElementsComponent } from './components/llista-elements/llista-elements.component';

/** Durada simulada de la càrrega inicial dels elements. */
const TEMPS_CARREGA_MS = 300;

@Component({
  imports: [RouterOutlet, DatePipe, BarraFiltresComponent, LlistaElementsComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal("Catàleg d'elements");

  protected readonly elements: readonly Element[] = DADES_MOCK;
  protected readonly totalElements = this.elements.length;

  protected readonly carregant = signal(true);
  protected readonly textFiltre = signal('');
  protected readonly categoriaFiltre = signal<FiltresElement['categoria']>(TOTES_LES_CATEGORIES);
  protected readonly elementSeleccionat = signal<Element | null>(null);

  protected readonly elementsFiltrats = computed<Element[]>(() => {
    const text = this.textFiltre().trim().toLowerCase();
    const categoria = this.categoriaFiltre();

    return this.elements.filter((element) => {
      const coincideixCategoria =
        categoria === TOTES_LES_CATEGORIES || element.categoria === categoria;
      const coincideixText =
        text.length === 0 ||
        element.titol.toLowerCase().includes(text) ||
        element.descripcio.toLowerCase().includes(text);

      return coincideixCategoria && coincideixText;
    });
  });

  constructor() {
    setTimeout(() => this.carregant.set(false), TEMPS_CARREGA_MS);
  }

  protected aplicarFiltres(filtres: FiltresElement): void {
    this.textFiltre.set(filtres.text);
    this.categoriaFiltre.set(filtres.categoria);
  }

  protected seleccionarElement(element: Element): void {
    this.elementSeleccionat.set(element);
  }

  protected tancarDetall(): void {
    this.elementSeleccionat.set(null);
  }
}
