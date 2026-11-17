import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Element } from './models/element.model';
import { CriterisCerca, ElementService } from './services/element.service';
import { BarraFiltresComponent } from './components/barra-filtres/barra-filtres.component';
import { LlistaElementsComponent } from './components/llista-elements/llista-elements.component';
import { FormulariNouElementComponent } from './components/formulari-nou-element/formulari-nou-element.component';

@Component({
  imports: [
    RouterOutlet,
    DatePipe,
    BarraFiltresComponent,
    LlistaElementsComponent,
    FormulariNouElementComponent,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal("Catàleg d'elements");

  protected readonly elementService = inject(ElementService);
  protected readonly elementSeleccionat = signal<Element | null>(null);

  ngOnInit(): void {
    this.elementService.carregarTot();
  }

  protected aplicarFiltres(criteris: CriterisCerca): void {
    this.elementSeleccionat.set(null);
    this.elementService.cercar(criteris);
  }

  protected reintentar(): void {
    this.elementService.reintentar();
  }

  protected seleccionarElement(element: Element): void {
    this.elementSeleccionat.set(element);
  }

  protected tancarDetall(): void {
    this.elementSeleccionat.set(null);
  }
}
