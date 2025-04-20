import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirEquipamentoComponent } from './inserir-equipamento.component';

describe('InserirEquipamentoComponent', () => {
  let component: InserirEquipamentoComponent;
  let fixture: ComponentFixture<InserirEquipamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InserirEquipamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InserirEquipamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
