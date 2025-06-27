package br.net.backend.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ReceitaCategoriaDTO {
    private String nomeCategoria;
    private BigDecimal total;
}
