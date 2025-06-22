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
    private Long idcliente;
    private Long idempregado;
    private String data;
    private EstadoEnum estado;
    private Long equipamento;
    private String defeito;
    private Double valor;
    // private String descricao;
    private String manutencao;
    private String mensagem;
    // private String historico;
}


