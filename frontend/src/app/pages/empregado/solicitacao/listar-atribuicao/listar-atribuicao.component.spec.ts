import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListarAtribuicaoComponent } from "./listar-atribuicao.component";

describe("ListarAtribuicaoComponent", () => {
  let component: ListarAtribuicaoComponent;
  let fixture: ComponentFixture<ListarAtribuicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAtribuicaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarAtribuicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
