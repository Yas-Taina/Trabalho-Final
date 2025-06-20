package br.net.backend.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public class EntidadeBase {
  @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;
}
