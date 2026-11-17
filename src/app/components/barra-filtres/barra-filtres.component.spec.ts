import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BarraFiltresComponent } from './barra-filtres.component';
import { HistorialCerquesService } from '../../services/historial-cerques.service';
import { CriterisCerca, TOTES_LES_CATEGORIES } from '../../services/element.service';

describe('BarraFiltresComponent', () => {
  let component: BarraFiltresComponent;
  let fixture: ComponentFixture<BarraFiltresComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [BarraFiltresComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(BarraFiltresComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('marca error de longitud mínima amb 1 o 2 caràcters, sense consultar l\'API', async () => {
    component.filtresForm.controls.text.setValue('ar');
    component.filtresForm.controls.text.markAsTouched();
    await fixture.whenStable();

    expect(component.mostrarErrors).toBe(true);
    expect(component.missatgeError).toContain('almenys 3 caràcters');
    expect(component.filtresForm.invalid).toBe(true);
  });

  it('emet els criteris per defecte en prémer Aplicar sense escriure res', async () => {
    let rebut: CriterisCerca | undefined;
    component.filtresAplicats.subscribe((c: CriterisCerca) => (rebut = c));

    component.aplicarFiltres();
    await fixture.whenStable();

    expect(rebut).toEqual({ text: '', categoria: TOTES_LES_CATEGORIES });
  });

  it('emet la categoria seleccionada en prémer Aplicar', async () => {
    let rebut: CriterisCerca | undefined;
    component.filtresAplicats.subscribe((c: CriterisCerca) => (rebut = c));

    component.filtresForm.controls.categoria.setValue('Àudio');
    component.aplicarFiltres();
    await fixture.whenStable();

    expect(rebut).toEqual({ text: '', categoria: 'Àudio' });
  });

  it('restableix el formulari als valors per defecte i els emet', async () => {
    let rebut: CriterisCerca | undefined;
    component.filtresForm.controls.categoria.setValue('Energia');
    component.filtresAplicats.subscribe((c: CriterisCerca) => (rebut = c));

    component.restablirFiltres();
    await fixture.whenStable();

    expect(component.filtresForm.value.categoria).toBe(TOTES_LES_CATEGORIES);
    expect(rebut).toEqual({ text: '', categoria: TOTES_LES_CATEGORIES });
  });

  it('no desa a l\'historial una cerca de categoria sense text (menys de 3 caràcters)', async () => {
    const historial = TestBed.inject(HistorialCerquesService);
    component.filtresForm.controls.categoria.setValue('Energia');

    component.aplicarFiltres();
    await fixture.whenStable();

    expect(historial.historial()).toHaveLength(0);
  });
});
