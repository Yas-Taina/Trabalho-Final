export enum EstadosSolicitacao {
  Aberta,
  Orcada,
  Aprovada,
  Rejeitada,
  Redirecionada,
  Arrumada,
  Paga,
  Finalizada,
}

const EstadosSolicitacaoAmigaveis = {
  [EstadosSolicitacao.Aberta]: "Aberta",
  [EstadosSolicitacao.Orcada]: "Orçada",
  [EstadosSolicitacao.Aprovada]: "Aprovada",
  [EstadosSolicitacao.Rejeitada]: "Rejeitada",
  [EstadosSolicitacao.Redirecionada]: "Redirecionada",
  [EstadosSolicitacao.Arrumada]: "Arrumada",
  [EstadosSolicitacao.Paga]: "Paga",
  [EstadosSolicitacao.Finalizada]: "Finalizada",
};

export function getEstadoAmigavelSolicitacao(estado: EstadosSolicitacao): string {
  return EstadosSolicitacaoAmigaveis[estado];
}

const CoresEstadosSolicitacao = {
  [EstadosSolicitacao.Aberta]: "gray",
  [EstadosSolicitacao.Orcada]: "brown",
  [EstadosSolicitacao.Aprovada]: "yellow",
  [EstadosSolicitacao.Rejeitada]: "red",
  [EstadosSolicitacao.Redirecionada]: "purple",
  [EstadosSolicitacao.Arrumada]: "blue",
  [EstadosSolicitacao.Paga]: "orange",
  [EstadosSolicitacao.Finalizada]: "green",
};

export function getCorEstadoSolicitacao(estado: EstadosSolicitacao): string {
  return CoresEstadosSolicitacao[estado];
}