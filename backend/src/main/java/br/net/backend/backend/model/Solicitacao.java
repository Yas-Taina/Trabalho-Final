package br.net.backend.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacao")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Solicitacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitacao")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_func")
    private Funcionario funcionario;

    @Column(name = "defeito", nullable = false)
    private String defeito;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_equipamento")
    private Equipamento equipamento;

    @Column(name = "data_aberta", nullable = false)
    private LocalDateTime dataAberta;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoEnum estado = EstadoEnum.Aberta;

    @Column(name = "valor")
    private BigDecimal valor;

    @Column(name = "mensagem")
    private String mensagem;

    @Column(name = "servico")
    private String servico;
}
