import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEquipamentoComponent } from './listar-equipamento.component';

describe('ListarEquipamentoComponent', () => {
  let component: ListarEquipamentoComponent;
  let fixture: ComponentFixture<ListarEquipamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarEquipamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarEquipamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
