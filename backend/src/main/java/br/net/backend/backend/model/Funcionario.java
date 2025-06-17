package br.net.backend.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "funcionario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_funcionario")
    private Long id;

    @OneToOne
    @JoinColumn(name = "id_pessoa", unique = true, nullable = false)
    private Pessoa pessoa;

    @Column(name = "data_nasc", nullable = false)
    private LocalDate dataNasc;
}
