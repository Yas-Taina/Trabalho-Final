package br.net.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Representa um registro de histórico de uma solicitação.
 */
@Data
@AllArgsConstructor
public class HistoricoDTO {
    private Long id;             // id do histórico
    private Integer estado;      // ordinal do EstadoEnum
    private String data;         // data/hora em ISO string
    private Long idFuncionario;  // id do funcionário que registrou (pode ser null)
    private String nomeFuncionario; // nome do funcionário (pode ser null)
    private String mensagem;     // mensagem registrada no histórico
}