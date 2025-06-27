package br.net.backend.backend.dto;

import br.net.backend.backend.model.EstadoEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoDTO {
    private Long id;
    private Long idCliente ;
    private Long idempregado;
    private String dataAberta ;
    private int estado;
    private Long equipamento;
    private String descricao ;
    private Double valor;
    // private String descricao;
    private String manutencao;
    private String recomendacao;
    private String mensagem;
    // private String historico;
}


