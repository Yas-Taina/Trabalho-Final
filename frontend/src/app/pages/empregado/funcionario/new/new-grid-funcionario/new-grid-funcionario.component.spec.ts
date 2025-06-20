import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGridFuncionarioComponent } from './new-grid-funcionario.component';

describe('NewGridFuncionarioComponent', () => {
  let component: NewGridFuncionarioComponent;
  let fixture: ComponentFixture<NewGridFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewGridFuncionarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewGridFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
