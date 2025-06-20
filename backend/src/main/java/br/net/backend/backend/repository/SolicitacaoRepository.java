package br.net.backend.backend.repository;

import br.net.backend.backend.model.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    // Métodos personalizados podem ser adicionados aqui
}
