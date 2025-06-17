package br.net.backend.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "historico")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Historico {
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

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_func")
    private Funcionario funcionario;
}
