import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TargetaElementComponent } from './targeta-element.component';
import { Element } from '../../models/element.model';

describe('TargetaElementComponent', () => {
  let component: TargetaElementComponent;
  let fixture: ComponentFixture<TargetaElementComponent>;

  const elementDeProva: Element = {
    id: 1,
    titol: 'Element de prova',
    descripcio: 'Descripció de prova',
    categoria: 'Electrònica',
    dataActualitzacio: '2026-01-01',
    valoracio: 4,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetaElementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TargetaElementComponent);
    component = fixture.componentInstance;
    component.element = elementDeProva;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
