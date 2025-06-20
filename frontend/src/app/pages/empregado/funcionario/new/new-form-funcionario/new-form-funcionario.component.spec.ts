import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFormFuncionarioComponent } from './new-form-funcionario.component';

describe('NewFormFuncionarioComponent', () => {
  let component: NewFormFuncionarioComponent;
  let fixture: ComponentFixture<NewFormFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFormFuncionarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewFormFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
