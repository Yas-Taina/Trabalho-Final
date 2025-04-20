import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InserirSolicitacaoComponent } from "./inserir-solicitacao.component";

describe("InserirSolicitacaoComponent", () => {
  let component: InserirSolicitacaoComponent;
  let fixture: ComponentFixture<InserirSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InserirSolicitacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InserirSolicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
