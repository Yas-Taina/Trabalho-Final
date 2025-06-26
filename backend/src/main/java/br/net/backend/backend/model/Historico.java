package br.net.backend.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

@Entity
@Table(name = "historico")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Historico extends EntidadeBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historico")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_solicitacao")
    private Solicitacao solicitacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoEnum estado;

    @Column(name = "data", nullable = false)
    private LocalDateTime data;

    @ManyToOne(optional = true)
    @JoinColumn(name = "id_func")
    private Funcionario funcionario;

    @Column(name = "mensagem")
    private String mensagem; // <-- Campo necessário para getMensagem()
}
