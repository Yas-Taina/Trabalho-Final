package br.net.backend.backend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor

public class CriaSolicitacaoDTO {
    private Long idcliente;
    private Long equipamento;
    private String descricao;
    private String defeito;
}
