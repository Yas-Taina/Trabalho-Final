package br.net.backend.backend.dto;

import br.net.backend.backend.model.Endereco;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO {
    private Long id;
    private String nome;
    private String email;
    private String senha;
    private String cpf;
    private Endereco endereco;
    private String telefone; // Usar String para facilitar binding JSON
}
