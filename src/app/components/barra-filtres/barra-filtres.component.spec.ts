import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarraFiltresComponent } from './barra-filtres.component';

describe('BarraFiltresComponent', () => {
  let component: BarraFiltresComponent;
  let fixture: ComponentFixture<BarraFiltresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarraFiltresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BarraFiltresComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
