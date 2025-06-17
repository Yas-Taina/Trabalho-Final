package br.net.backend.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "equipamento")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Equipamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_equipamento")
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "descricao")
    private String descricao;
}
