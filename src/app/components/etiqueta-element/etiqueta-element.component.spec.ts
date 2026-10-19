import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EtiquetaElementComponent } from './etiqueta-element.component';

describe('EtiquetaElementComponent', () => {
  let component: EtiquetaElementComponent;
  let fixture: ComponentFixture<EtiquetaElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtiquetaElementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EtiquetaElementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
