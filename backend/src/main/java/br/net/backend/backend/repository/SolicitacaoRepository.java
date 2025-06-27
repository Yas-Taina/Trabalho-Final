package br.net.backend.backend.repository;

import br.net.backend.backend.dto.ReceitaCategoriaDTO;
import br.net.backend.backend.model.EstadoEnum;
import br.net.backend.backend.model.Solicitacao;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
  /**
     * Receita POR CATEGORIA (já funcionando):
     */
    @Query("""
        SELECT new br.net.backend.backend.dto.ReceitaCategoriaDTO(
                 s.equipamento.nome,
                 SUM(s.valor)
               )
          FROM Solicitacao s
         WHERE s.estado IN :estados
         GROUP BY s.equipamento.nome
         ORDER BY SUM(s.valor) DESC
    """)
    List<ReceitaCategoriaDTO> findReceitaPorCategoria(
        @Param("estados") List<EstadoEnum> estados
    );

}


