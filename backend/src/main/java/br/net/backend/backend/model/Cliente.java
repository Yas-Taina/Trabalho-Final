package br.net.backend.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cliente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long id;

    @OneToOne
    @JoinColumn(name = "id_pessoa", unique = true, nullable = false)
    private Pessoa pessoa;

    @Column(name = "cpf", unique = true, nullable = false)
    private String cpf;

    @ManyToOne
    @JoinColumn(name = "id_endereco")
    private Endereco endereco;

    @Column(name = "telefone")
    private String telefone;
}
