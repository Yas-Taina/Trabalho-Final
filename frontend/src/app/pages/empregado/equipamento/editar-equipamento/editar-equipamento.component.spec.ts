import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditarEquipamentoComponent } from "./editar-equipamento.component";

describe("EditarEquipamentoComponent", () => {
  let component: EditarEquipamentoComponent;
  let fixture: ComponentFixture<EditarEquipamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarEquipamentoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarEquipamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
