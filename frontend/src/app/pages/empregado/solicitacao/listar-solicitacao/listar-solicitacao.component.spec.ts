import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListarSolicitacaoComponent } from "./listar-solicitacao.component";

describe("ListarSolicitacaoComponent", () => {
  let component: ListarSolicitacaoComponent;
  let fixture: ComponentFixture<ListarSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarSolicitacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarSolicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
